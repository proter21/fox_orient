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
import dynamic from "next/dynamic";
import { auth, db } from "../firebase/firebase";
import { User, Competition } from "@/interfaces";
import { useToast } from "@/hooks/use-toast";

const MyNavbar = dynamic(() => import("@/components/MyNavbar"), { ssr: false });
const MyFooter = dynamic(() => import("@/components/MyFooter"), { ssr: false });

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

  return (
    <>
      <MyNavbar />
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
                  <h2 className="text-xl font-semibold mb-2">
                    Предстоящи състезания
                  </h2>
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
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Минали състезания
                  </h2>
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
                {isAdmin && (
                  <button
                    onClick={handleAdminPanelRedirect}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition mt-4"
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
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition mt-4"
            >
              Изход
            </button>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default ProfilePage;
