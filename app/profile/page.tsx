"use client";

import React, { useState, useEffect } from "react";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import MyFooter from "@/components/MyFooter";
import { auth, db } from "../firebase/firebase";
import MyNavbar from "@/components/MyNavbar";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        // Redirect to homepage if user logs out
        router.push("/");
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
          } else {
            console.error("No such user document!");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Паролата трябва да бъде поне 6 символа.");
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updatePassword(currentUser, password);
        setSuccess("Паролата беше успешно сменена.");
        setPassword(""); // Clear the input field
      } else {
        setError("Неуспешно сменяне на паролата. Моля, влезте отново.");
      }
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const email = currentUser.email;
            const passwordPrompt = prompt(
              "Промяната на паролата изисква повторно влизане. Моля, въведете текущата си парола:"
            );

            if (!passwordPrompt) {
              setError("Отказано повторно влизане. Неуспешна смяна на парола.");
              return;
            }

            const credential = EmailAuthProvider.credential(
              email,
              passwordPrompt
            );
            await reauthenticateWithCredential(currentUser, credential);

            // Retry password update after reauthentication
            await updatePassword(currentUser, password);
            setSuccess("Паролата беше успешно сменена.");
            setPassword("");
          } else {
            setError("Неуспешно повторно влизане. Моля, влезте отново.");
          }
        } catch (reauthError) {
          setError("Неуспешно повторно влизане. Моля, опитайте отново.");
          console.error(reauthError);
        }
      } else {
        setError(
          "Възникна грешка при смяна на паролата. Моля, опитайте отново."
        );
        console.error(err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <>
      <MyNavbar onLogout={handleLogout} />
      <div className="min-h-screen bg-slate-50 text-gray-800 py-32 ">
        <div className="container mx-auto flex flex-col items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md ">
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

            <form onSubmit={handlePasswordChange} className="space-y-4 mt-6">
              <h2 className="text-xl font-bold text-orange-500 mb-4">
                Смяна на паролата
              </h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Нова парола:
                </label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Въведете нова парола"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
              >
                Запази промени
              </button>
            </form>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default ProfilePage;
