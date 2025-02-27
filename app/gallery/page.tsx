"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import AdminGalleryUpload from "@/components/AdminGalleryUpload";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  competitionId: string;
  competitionName: string;
}

interface Competition {
  id: string;
  name: string;
}

const GalleryPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGalleryData = async () => {
    try {
      const galleryRef = collection(db, "gallery");
      const galleryQuery = query(galleryRef, orderBy("createdAt", "desc"));
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
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white px-4 py-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-500">
          Галерия
        </h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex overflow-x-auto mb-8">
            <TabsTrigger value="all" className="flex-shrink-0">
              Всички събития
            </TabsTrigger>
            {competitions.map((comp) => (
              <TabsTrigger
                key={comp.id}
                value={comp.id}
                className="flex-shrink-0"
              >
                {comp.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.caption}
                    fill
                    className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {competitions.map((comp) => (
            <TabsContent key={comp.id} value={comp.id} className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems
                  .filter((item) => item.competitionId === comp.id)
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setSelectedImage(item)}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.caption}
                        fill
                        className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                      />
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <div className="relative aspect-video">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.caption}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {isAdmin && (
          <AdminGalleryUpload
            isAdmin={isAdmin}
            onEventCreated={fetchGalleryData}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(GalleryPage);
