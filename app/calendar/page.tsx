"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { Competition } from "@/interfaces";

export default function CalendarPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const competitionsRef = collection(db, "competitions");
      const q = query(competitionsRef, orderBy("date"));
      const querySnapshot = await getDocs(q);
      const competitionsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Competition)
      );
      setCompetitions(competitionsData);
      setLoading(false);
    };

    fetchCompetitions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const competitionDates = competitions.map((comp) => new Date(comp.date));

  return (
    <div className="container mx-auto px-4 py-11 mt-16 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-500">
        Календар на състезанията
      </h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-2xl text-orange-600">Календар</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Calendar
              mode="multiple"
              selected={competitionDates}
              className="rounded-lg border-orange-200"
              classNames={{
                day_selected: "bg-orange-500 text-white hover:bg-orange-600",
                day_today: "bg-orange-100 text-orange-900",
              }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-2xl text-orange-600">
              Предстоящи състезания
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {competitions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Няма предстоящи състезания
              </p>
            ) : (
              <ul className="space-y-4">
                {competitions.map((competition) => (
                  <li
                    key={competition.id}
                    className="group border-l-4 border-orange-500 pl-4 py-2 hover:bg-orange-50 transition-colors duration-200"
                  >
                    <Link
                      href={`/competitions/${competition.id}`}
                      className="block"
                    >
                      <div className="flex flex-col space-y-1">
                        <span className="font-semibold text-lg text-orange-600">
                          {competition.name}
                        </span>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <span>
                            {new Date(competition.date).toLocaleDateString(
                              "bg-BG",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span>•</span>
                          <span>{competition.time}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {competition.location}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
