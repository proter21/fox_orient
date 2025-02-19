"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import type { Competition, User } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ageGroups } from "@/app/profile/page";
import { auth, db } from "@/firebase/firebase";

interface RegisterCompetitionPageProps {
  params: { id: string };
}

export default function RegisterCompetitionPage({
  params: initialParams,
}: RegisterCompetitionPageProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const unwrappedParams = await params;
      const competitionDoc = await getDoc(
        doc(
          db,
          "competitions",
          typeof unwrappedParams?.id === "string" ? unwrappedParams.id : ""
        )
      );
      if (competitionDoc.exists()) {
        setCompetition({
          id: competitionDoc.id,
          ...competitionDoc.data(),
        } as Competition);
      } else {
        toast({
          title: "Грешка",
          description: "Състезанието не беше намерено.",
          variant: "destructive",
        });
        router.push("/competitions");
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          setUser(userData);
          setSelectedAgeGroup(userData.ageGroup);
          if (competitionDoc.exists()) {
            const competitionData = competitionDoc.data() as Competition;
            if (competitionData.participants?.includes(userData.id)) {
              toast({
                title: "Грешка",
                description: "Вече сте регистрирани за това състезание.",
                variant: "destructive",
              });
              router.push(`/competitions/${competitionData.id}`);
              return;
            }
          }
        }
      } else {
        router.push("/login");
      }

      setLoading(false);
    };

    fetchData();
  }, [params, router, toast]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !competition) return;

    const birthDate = new Date(user.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    const validAgeGroups = ageGroups[
      user.gender === "male" ? "male" : "female"
    ].filter((group) => {
      const groupAge = Number.parseInt(group.replace(/\D/g, ""), 10);
      if (age < 21) {
        return groupAge <= 21 && groupAge >= age;
      } else {
        return groupAge >= 21 && groupAge <= age;
      }
    });

    if (!validAgeGroups.includes(selectedAgeGroup)) {
      toast({
        title: "Грешка",
        description:
          "Избраната възрастова група не е валидна за вашата възраст.",
        variant: "destructive",
      });
      return;
    }

    if (!competition.ageGroups.includes(selectedAgeGroup)) {
      toast({
        title: "Грешка",
        description:
          "Избраната възрастова група не е валидна за това състезание.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateDoc(doc(db, "competitions", competition.id), {
        participants: arrayUnion(user.id),
      });

      await updateDoc(doc(db, "users", user.id), {
        ageGroup: selectedAgeGroup,
      });

      toast({
        title: "Успех!",
        description: "Вие се регистрирахте успешно за състезанието.",
      });

      router.push(`/competitions/${competition.id}`);
    } catch (error) {
      console.error("Error registering for competition:", error);
      toast({
        title: "Грешка",
        description:
          "Възникна проблем при регистрацията. Моля, опитайте отново.",
        variant: "destructive",
      });
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

  return (
    <div className="container mx-auto px-4 py-24">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Регистрация за {competition.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Име</Label>
                <Input id="name" value={user?.fullName || ""} disabled />
              </div>
              <div>
                <Label htmlFor="email">Имейл</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>
              <div>
                <Label htmlFor="ageGroup">Възрастова група</Label>
                <select
                  id="ageGroup"
                  value={selectedAgeGroup}
                  onChange={(e) => setSelectedAgeGroup(e.target.value)}
                  className="text-lg border rounded p-2 w-full"
                >
                  <option value="">Изберете възрастова група</option>
                  {ageGroups[user?.gender === "male" ? "male" : "female"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group.toUpperCase()}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <CardFooter className="mt-4">
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Регистрирай се
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
