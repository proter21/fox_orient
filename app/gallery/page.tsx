"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-orange-500 tracking-tight">
          Галерия
        </h1>
        <p className="text-center text-zinc-600 mb-12 max-w-2xl mx-auto">
          Разгледайте снимки от нашите събития и състезания по радиозасичане
        </p>

        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <Select onValueChange={setSelectedCompetition}>
              <SelectTrigger className="w-full bg-white shadow-lg border-none px-6 py-3 rounded-xl focus:ring-2 focus:ring-orange-500">
                <SelectValue placeholder="Изберете състезание" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-xl border-none">
                <SelectItem value="all" className="hover:bg-orange-50">
                  Всички състезания
                </SelectItem>
                {competitions.map((comp) => (
                  <SelectItem
                    key={comp.id}
                    value={comp.id}
                    className="hover:bg-orange-50"
                  >
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-zinc-800 group-hover:text-orange-500 transition-colors">
                  {item.caption}
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  {item.competitionName}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-600">
              Няма намерени снимки за избраното състезание
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(GalleryPage);
