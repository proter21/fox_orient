"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Calendar, Tag } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
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
}

const staticNewsItems: NewsItem[] = [
  {
    id: "static-1",
    title: "Световно първенство по радиозасичане 2025",
    date: "2025-08-16",
    excerpt:
      "Очаквайте 22-ро вълнуващо IARU световно първенство в Бирштонас, Литва.",
    imageUrl:
      "https://ardf2025.lt/wp-content/uploads/2024/12/22nd-IARU-World-ARDF-Championships-No.1.png",
    category: "Състезания",
    link: "https://ardf2025.lt/bulletin/",
  },
  {
    id: "static-2",
    title: "YOTA летен лагер 2025",
    date: "2025-08-18",
    excerpt: "Тази година летният лагер YOTA ще се проведе във Франция.",
    imageUrl:
      "https://www.ham-yota.com/wp-content/uploads/2025/02/yota_summer_camp_25-resize.png",
    category: "Лагери",
    link: "https://www.ham-yota.com/category/regional-activities/yota-france-2025/",
  },
  {
    id: "static-3",
    title: "LZ1KAM лагер в Хисаря",
    date: "2025-03-31",
    excerpt:
      "Радиолюбителски клуб Хасково орагнизира лагер в Хисаря. Занятията ще бъдат на тема Ардуино, обучение за радиолюбителски инициал клас 1 и клас 2, както и тестване на новите приемници.",
    imageUrl:
      "https://lh3.googleusercontent.com/pw/AP1GczOYEXYJy9QFcT2_uRD2qfmUgiz1UM2HWBEpB8wpqt9zP7iucR5IN_aDXloX6kDRU9mWnatQzz6JMQjWoewOirTCB-Jy6VpyMtpj0WSDq8iyaodSs-9g8LHYoH_lABsVxqZB0owwkdZr18Nb-KYGQNj4=w1857-h836-s-no-gm?authuser=0",
    category: "Лагери",
    link: "http://ramhard.net/lz1kam/",
  },
];

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

      // Комбиниране на статичните и динамичните новини
      const allNews = [...staticNewsItems, ...newsData];
      setNewsItems(allNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Ако има грешка при зареждането от Firebase, показваме поне статичните новини
      setNewsItems(staticNewsItems);
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
