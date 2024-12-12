"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import MyFooter from "@/components/MyFooter";
import { auth, db } from "../firebase/firebase";
import MyNavbar from "@/components/MyNavbar";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
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
            setUserData(userDoc.data());
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

  return (
    <>
      <MyNavbar onLogout={handleLogout} />
      <div className="min-h-screen bg-slate-50 text-gray-800 py-32">
        <div className="container mx-auto flex flex-col items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold text-orange-500 mb-4">Профил</h1>

            {userData ? (
              <div className="space-y-4">
                <p>
                  <strong>Име:</strong> {userData.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Дата на раждане:</strong> {userData.birthDate}
                </p>
                <p>
                  <strong>Дата на регистрация:</strong>{" "}
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
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
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default ProfilePage;
