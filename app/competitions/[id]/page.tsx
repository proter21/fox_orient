"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import type { Competition, User } from "@/interfaces";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/firebase/firebase";

export default function CompetitionPage() {
  const router = useRouter();
  const params = useParams();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
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
        const competitionData = {
          id: competitionDoc.id,
          ...competitionDoc.data(),
        } as Competition;
        setCompetition(competitionData);

        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = { id: userDoc.id, ...userDoc.data() } as User;
            setUser(userData);
            setIsRegistered(
              competitionData.participants?.includes(userData.id) || false
            );
          }
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [params?.id]);

  const handleDelete = async () => {
    const competitionId = Array.isArray(params?.id)
      ? params?.id[0]
      : params?.id;
    if (competition && competitionId) {
      try {
        await deleteDoc(doc(db, "competitions", competitionId));
        toast({
          title: "Админ",
          description: "Състезанието беше изтрито успешно.",
        });
        router.push("/competitions");
      } catch (error) {
        console.error("Error deleting competition:", error);
        toast({
          title: "Грешка",
          description: "Възникна проблем при изтриването на състезанието.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Зареждане...
      </div>
    );
  }

  if (!competition) {
    return <div className="text-center">Състезанието не беше намерено.</div>;
  }

  const isPastEvent = new Date(competition.date) < new Date();

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">{competition.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-2">
          <strong>Дата:</strong>{" "}
          {new Date(competition.date).toLocaleDateString()}
        </p>
        <p className="mb-2">
          <strong>Час:</strong> {competition.time}
        </p>
        <p className="mb-2">
          <strong>Местоположение:</strong> {competition.location}
        </p>
        <p className="mb-2">
          <strong>Такса за участие:</strong> €{competition.entryFee}
        </p>
        <p className="mb-4">
          <strong>Възрастови групи:</strong> {competition.ageGroups.join(", ")}
        </p>
        <p className="mb-4">
          <strong>Описание:</strong> {competition.description}
        </p>

        {user ? (
          isRegistered ? (
            <p className="text-green-600 font-bold">
              Вие сте регистрирани за това състезание.
            </p>
          ) : (
            !isPastEvent && (
              <Link href={`/competitions/${competition.id}/register`}>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Регистрирай се
                </Button>
              </Link>
            )
          )
        ) : (
          !isPastEvent && (
            <Link href="/login">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Влезте, за да се регистрирате
              </Button>
            </Link>
          )
        )}

        {user?.role === "admin" && (
          <div className="mt-4 flex justify-center space-x-4">
            <Link href={`/competitions/${competition.id}/edit`}>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Редактирай
              </Button>
            </Link>
            <Link href={`/competitions/${competition.id}/participants`}>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Участници
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Изтрий
            </Button>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
}
