"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import MyFooter from "@/components/MyFooter";
import { auth, db } from "../firebase/firebase";
import MyNavbar from "@/components/MyNavbar";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const router = useRouter();

  const ageGroups = {
    male: ["m14", "m16", "m19", "m21", "m40", "m50", "m60", "m70"],
    female: ["ж14", "ж16", "ж19", "ж21", "ж35", "ж50"],
  };

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
            const data = userDoc.data();
            setUserData(data);
            setIsAdmin(data.role === "admin");
            setAgeGroup(data.ageGroup || "");
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
    router.push("/admin");
  };

  const handleAgeGroupChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedAgeGroup = event.target.value;
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
      alert("Невалидна възрастова група за вашата възраст.");
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
