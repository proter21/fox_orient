"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase/firebase";
import type { Competition, User } from "@/interfaces";

async function fetchCompetitions(): Promise<Competition[]> {
  const querySnapshot = await getDocs(collection(db, "competitions"));
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Competition)
  );
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setIsAdmin(userData.role === "admin");
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    fetchCompetitions()
      .then((data) => {
        setCompetitions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching competitions:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Зареждане...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500">Състезания</h1>
        {isAdmin && (
          <Link href="/competitions/new">
            <Button
              variant="outline"
              className="text-orange-500 border-orange-500"
            >
              Добави състезание
            </Button>
          </Link>
        )}
      </div>

      {competitions.length === 0 ? (
        <p className="text-center text-gray-500">
          Няма налични състезания в момента.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {competitions.map((competition) => (
            <Card
              key={competition.id}
              className="transition-transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle>{competition.name}</CardTitle>
                <CardDescription>
                  {new Date(competition.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>Първи старт: {competition.time}</p>
                  <p>Местоположение: {competition.location}</p>
                  <p>Такса за участие: €{competition.entryFee}</p>
                  <p>Възрастови групи: {competition.ageGroups.join(", ")}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Link href={`/competitions/${competition.id}`}>
                  <Button
                    variant="outline"
                    className="hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    Виж детайли
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href={`/competitions/${competition.id}/participants`}>
                    <Button
                      variant="outline"
                      className="hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      Участници
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
