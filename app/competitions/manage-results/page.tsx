"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import type { Competition } from "@/interfaces";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ManageResultsSelectionPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        router.push("/");
        return;
      }

      const competitionsSnapshot = await getDocs(
        collection(db, "competitions")
      );
      const competitionsData = competitionsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Competition)
      );

      setCompetitions(
        competitionsData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setLoading(false);
    };

    checkAdminAndFetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-orange-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-orange-600 text-center sm:text-left">
              Изберете състезание
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitions.map((competition) => (
              <Link
                key={competition.id}
                href={`/competitions/${competition.id}/results`}
                className="block"
              >
                <div className="p-4 bg-white rounded-lg border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="font-medium">{competition.name}</h3>
                    <span className="text-sm text-gray-500 sm:ml-4">
                      {new Date(competition.date).toLocaleDateString("bg-BG")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {competitions.length === 0 && (
              <p className="text-center text-gray-500">
                Няма налични състезания
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
