"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";

import type { Competition, User } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth, db } from "@/firebase/firebase";

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() } as User;
          setUser(userData);
          if (userData.role !== "admin") {
            router.push("/");
            return;
          }
        }
      } else {
        router.push("/login");
        return;
      }

      const competitionsSnapshot = await getDocs(
        collection(db, "competitions")
      );
      const competitionsData = competitionsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Competition)
      );
      setCompetitions(competitionsData);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "competitions", id));
      setCompetitions(competitions.filter((comp) => comp.id !== id));
      toast({
        title: "Админ",
        description: "Състезанието беше изтрито успешно.",
      });
    } catch (error) {
      console.error("Error deleting competition:", error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при изтриването на състезанието.",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newCompetition = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      entryFee: Number(formData.get("entryFee")),
      ageGroups: (formData.get("ageGroups") as string)
        .split(",")
        .map((g) => g.trim()),
      description: formData.get("description") as string,
      participants: [],
    };

    try {
      const docRef = await addDoc(
        collection(db, "competitions"),
        newCompetition
      );
      setCompetitions([...competitions, { id: docRef.id, ...newCompetition }]);
      form.reset();
      toast({
        title: "Успех",
        description: "Новото състезание беше добавено успешно.",
      });
    } catch (error) {
      console.error("Error adding competition:", error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при добавянето на новото състезание.",
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

  if (user?.role !== "admin") {
    return <div className="text-center">Нямате достъп до тази страница.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">
        Управление на състезания
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Добави ново състезание</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label htmlFor="name">Име на състезанието</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="date">Дата</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="time">Първи старт</Label>
              <Input id="time" name="time" type="time" required />
            </div>
            <div>
              <Label htmlFor="location">Местоположение</Label>
              <Input id="location" name="location" required />
            </div>
            <div>
              <Label htmlFor="entryFee">Такса за участие</Label>
              <Input id="entryFee" name="entryFee" type="number" required />
            </div>
            <div>
              <Label htmlFor="ageGroups">
                Възрастови групи (разделени със запетая)
              </Label>
              <Input id="ageGroups" name="ageGroups" required />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Input id="description" name="description" required />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Добави състезание
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Списък на състезанията</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Местоположение</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell>{competition.name}</TableCell>
                  <TableCell>
                    {new Date(competition.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{competition.location}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(competition.id)}
                    >
                      Изтрий
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
