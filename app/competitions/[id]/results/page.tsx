"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Competition, User, CompetitionResult } from "@/interfaces";

interface ParticipantWithResult extends User {
  result?: CompetitionResult;
  tempTime?: string; // Add temporary time storage
}

export default function ManageResultsPage() {
  const [participants, setParticipants] = useState<ParticipantWithResult[]>([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          router.push("/login");
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists() || userDoc.data().role !== "admin") {
          router.push("/competitions");
          return;
        }

        const competitionDoc = await getDoc(
          doc(db, "competitions", params?.id as string)
        );

        if (!competitionDoc.exists()) {
          toast({
            title: "Грешка",
            description: "Състезанието не беше намерено",
            variant: "destructive",
          });
          router.push("/competitions");
          return;
        }

        const competitionData = {
          id: competitionDoc.id,
          ...competitionDoc.data(),
        } as Competition;
        setCompetition(competitionData);

        // Fetch and set participants
        const participantsData = await Promise.all(
          competitionData.participants.map(async (userId) => {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              return {
                id: userId,
                ...userData,
                result: competitionData.results?.[userId],
                tempTime: undefined,
              } as ParticipantWithResult;
            }
            return null;
          })
        );

        setParticipants(
          participantsData.filter((p): p is ParticipantWithResult => p !== null)
        );
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Грешка",
          description: "Възникна проблем при зареждането на данните",
          variant: "destructive",
        });
        router.push("/competitions");
      }
    };

    checkAdminAndFetchData();
  }, [params?.id, router, toast]);

  const handleTimeChange = (participantId: string, time: string) => {
    setParticipants(
      participants.map((p) =>
        p.id === participantId
          ? {
              ...p,
              tempTime: time,
            }
          : p
      )
    );
    setHasChanges(true);
  };

  const handleSaveAllResults = async () => {
    if (!competition) return;

    try {
      const newResults = {
        ...(competition.results || {}),
      };

      participants.forEach((participant) => {
        if (participant.tempTime) {
          newResults[participant.id] = {
            time: participant.tempTime,
            updatedAt: new Date().toISOString(),
          };
        }
      });

      await updateDoc(doc(db, "competitions", competition.id), {
        results: newResults,
      });

      toast({
        title: "Успех",
        description: "Всички резултати бяха записани успешно",
      });

      // Redirect back to results page
      router.push("/results");
    } catch {
      toast({
        title: "Грешка",
        description: "Възникна проблем при записването на резултатите",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Group participants by age group
  const groupedParticipants = participants.reduce<
    Record<string, ParticipantWithResult[]>
  >((groups, participant) => {
    const group = participant.ageGroup;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(participant);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-orange-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-orange-600">
              Управление на резултати - {competition?.name}
            </CardTitle>
            {hasChanges && (
              <Button
                onClick={handleSaveAllResults}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Запази всички резултати
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {Object.entries(groupedParticipants).map(
              ([ageGroup, groupParticipants]) => (
                <div key={ageGroup} className="mb-8 last:mb-0">
                  <h2 className="text-xl font-semibold text-orange-600 mb-4">
                    Група {ageGroup}
                  </h2>
                  <div className="space-y-4">
                    {groupParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">
                            {participant.fullName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <Input
                            type="time"
                            step="1"
                            defaultValue={participant.result?.time}
                            className={`w-32 ${
                              participant.tempTime ? "border-orange-500" : ""
                            }`}
                            onChange={(e) =>
                              handleTimeChange(participant.id, e.target.value)
                            }
                          />
                          {(participant.result?.updatedAt ||
                            participant.tempTime) && (
                            <span className="text-xs text-gray-500">
                              {participant.tempTime
                                ? "Незапазена промяна"
                                : `Обновено: ${new Date(
                                    participant.result!.updatedAt
                                  ).toLocaleDateString()}`}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
