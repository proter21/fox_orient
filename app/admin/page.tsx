"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { User, Competition } from "@/interfaces";
import { db, auth } from "@/firebase/firebase";
import { useToast } from "@/hooks/use-toast";

const ageGroups = {
  male: ["м14", "м16", "м19", "м21", "м40", "м50", "м60", "м70"],
  female: ["ж14", "ж16", "ж19", "ж21", "ж35", "ж50"],
};

const AdminPanelPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          setUser(userData);
          if (!userData.role || userData.role !== "admin") {
            toast({
              title: "Нямате достъп до тази страница",
              description:
                "Трябва да сте администратор, за да достъпите тази страница.",
              variant: "destructive",
            });
            router.push("/");
            return;
          }
        }
      } else {
        toast({
          title: "Нямате достъп до тази страница",
          description:
            "Трябва да сте влезли в профила си, за да достъпите тази страница.",
          variant: "destructive",
        });
        router.push("/login");
      }
    };

    fetchData();
  }, [router, toast]);

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

  useEffect(() => {
    fetchAllUsers();
    fetchCompetitions();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Render nothing if not authenticated or not an admin
  }

  const handleCreateUser = async () => {
    try {
      await addDoc(collection(db, "users"), newUser);
      setNewUser({});
      toast({
        title: "Админ",
        description: "Потребителят е създаден успешно.",
        variant: "default",
      });
      fetchAllUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      toast({
        title: "Грешка",
        description: "Възникна грешка при създаването на потребителя.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (
    userId: string,
    updatedData: Partial<User>
  ) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, updatedData);
      toast({
        title: "Админ",
        description: "Потребителят е актуализиран успешно.",
        variant: "default",
      });
      setEditingUser(null);
      fetchAllUsers();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error updating user:", err.message);
      } else {
        console.error("Error updating user:", err);
      }
      toast({
        title: "Грешка",
        description: "Възникна грешка при актуализирането на потребителя.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
      setAllUsers(allUsers.filter((user) => user.id !== userId));
      toast({
        title: "Админ",
        description: "Потребителят е изтрит успешно.",
        variant: "default",
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast({
        title: "Грешка",
        description: "Възникна грешка при изтриването на потребителя.",
        variant: "destructive",
      });
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
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">
            Административен Панел
          </h1>

          {/* Create User Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-orange-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
              Създаване на нов потребител
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Име"
                value={newUser.fullName || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullName: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <input
                type="date"
                placeholder="Дата на раждане"
                value={newUser.birthDate || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, birthDate: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <select
                value={newUser.gender || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, gender: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="">Изберете пол</option>
                <option value="male">Мъж</option>
                <option value="female">Жена</option>
              </select>
              <select
                value={newUser.ageGroup || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, ageGroup: e.target.value })
                }
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="">Изберете възрастова група</option>
                {ageGroups[newUser.gender === "male" ? "male" : "female"].map(
                  (group) => (
                    <option key={group} value={group}>
                      {group.toUpperCase()}
                    </option>
                  )
                )}
              </select>
              <button
                onClick={handleCreateUser}
                className="md:col-span-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
              >
                Създай потребител
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="grid gap-8">
            {allUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-2 border-orange-100"
              >
                <div className="flex flex-wrap lg:flex-nowrap gap-8">
                  {/* User Info Section */}
                  <div className="w-full lg:w-1/2">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200 flex items-center">
                      <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
                      Информация за потребителя
                    </h2>
                    <div className="space-y-4">
                      <InfoRow label="Име" value={user.fullName} />
                      <InfoRow label="Email" value={user.email} />
                      <InfoRow label="Дата на раждане" value={user.birthDate} />
                      <InfoRow
                        label="Пол"
                        value={user.gender === "male" ? "Мъж" : "Жена"}
                      />
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-40">
                          Възрастова група:
                        </span>
                        <select
                          value={user.ageGroup}
                          onChange={(e) =>
                            handleUpdateUser(user.id, {
                              ageGroup: e.target.value,
                            })
                          }
                          className="text-lg border rounded p-2"
                        >
                          <option value="">Изберете възрастова група</option>
                          {ageGroups[
                            user.gender === "male" ? "male" : "female"
                          ].map((group) => (
                            <option key={group} value={group}>
                              {group.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <InfoRow
                        label="Регистриран на"
                        value={new Date(user.createdAt).toLocaleDateString()}
                      />
                    </div>
                  </div>

                  {/* Competitions Section */}
                  <div className="w-full lg:w-1/2">
                    <div className="space-y-8">
                      <CompetitionsList
                        title="Предстоящи състезания"
                        competitions={getUserCompetitions(user.id, false)}
                        titleColor="text-orange-600"
                      />

                      <CompetitionsList
                        title="Минали състезания"
                        competitions={getUserCompetitions(user.id, true)}
                        titleColor="text-orange-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-8 pt-4 border-t-2 border-orange-100">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                  >
                    Редактирай
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                  >
                    Изтрий
                  </button>
                </div>

                {/* Edit Form */}
                {editingUser && editingUser.id === user.id && (
                  <div className="mt-8 bg-orange-50 p-6 rounded-xl border-2 border-orange-100">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
                      Редактиране на потребител
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Име"
                        value={editingUser.fullName || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editingUser.email || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="date"
                        placeholder="Дата на раждане"
                        value={editingUser.birthDate || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                      <select
                        value={editingUser.gender || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            gender: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="">Изберете пол</option>
                        <option value="male">Мъж</option>
                        <option value="female">Жена</option>
                      </select>
                      <select
                        value={editingUser.ageGroup || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            ageGroup: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="">Изберете възрастова група</option>
                        {ageGroups[
                          editingUser.gender === "male" ? "male" : "female"
                        ].map((group) => (
                          <option key={group} value={group}>
                            {group.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          handleUpdateUser(editingUser.id!, editingUser)
                        }
                        className="md:col-span-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                      >
                        Запази промените
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center p-3 hover:bg-orange-50 rounded-lg transition-colors">
    <span className="text-gray-600 font-medium w-40">{label}:</span>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);

const CompetitionsList = ({
  title,
  competitions,
  titleColor,
}: {
  title: string;
  competitions: Competition[];
  titleColor: string;
}) => (
  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
    <h3
      className={`text-lg font-semibold ${titleColor} mb-4 flex items-center`}
    >
      <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
      {title}
    </h3>
    {competitions.length > 0 ? (
      <ul className="space-y-3">
        {competitions.map((comp) => (
          <li
            key={comp.id}
            className="flex items-center gap-3 text-gray-700 p-2 hover:bg-white rounded-lg transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="font-medium">{comp.name}</span>
            <span className="text-gray-500">-</span>
            <span>{new Date(comp.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic p-2">Няма състезания</p>
    )}
  </div>
);

export default AdminPanelPage;
