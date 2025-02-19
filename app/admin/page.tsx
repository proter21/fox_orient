"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { User, Competition } from "@/interfaces";

const AdminPanelPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() } as User);
        });
        setAllUsers(users);
      } catch (err) {
        console.error("Error fetching all users:", err);
      }
    };

    const fetchCompetitions = async () => {
      try {
        const competitionsSnapshot = await getDocs(
          collection(db, "competitions")
        );
        const competitionsData = competitionsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Competition)
        );
        setCompetitions(competitionsData);
      } catch (err) {
        console.error("Error fetching competitions:", err);
      }
    };

    fetchAllUsers();
    fetchCompetitions();
  }, []);

  const handleUpdateUser = async (
    userId: string,
    updatedData: Partial<User>
  ) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, updatedData);
      alert("User updated successfully");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error updating user:", err.message);
      } else {
        console.error("Error updating user:", err);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
      setAllUsers(allUsers.filter((user) => user.id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const getUserCompetitions = (userId: string, past: boolean) => {
    const now = new Date();
    return competitions.filter(
      (comp) =>
        comp.participants?.includes(userId) &&
        (past ? new Date(comp.date) < now : new Date(comp.date) >= now)
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-800 py-16">
        <div className="container mx-auto flex flex-col items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
            <h1 className="text-3xl font-bold text-orange-500 mb-6">
              Admin Panel
            </h1>
            <div className="space-y-4">
              {allUsers.map((user) => (
                <div key={user.id} className="border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">Име:</div>
                    <div className="text-lg">{user.fullName}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">Email:</div>
                    <div className="text-lg">{user.email}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">
                      Дата на раждане:
                    </div>
                    <div className="text-lg">{user.birthDate}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">Пол:</div>
                    <div className="text-lg">
                      {user.gender === "male" ? "Мъж" : "Жена"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">
                      Възрастова група:
                    </div>
                    <div className="text-lg">{user.ageGroup}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">
                      Дата на регистрация:
                    </div>
                    <div className="text-lg">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Предстоящи състезания
                    </h3>
                    <ul className="list-disc list-inside">
                      {getUserCompetitions(user.id, false).map((comp) => (
                        <li key={comp.id}>
                          {comp.name} -{" "}
                          {new Date(comp.date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Минали състезания</h3>
                    <ul className="list-disc list-inside">
                      {getUserCompetitions(user.id, true).map((comp) => (
                        <li key={comp.id}>
                          {comp.name} -{" "}
                          {new Date(comp.date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateUser(user.id, { ageGroup: "newAgeGroup" })
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition mt-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition mt-2 ml-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(AdminPanelPage);
