"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase/firebase";
import { User, Competition } from "@/interfaces";
import { useToast } from "@/hooks/use-toast";

export const ageGroups = {
  male: ["м14", "м16", "м19", "м21", "м40", "м50", "м60", "м70"],
  female: ["ж14", "ж16", "ж19", "ж21", "ж35", "ж50"],
};

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [pastCompetitions, setPastCompetitions] = useState<Competition[]>([]);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<
    Competition[]
  >([]);
  const [showUpcomingCompetitions, setShowUpcomingCompetitions] =
    useState(false);
  const [showPastCompetitions, setShowPastCompetitions] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/"); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data() as User;
            setUserData(data);
            setIsAdmin(data.role === "admin");
            setAgeGroup(data.ageGroup || "");

            const competitionsQuery = query(
              collection(db, "competitions"),
              where("participants", "array-contains", currentUser.uid)
            );
            const competitionsSnapshot = await getDocs(competitionsQuery);
            const competitions = competitionsSnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Competition)
            );

            const now = new Date();
            setPastCompetitions(
              competitions.filter((comp) => new Date(comp.date) < now)
            );
            setUpcomingCompetitions(
              competitions.filter((comp) => new Date(comp.date) >= now)
            );
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handlePasswordChangeRedirect = () => {
    router.push("/changepassword");
  };

  const handleAdminPanelRedirect = () => {
    router.push("/adminpanel");
  };

  const handleAgeGroupChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedAgeGroup = event.target.value;
    if (userData) {
      const birthDate = new Date(userData.birthDate);
      const age = new Date().getFullYear() - birthDate.getFullYear();

      const validAgeGroups = ageGroups[
        userData.gender === "male" ? "male" : "female"
      ].filter((group) => {
        const groupAge = parseInt(group.replace(/\D/g, ""), 10);
        if (age < 21) {
          return groupAge <= 21 && groupAge >= age;
        } else {
          return groupAge >= 21 && groupAge <= age;
        }
      });

      if (validAgeGroups.includes(selectedAgeGroup)) {
        setAgeGroup(selectedAgeGroup);
        try {
          const userDocRef = doc(db, "users", auth.currentUser!.uid);
          await updateDoc(userDocRef, { ageGroup: selectedAgeGroup });
        } catch (err) {
          console.error("Error updating age group:", err);
        }
      } else {
        toast({
          title: "Невалидна възрастова група",
          description: "Изберете валидна възрастова група за вашия възраст",
          variant: "destructive",
        });
      }
    }
  };

  const toggleUpcomingCompetitions = () => {
    setShowUpcomingCompetitions(!showUpcomingCompetitions);
  };

  const togglePastCompetitions = () => {
    setShowPastCompetitions(!showPastCompetitions);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-800 py-16">
        <div className="container mx-auto flex flex-col items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h1 className="text-3xl font-bold text-orange-500 mb-6">Профил</h1>

            {userData ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">Име:</div>
                  <div className="text-lg">{userData.fullName}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">Email:</div>
                  <div className="text-lg">{userData.email}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">Дата на раждане:</div>
                  <div className="text-lg">{userData.birthDate}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">Пол:</div>
                  <div className="text-lg">
                    {userData.gender === "male" ? "Мъж" : "Жена"}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">
                    Дата на регистрация:
                  </div>
                  <div className="text-lg">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold">Възрастова група:</div>
                  <select
                    value={ageGroup}
                    onChange={handleAgeGroupChange}
                    className="text-lg border rounded p-2"
                  >
                    <option value="">Изберете възрастова група</option>
                    {ageGroups[
                      userData.gender === "male" ? "male" : "female"
                    ].map((group) => (
                      <option key={group} value={group}>
                        {group.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    onClick={toggleUpcomingCompetitions}
                    className="w-full text-gray-800 py-2 rounded transition mt-4 flex justify-between items-center"
                  >
                    <span>Предстоящи състезания</span>
                    <span
                      className={`transform transition-transform ${
                        showUpcomingCompetitions ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {showUpcomingCompetitions && (
                    <div className="mt-2 animate-fade-in">
                      {upcomingCompetitions.length === 0 ? (
                        <p>Няма предстоящи състезания.</p>
                      ) : (
                        <ul className="list-disc list-inside">
                          {upcomingCompetitions.map((comp) => (
                            <li key={comp.id}>
                              {comp.name} -{" "}
                              {new Date(comp.date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={togglePastCompetitions}
                    className="w-full text-gray-800 py-2 rounded transition mt-4 flex justify-between items-center"
                  >
                    <span>Минали състезания</span>
                    <span
                      className={`transform transition-transform ${
                        showPastCompetitions ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {showPastCompetitions && (
                    <div className="mt-2 animate-fade-in">
                      {pastCompetitions.length === 0 ? (
                        <p>Няма минали състезания.</p>
                      ) : (
                        <ul className="list-disc list-inside">
                          {pastCompetitions.map((comp) => (
                            <li key={comp.id}>
                              {comp.name} -{" "}
                              {new Date(comp.date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={handleAdminPanelRedirect}
                    className="w-full bg-white text-orange-500 border border-orange-500 py-2 rounded transition mt-4 hover:bg-orange-500 hover:text-white"
                  >
                    Администраторски панел
                  </button>
                )}
              </div>
            ) : (
              <p>Зареждане на данни...</p>
            )}

            <button
              onClick={handlePasswordChangeRedirect}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition mt-4"
            >
              Смяна на паролата
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-white text-red-500 border border-red-500 py-2 rounded transition mt-4 hover:bg-red-500 hover:text-white"
            >
              Изход
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePage;
