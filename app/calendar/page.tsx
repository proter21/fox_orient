"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        Зареждане...
      </div>
    );
  }

  const competitionDates = competitions.map((comp) => new Date(comp.date));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        Календар на състезанията
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Календар</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={competitionDates}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Списък на състезанията</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {competitions.map((competition) => (
                <li key={competition.id}>
                  <span className="font-semibold">
                    {new Date(competition.date).toLocaleDateString()}
                  </span>
                  : {competition.name} - {competition.location}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
