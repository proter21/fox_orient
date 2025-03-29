"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CompetitionsAdminNav() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        }
      }
    };
    checkAdmin();
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="bg-orange-100 p-4 mb-6 rounded-lg shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-orange-800">
            Админ навигация
          </h2>
          <div className="flex gap-4">
            <Link
              href="/competitions/manage"
              className="text-orange-600 hover:text-orange-700 bg-white px-4 py-2 rounded-md transition-colors"
            >
              Управление на състезания
            </Link>
            <Link
              href="/competitions/manage-results"
              className="text-orange-600 hover:text-orange-700 bg-white px-4 py-2 rounded-md transition-colors"
            >
              Управление на резултати
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
