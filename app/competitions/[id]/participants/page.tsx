"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import type { Competition, User } from "@/interfaces";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchParticipants = async () => {
      const competitionId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!competitionId) {
        setLoading(false);
        return;
      }

      const competitionDoc = await getDoc(
        doc(db, "competitions", competitionId)
      );
      if (competitionDoc.exists()) {
        const competitionData = competitionDoc.data() as Competition;
        if (competitionData.participants) {
          const participantPromises = competitionData.participants.map(
            async (userId) => {
              const userDoc = await getDoc(doc(db, "users", userId));
              return userDoc.exists() ? (userDoc.data() as User) : null;
            }
          );

          const participantsData = await Promise.all(participantPromises);
          setParticipants(
            participantsData.filter((user) => user !== null) as User[]
          );
        }
      }

      setLoading(false);
    };

    fetchParticipants();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Зареждане...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Участници
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <p className="text-center">Няма участници за това състезание.</p>
          ) : (
            <ul className="space-y-4">
              {participants.map((participant) => (
                <li
                  key={participant.id}
                  className="flex justify-between items-center"
                >
                  <span>{participant.fullName}</span>
                  <span>{participant.email}</span>
                  <span>{participant.ageGroup}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Button onClick={() => router.back()} className="mt-4">
        Назад
      </Button>
    </div>
  );
}
