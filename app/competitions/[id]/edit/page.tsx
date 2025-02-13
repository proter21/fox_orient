"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/firebase/firebase";
import type { Competition, User } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditCompetitionPage({
  params: initialParams,
}: {
  params: { id: string };
}) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const unwrappedParams = await params;
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          setUser(userData);
          if (!userData.role || userData.role !== "admin") {
            router.push("/");
            return;
          }
        }
      } else {
        router.push("/login");
        return;
      }

      const competitionDoc = await getDoc(
        doc(db, "competitions", unwrappedParams.id)
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

      setLoading(false);
    };

    fetchData();
  }, [params, router, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!competition) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const updatedCompetition = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      entryFee: Number(formData.get("entryFee")),
      ageGroups: (formData.get("ageGroups") as string)
        .split(",")
        .map((g) => g.trim()),
      description: formData.get("description") as string,
    };

    try {
      await updateDoc(
        doc(db, "competitions", competition.id),
        updatedCompetition
      );
      toast({
        title: "Админ",
        description: "Състезанието беше обновено успешно.",
      });
      router.push(`/competitions/${competition.id}`);
    } catch (error) {
      console.error("Error updating competition:", error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при обновяването на състезанието.",
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

  if (!competition || user?.role !== "admin") {
    return <div className="text-center">Нямате достъп до тази страница.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Редактиране на състезание
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Име на състезанието</Label>
              <Input
                id="name"
                name="name"
                defaultValue={competition.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={competition.date}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Първи старт</Label>
              <Input
                id="time"
                name="time"
                type="time"
                defaultValue={competition.time}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Местоположение</Label>
              <Input
                id="location"
                name="location"
                defaultValue={competition.location}
                required
              />
            </div>
            <div>
              <Label htmlFor="entryFee">Такса за участие</Label>
              <Input
                id="entryFee"
                name="entryFee"
                type="number"
                defaultValue={competition.entryFee}
                required
              />
            </div>
            <div>
              <Label htmlFor="ageGroups">
                Възрастови групи (разделени със запетая)
              </Label>
              <Input
                id="ageGroups"
                name="ageGroups"
                defaultValue={competition.ageGroups.join(", ")}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={competition.description || ""}
                rows={4}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Обнови състезание
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
