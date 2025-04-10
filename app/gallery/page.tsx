"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import AdminGalleryUpload from "@/components/AdminGalleryUpload";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  competitionId: string;
  competitionName: string;
}

const GalleryPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  // Removed unused competitions state
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentEventImages, setCurrentEventImages] = useState<GalleryItem[]>(
    []
  );
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

      // Removed logic for setting competitions as it is unused
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const openGalleryModal = (item: GalleryItem) => {
    const eventImages = galleryItems.filter(
      (img) => img.competitionId === item.competitionId
    );
    const index = eventImages.findIndex((img) => img.id === item.id);
    setCurrentEventImages(eventImages);
    setCurrentImageIndex(index);
    setSelectedImage(item);
  };

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % currentEventImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentEventImages[newIndex]);
  };

  const previousImage = () => {
    const newIndex =
      (currentImageIndex - 1 + currentEventImages.length) %
      currentEventImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(currentEventImages[newIndex]);
  };

  const getFirstImagesByCompetition = () => {
    const groupedImages: { [key: string]: GalleryItem } = {};
    galleryItems.forEach((item) => {
      if (!groupedImages[item.competitionId]) {
        groupedImages[item.competitionId] = item;
      }
    });
    return Object.values(groupedImages);
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFirstImagesByCompetition().map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => openGalleryModal(item)}
            >
              <div className="w-full h-full relative">
                <Image
                  src={item.imageUrl}
                  alt={item.caption}
                  fill
                  unoptimized
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold text-center p-4">
                  {item.competitionName}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog
          open={!!selectedImage}
          onOpenChange={() => {
            setSelectedImage(null);
            setCurrentEventImages([]);
            setCurrentImageIndex(0);
          }}
        >
          <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] flex items-center justify-center p-0">
            <DialogTitle className="sr-only">
              {selectedImage?.caption || "Gallery Image"}
            </DialogTitle>
            {selectedImage && (
              <div className="relative w-full h-full">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={selectedImage.imageUrl}
                    alt={selectedImage.caption}
                    fill
                    className="object-contain"
                  />
                </div>
                {currentEventImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        previousImage();
                      }}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="outline"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      <ChevronRight />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {currentEventImages.length}
                    </div>
                  </>
                )}
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
