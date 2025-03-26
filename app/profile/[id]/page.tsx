"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { User, Competition } from "@/interfaces";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface CompetitionResult {
  id: string;
  name: string;
  date: string;
  ageGroup: string;
  place?: number;
  time?: string;
  status: "upcoming" | "completed";
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [competitions, setCompetitions] = useState<CompetitionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchUserAndCompetitions = async () => {
      try {
        const userId = typeof params?.id === "string" ? params.id : "";

        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) {
          setLoading(false);
          return;
        }

        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        setUser(userData);

        // Fetch competitions where user is participant
        const competitionsQuery = query(
          collection(db, "competitions"),
          where("participants", "array-contains", userId)
        );

        const competitionsSnapshot = await getDocs(competitionsQuery);
        const now = new Date();
        const competitionsData: CompetitionResult[] =
          competitionsSnapshot.docs.map((doc) => {
            const comp = { id: doc.id, ...doc.data() } as Competition;
            const compDate = new Date(comp.date);

            return {
              id: comp.id,
              name: comp.name,
              date: comp.date,
              ageGroup: userData.ageGroup,
              status: compDate < now ? "completed" : "upcoming",
              // Add place and time logic here when implemented
            };
          });

        setCompetitions(
          competitionsData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchUserAndCompetitions();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center mt-20">Потребителят не е намерен</div>;
  }

  const upcomingCompetitions = competitions.filter(
    (c) => c.status === "upcoming"
  );
  const completedCompetitions = competitions.filter(
    (c) => c.status === "completed"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-orange-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-600">
              Профил на състезател
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-700">Име:</span>
                <span>{user.fullName}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-700">
                  Възрастова група:
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                  {user.ageGroup}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {upcomingCompetitions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">
                Предстоящи състезания
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingCompetitions.map((comp) => (
                  <Link
                    key={comp.id}
                    href={`/competitions/${comp.id}`}
                    className="block"
                  >
                    <div className="p-4 bg-white rounded-lg border border-orange-100 hover:shadow-md hover:border-orange-300 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{comp.name}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(comp.date).toLocaleDateString("bg-BG")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Записан в група: {comp.ageGroup}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {completedCompetitions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">
                Завършени състезания
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedCompetitions.map((comp) => (
                  <Link
                    key={comp.id}
                    href={`/competitions/${comp.id}`}
                    className="block"
                  >
                    <div className="p-4 bg-white rounded-lg border border-orange-100 hover:shadow-md hover:border-orange-300 transition-all duration-300">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{comp.name}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(comp.date).toLocaleDateString("bg-BG")}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Група: {comp.ageGroup}
                        </span>
                        {comp.place && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                            {comp.place} място
                          </span>
                        )}
                        {comp.time && (
                          <span className="font-mono text-gray-600">
                            {comp.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
