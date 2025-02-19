"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase/firebase";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  competitionId: string;
  competitionName: string;
}

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [competitions, setCompetitions] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryData = async () => {
      const galleryRef = collection(db, "gallery");
      const galleryQuery = query(galleryRef, orderBy("competitionName"));
      const gallerySnapshot = await getDocs(galleryQuery);
      const galleryData = gallerySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as GalleryItem)
      );
      setGalleryItems(galleryData);

      const uniqueCompetitions = Array.from(
        new Set(galleryData.map((item) => item.competitionId))
      ).map((id) => {
        const item = galleryData.find((i) => i.competitionId === id);
        return { id, name: item?.competitionName || "" };
      });
      setCompetitions(uniqueCompetitions);

      setLoading(false);
    };

    fetchGalleryData();
  }, []);

  const filteredItems = useMemo(
    () =>
      selectedCompetition
        ? galleryItems.filter(
            (item) => item.competitionId === selectedCompetition
          )
        : galleryItems,
    [selectedCompetition, galleryItems]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Зареждане...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
        Галерия
      </h1>
      <div className="mb-6">
        <Select onValueChange={setSelectedCompetition}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Изберете състезание" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички състезания</SelectItem>
            {competitions.map((comp) => (
              <SelectItem key={comp.id} value={comp.id}>
                {comp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="text-sm">{item.caption}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default React.memo(GalleryPage);
