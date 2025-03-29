"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Search } from "lucide-react";
import { auth, db } from "@/firebase/firebase";

export default function ManageCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      !selectedDate ||
      new Date(comp.date).toDateString() === selectedDate.toDateString();
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Нямате достъп до тази страница
        </h1>
        <Link href="/" className="text-orange-500 hover:text-orange-600">
          Обратно към началната страница
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-orange-500">Админ Панел</h1>
        <div className="flex gap-4">
          <Link href="/competitions/manage-results">
            <Button
              variant="outline"
              className="border-orange-200 hover:bg-orange-50"
            >
              Управление на резултати
            </Button>
          </Link>
          <Link href="/competitions">
            <Button
              variant="outline"
              className="border-orange-200 hover:bg-orange-50"
            >
              Към състезания
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="add" className="space-y-6">
        <TabsList className="bg-orange-50 p-1">
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Добави състезание
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Управление на състезания
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card className="shadow-lg border-orange-200">
            <CardHeader className="bg-orange-50 border-b border-orange-100">
              <CardTitle className="text-2xl text-orange-600">
                Добави ново състезание
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Име на състезанието
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Местоположение
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      required
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Дата
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      required
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">
                      Първи старт
                    </Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      required
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryFee" className="text-sm font-medium">
                      Такса за участие
                    </Label>
                    <Input
                      id="entryFee"
                      name="entryFee"
                      type="number"
                      required
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageGroups" className="text-sm font-medium">
                      Възрастови групи
                    </Label>
                    <Input
                      id="ageGroups"
                      name="ageGroups"
                      required
                      placeholder="М21, Ж21, М35..."
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Описание
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    required
                    className="border-orange-200 focus:border-orange-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  Добави състезание
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card className="shadow-lg border-orange-200">
            <CardHeader className="bg-orange-50 border-b border-orange-100">
              <CardTitle className="text-2xl text-orange-600">
                Управление на състезания
              </CardTitle>
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Търси по име или локация..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-orange-200 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="w-fit">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-orange-200"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead className="font-bold">Име</TableHead>
                      <TableHead className="font-bold">Дата</TableHead>
                      <TableHead className="font-bold">
                        Местоположение
                      </TableHead>
                      <TableHead className="font-bold">Участници</TableHead>
                      <TableHead className="font-bold">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompetitions.map((competition) => (
                      <TableRow
                        key={competition.id}
                        className="hover:bg-orange-50/50"
                      >
                        <TableCell className="font-medium">
                          {competition.name}
                        </TableCell>
                        <TableCell>
                          {new Date(competition.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{competition.location}</TableCell>
                        <TableCell>
                          {competition.participants?.length || 0}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Link href={`/competitions/${competition.id}`}>
                            <Button
                              variant="outline"
                              className="border-orange-200 hover:bg-orange-50"
                            >
                              Преглед
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(competition.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Изтрий
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
