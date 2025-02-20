"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import type { User } from "@/interfaces";
import { auth, db } from "@/firebase/firebase";

const ageGroups = {
  male: ["м14", "м16", "м19", "м21", "м40", "м50", "м60", "м70"],
  female: ["ж14", "ж16", "ж19", "ж21", "ж35", "ж50"],
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  date: z.string(),
  time: z.string(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  entryFee: z.number().min(0),
  ageGroups: z.array(z.string()),
  description: z.string().optional(),
  file: z.any().optional(),
});

export default function NewCompetitionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "",
      time: "",
      location: "",
      entryFee: 0,
      ageGroups: [],
      description: "",
      file: null,
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setIsAdmin(userData.role === "admin");
        }
      }
    };

    fetchUserData();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      let fileURL = "";
      if (values.file && values.file[0]) {
        const storage = getStorage();
        const storageRef = ref(storage, `files/${values.file[0].name}`);
        await uploadBytes(storageRef, values.file[0]);
        fileURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "competitions"), {
        name: values.name,
        date: values.date,
        time: values.time,
        location: values.location,
        entryFee: values.entryFee,
        ageGroups: values.ageGroups,
        description: values.description,
        fileURL: fileURL,
        createdAt: new Date().toISOString(),
      });

      router.push("/competitions");
      router.refresh();
    } catch (error) {
      console.error("Failed to create competition:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isAdmin) {
    return <p>Access denied. Only admins can add competitions.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-16">
      <div className="container mx-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-orange-500">
              Създай ново състезание
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Име на състезанието</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Първи старт</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Местоположение</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Такса за участие (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageGroups"
                  render={() => (
                    <FormItem>
                      <FormLabel>Възрастови групи</FormLabel>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-semibold">Мъже</h3>
                          {ageGroups.male
                            .sort((a, b) =>
                              a.localeCompare(b, undefined, { numeric: true })
                            )
                            .map((group) => (
                              <div
                                key={group}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={form
                                    .getValues("ageGroups")
                                    .includes(group)}
                                  onCheckedChange={(checked: boolean) => {
                                    const currentGroups =
                                      form.getValues("ageGroups");
                                    if (checked) {
                                      form.setValue("ageGroups", [
                                        ...currentGroups,
                                        group,
                                      ]);
                                    } else {
                                      form.setValue(
                                        "ageGroups",
                                        currentGroups.filter(
                                          (g: string) => g !== group
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label className="text-base">
                                  Група {group}
                                </Label>
                              </div>
                            ))}
                        </div>
                        <div>
                          <h3 className="font-semibold">Жени</h3>
                          {ageGroups.female
                            .sort((a, b) =>
                              a.localeCompare(b, undefined, { numeric: true })
                            )
                            .map((group) => (
                              <div
                                key={group}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={form
                                    .getValues("ageGroups")
                                    .includes(group)}
                                  onCheckedChange={(checked: boolean) => {
                                    const currentGroups =
                                      form.getValues("ageGroups");
                                    if (checked) {
                                      form.setValue("ageGroups", [
                                        ...currentGroups,
                                        group,
                                      ]);
                                    } else {
                                      form.setValue(
                                        "ageGroups",
                                        currentGroups.filter(
                                          (g: string) => g !== group
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label className="text-base">
                                  Група {group}
                                </Label>
                              </div>
                            ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Допълнителна информация</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Прикачи файл (PDF)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/competitions")}
                  >
                    Отказ
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Създаване..." : "Създай състезание"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
