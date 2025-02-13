"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "1",
      title: "Sample News 1",
      content: "This is the content of sample news 1.",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Sample News 2",
      content: "This is the content of sample news 2.",
      date: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const newsRef = collection(db, "news");
      const q = query(newsRef, orderBy("date", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const newsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as NewsItem)
      );
      setNews(newsData);
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Зареждане...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Новини</h1>
      <div className="grid gap-6">
        {news.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(item.date).toLocaleDateString()}
              </p>
              <p>{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button className="mt-6 bg-orange-500 hover:bg-orange-600">
        Зареди още
      </Button>
    </div>
  );
}
