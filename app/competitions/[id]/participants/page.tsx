"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { FaUser, FaEnvelope, FaBirthdayCake } from "react-icons/fa";

import type { Competition, User } from "@/interfaces";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/firebase/firebase";

type GroupedParticipants = {
  [key: string]: User[];
};

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<User[]>([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchParticipants = async () => {
      const competitionId = Array.isArray(params?.id)
        ? params?.id[0]
        : params?.id;
      if (!competitionId) {
        setLoading(false);
        return;
      }

      const competitionDoc = await getDoc(
        doc(db, "competitions", competitionId)
      );
      if (competitionDoc.exists()) {
        const competitionData = competitionDoc.data() as Competition;
        setCompetition(competitionData);
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
  }, [params?.id]);

  const groupParticipantsByAgeGroup = (
    participants: User[]
  ): GroupedParticipants => {
    return participants.reduce((groups: GroupedParticipants, participant) => {
      const group = participant.ageGroup || "Без група";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(participant);
      return groups;
    }, {});
  };

  const sortedAgeGroups = (groups: GroupedParticipants): string[] => {
    return Object.keys(groups).sort((a, b) => {
      // Сортиране първо по пол (м/ж), после по възраст
      const aGender = a.charAt(0);
      const bGender = b.charAt(0);
      if (aGender !== bGender) return aGender.localeCompare(bGender);

      const aAge = parseInt(a.replace(/\D/g, "")) || 0;
      const bAge = parseInt(b.replace(/\D/g, "")) || 0;
      return aAge - bAge;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const groupedParticipants = groupParticipantsByAgeGroup(participants);
  const sortedGroups = sortedAgeGroups(groupedParticipants);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <Card className="max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader className="border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-orange-500">
              Участници {competition?.name && `- ${competition.name}`}
            </CardTitle>
            <div className="text-sm text-gray-500">
              Общ брой участници: {participants.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {participants.length === 0 ? (
            <div className="text-center py-8">
              <FaUser className="mx-auto text-4xl text-gray-300 mb-2" />
              <p className="text-gray-500">
                Няма регистрирани участници за това състезание.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedGroups.map((group) => (
                <div key={group} className="border rounded-lg overflow-hidden">
                  <div className="bg-orange-50 px-4 py-2 border-b">
                    <h3 className="font-semibold text-orange-700">
                      Група {group} ({groupedParticipants[group].length})
                    </h3>
                  </div>
                  <div className="divide-y">
                    {groupedParticipants[group].map((participant) => (
                      <TooltipProvider key={participant.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <FaUser className="text-orange-500" />
                              </div>
                              <div className="flex-grow">
                                <div className="font-medium">
                                  {participant.fullName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <FaEnvelope className="text-gray-400" />
                                  {participant.email}
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="p-0 bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-xl border-none min-w-[300px] z-[1000] ">
                            <div className="relative overflow-hidden">
                              {/* Header с градиент */}
                              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                                <h4 className="font-bold text-lg">
                                  {participant.fullName}
                                </h4>
                                <div className="text-sm opacity-90">
                                  {participant.email}
                                </div>
                              </div>

                              {/* Основно съдържание */}
                              <div className="p-4 space-y-3">
                                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-50 transition-colors">
                                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                    <FaBirthdayCake className="text-orange-500" />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      Рожден ден
                                    </div>
                                    <div className="font-medium">
                                      {new Date(
                                        participant.birthDate
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                {/* Долен колонтитул */}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                  <div className="text-xs text-gray-400">
                                    Регистриран на:{" "}
                                    {new Date(
                                      participant.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => router.back()}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6"
        >
          Назад
        </Button>
      </div>
    </div>
  );
}
