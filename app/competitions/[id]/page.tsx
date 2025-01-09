"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import SignUpButton from "./sign-up-button";
import MyNavbar from "@/components/MyNavbar";
import MyFooter from "@/components/MyFooter";
import { useRouter, useParams } from "next/navigation";

// This would be replaced with your actual data fetching logic
async function getCompetition(id: string) {
  const competition = {
    id: "1",
    name: "Summer Championship",
    date: "2024-07-15",
    time: "09:00",
    location: "Sports Complex",
    entryFee: 25,
    ageGroups: [0, 1, 2],
  };
  return competition;
}

export default function CompetitionPage() {
  const router = useRouter();
  const params = useParams();
  const [competition, setCompetition] = useState<any>(null);

  useEffect(() => {
    async function fetchCompetition() {
      const data = await getCompetition(params.id);
      if (!data) {
        notFound();
      } else {
        setCompetition(data);
      }
    }
    fetchCompetition();
  }, [params.id]);

  if (!competition) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <MyNavbar />
      <div className="min-h-screen bg-gray-100 text-gray-800 py-16">
        <div className="container mx-auto flex flex-col items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h1 className="text-4xl font-bold text-orange-500 mb-6">
              {competition.name}
            </h1>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Дата</h3>
                  <p>{new Date(competition.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Първи старт</h3>
                  <p>{competition.time}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Местоположение</h3>
                  <p>{competition.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Такса за участие</h3>
                  <p>€{competition.entryFee}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold">Възрастови групи</h3>
                  <p>{competition.ageGroups.join(", ")}</p>
                </div>
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <button
                  onClick={() => router.back()}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition"
                >
                  Назад
                </button>
                <SignUpButton
                  competitionId={competition.id}
                  buttonText="Регистрирай се"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
}
