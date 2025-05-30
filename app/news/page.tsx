"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Calendar, Tag, Trash2 } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import AdminNewsUpload from "@/components/AdminNewsUpload";
import { useAuth } from "@/context/AuthContext";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  link?: string;
  createdAt: Date;
}

export default function NewsPage() {
  const { isAdmin } = useAuth();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const newsRef = collection(db, "news");
      const newsQuery = query(newsRef, orderBy("createdAt", "desc"));
      const newsSnapshot = await getDocs(newsQuery);
      const newsData = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as NewsItem[];
      setNewsItems(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsItems([]);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const categories = [...new Set(newsItems.map((item) => item.category))];

  const filteredNews = newsItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || item.category === selectedCategory)
  );

  const deleteNews = async (id: string) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете тази новина?")) {
      try {
        await deleteDoc(doc(db, "news", id));
        await fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 pt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">Новини</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Търси новини..."
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === null
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-900 border border-gray-300"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Всички
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-900 border border-gray-300"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg relative"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {isAdmin && (
                <button
                  onClick={() => deleteNews(item.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-orange-400 mb-2">
                  {item.title}
                </h2>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <Calendar size={16} className="mr-2" />
                  {new Date(item.date).toLocaleDateString("bg-BG")}
                  <Tag size={16} className="ml-4 mr-2" />
                  {item.category}
                </div>
                <p className="text-gray-600">{item.excerpt}</p>
                <motion.button
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (item.link) {
                      window.location.href = item.link;
                    }
                  }}
                >
                  Прочети повече
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <AdminNewsUpload isAdmin={isAdmin} onNewsCreated={fetchNews} />
      )}
    </div>
  );
}
