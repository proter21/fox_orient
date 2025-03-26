"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import type { Competition, User } from "@/interfaces";

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

            // Fetch all participants data
            const participants = await Promise.all(
              competition.participants.map(async (userId) => {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data() as User;
                  return {
                    userId,
                    name: userData.fullName,
                    ageGroup: userData.ageGroup,
                    time: "00:00:00", // Replace with actual time
                  };
                }
                return null;
              })
            );

            // Group participants by age group
            participants.forEach((participant) => {
              if (participant && participant.ageGroup) {
                if (!participantsData[participant.ageGroup]) {
                  participantsData[participant.ageGroup] = [];
                }
                participantsData[participant.ageGroup].push({
                  ...participant,
                  place: participantsData[participant.ageGroup].length + 1,
                });
              }
            });

            // Take top 3 for each age group
            Object.keys(participantsData).forEach((ageGroup) => {
              participantsData[ageGroup] = participantsData[ageGroup]
                .slice(0, 3)
                .sort((a, b) => a.time.localeCompare(b.time));
            });

            resultsData.push({
              id: competition.id,
              competitionId: competition.id,
              name: competition.name,
              date: competition.date,
              ageGroupResults: participantsData,
            });
          }
        }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-orange-600 sm:text-5xl mb-4">
            Резултати от състезания
          </h1>
          <p className="text-lg text-gray-600">
            Преглед на класирания по възрастови групи
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Link
              href={`/competitions/${result.competitionId}`}
              key={result.id}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                  <Link
                    href={`/competitions/${result.competitionId}`}
                    className="text-xl font-semibold text-white hover:text-orange-100"
                  >
                    {result.name}
                  </Link>
                  <p className="text-orange-100 flex items-center mt-2">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {new Date(result.date).toLocaleDateString("bg-BG")}
                  </p>
                </div>
                <div className="p-6">
                  {Object.entries(result.ageGroupResults).map(
                    ([ageGroup, participants]) => (
                      <div key={ageGroup} className="mb-6 last:mb-0">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                          <TrophyIcon className="w-5 h-5 mr-2 text-orange-500" />
                          Група {ageGroup}
                        </h3>
                        <div className="space-y-4">
                          {participants.map((participant) => (
                            <div
                              key={participant.userId}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors"
                            >
                              <div className="flex items-center">
                                <span
                                  className={`
                                w-8 h-8 rounded-full flex items-center justify-center mr-3
                                ${
                                  participant.place === 1
                                    ? "bg-amber-400 shadow-amber-200"
                                    : participant.place === 2
                                    ? "bg-gray-300 shadow-gray-200"
                                    : "bg-amber-700 shadow-amber-300"
                                }
                                shadow-lg text-white font-bold
                              `}
                                >
                                  {participant.place}
                                </span>
                                <Link
                                  href={`/profile/${participant.userId}`}
                                  className="text-gray-800 hover:text-orange-600 font-medium"
                                >
                                  {participant.name}
                                </Link>
                              </div>
                              <span className="text-gray-600 bg-orange-50 px-3 py-1 rounded-full font-mono">
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
