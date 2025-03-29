"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import type { Competition, User } from "@/interfaces";
import { Button } from "@/components/ui/button";

interface ParticipantResult {
  place: number;
  userId: string;
  name: string;
  time: string;
  ageGroup: string;
}

interface AgeGroupResults {
  [key: string]: ParticipantResult[];
}

interface Result {
  id: string;
  competitionId: string;
  name: string;
  date: string;
  ageGroupResults: AgeGroupResults;
}

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === "admin");
        }
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const competitionsSnapshot = await getDocs(
          collection(db, "competitions")
        );
        const resultsData: Result[] = [];

        for (const compDoc of competitionsSnapshot.docs) {
          const competition = {
            id: compDoc.id,
            ...compDoc.data(),
          } as Competition;

          if (competition.participants && competition.participants.length > 0) {
            const participantsData: { [key: string]: ParticipantResult[] } = {};

            const participants = await Promise.all(
              competition.participants.map(async (userId) => {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data() as User;
                  const userResult = competition.results?.[userId];
                  return {
                    userId,
                    name: userData.fullName,
                    ageGroup: userData.ageGroup,
                    time: userResult?.time || "99:99:99",
                  };
                }
                return null;
              })
            );

            const validParticipants = participants.filter(
              (p): p is NonNullable<typeof p> => p !== null
            );

            validParticipants.forEach((participant) => {
              if (!participantsData[participant.ageGroup]) {
                participantsData[participant.ageGroup] = [];
              }
              participantsData[participant.ageGroup].push({
                ...participant,
                place: 0, // Will be assigned after sorting
              });
            });

            Object.keys(participantsData).forEach((ageGroup) => {
              participantsData[ageGroup].sort((a, b) =>
                a.time.localeCompare(b.time)
              );
              participantsData[ageGroup] = participantsData[ageGroup]
                .map((p, index) => ({
                  ...p,
                  place: index + 1,
                }))
                .filter((p) => p.time !== "99:99:99")
                .slice(0, 3);
            });

            if (
              Object.values(participantsData).some((group) => group.length > 0)
            ) {
              resultsData.push({
                id: competition.id,
                competitionId: competition.id,
                name: competition.name,
                date: competition.date,
                ageGroupResults: participantsData,
              });
            }
          }
        }

        resultsData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setResults(resultsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16 gap-4">
          <div className="text-center flex-grow">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600 mb-4">
              Резултати от състезания
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Преглед на класирания по възрастови групи
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/competitions/manage-results"
              className="w-full sm:w-auto"
            >
              <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                Управление на резултати
              </Button>
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Link
              href={`/competitions/${result.competitionId}`}
              key={result.id}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 sm:p-4">
                  <div className="text-lg sm:text-xl font-semibold text-white hover:text-orange-100 line-clamp-2">
                    {result.name}
                  </div>
                  <p className="text-orange-100 flex items-center mt-2 text-sm sm:text-base">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {new Date(result.date).toLocaleDateString("bg-BG")}
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  {Object.entries(result.ageGroupResults).map(
                    ([ageGroup, participants]) => (
                      <div key={ageGroup} className="mb-4 sm:mb-6 last:mb-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center">
                          <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
                          Група {ageGroup}
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          {participants.map((participant) => (
                            <div
                              key={participant.userId}
                              className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                              <div className="flex items-center min-w-0">
                                <span
                                  className={`
                                w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3
                                ${
                                  participant.place === 1
                                    ? "bg-amber-400 shadow-amber-200"
                                    : participant.place === 2
                                    ? "bg-gray-300 shadow-gray-200"
                                    : "bg-amber-700 shadow-amber-300"
                                }
                                shadow-lg text-white font-bold text-sm sm:text-base
                              `}
                                >
                                  {participant.place}
                                </span>
                                <span className="text-gray-800 hover:text-orange-600 font-medium truncate">
                                  {participant.name}
                                </span>
                              </div>
                              <span className="text-gray-600 bg-orange-50 px-2 sm:px-3 py-1 rounded-full font-mono text-sm sm:text-base ml-2">
                                {participant.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Все още няма завършени състезания с резултати
          </div>
        )}
      </div>
    </div>
  );
};

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 24 24"
    stroke="currentColor"
  >
    <path d="M5 3h14M5 3v11.5M19 3v11.5M8 21h8m-4-6v6m-5.5-9h11" />
  </svg>
);

export default ResultsPage;
