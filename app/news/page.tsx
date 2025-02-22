"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Calendar, Tag } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  category: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Световно първенство по радиозасичане 2025",
    date: "2025-08-16",
    excerpt:
      "Очаквайте 22-ро вълнуващо IARU световно първенство в Бирштонас, Литва.",
    imageUrl:
      "https://ardf2025.lt/wp-content/uploads/2024/12/22nd-IARU-World-ARDF-Championships-No.1.png",
    category: "Състезания",
  },
  {
    id: 2,
    title: "YOTA летен лагер 2025. ",
    date: "2025-08-18",
    excerpt: "Тази година летният лагер YOTA ще се проведе във Франция.",
    imageUrl:
      "https://www.ham-yota.com/wp-content/uploads/2025/02/yota_summer_camp_25-resize.png",
    category: "Лагери",
  },
  {
    id: 3,
    title: "Нови правила за младежката категория",
    date: "2025-04-03",
    excerpt:
      "Международната федерация обяви промени в регламента за състезатели под 18 години.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Регламенти",
  },
  {
    id: 4,
    title: "Успех на българския отбор на Европейското първенство",
    date: "2025-03-20",
    excerpt:
      "Нашите състезатели се завърнаха с 3 медала от първенството в Германия.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Постижения",
  },
  // Добавете още новини тук
];

const categories = [...new Set(newsItems.map((item) => item.category))];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredNews = newsItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || item.category === selectedCategory)
  );

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
              className="bg-white rounded-lg overflow-hidden shadow-lg"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
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
                    if (item.id === 1) {
                      window.location.href = "https://ardf2025.lt/bulletin/";
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
    </div>
  );
}
