"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { db, auth } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import type { Competition } from "@/interfaces";
import AutoplayCarousel from "@/components/AutoCarousel";

const features = [
  {
    title: "Лесно управление на състезанията",
    description:
      "Организирайте събития и управлявайте записванията бързо и лесно.",
  },
  {
    title: "Следете класациите на живо",
    description: "Реално време резултати и класации за всички състезатели.",
  },
  {
    title: "Карти и ориентиране",
    description:
      "Достъп до интерактивни карти за по-лесно проследяване и навигация.",
  },
  {
    title: "Сигурност и подкрепа",
    description: "Проследяване и SOS функция за безопасност на участниците.",
  },
];

async function getUpcomingCompetitions(): Promise<Competition[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const competitionsRef = collection(db, "competitions");
  const q = query(
    competitionsRef,
    where("date", ">=", today.toISOString()),
    orderBy("date", "asc"),
    limit(2)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Competition)
  );
}

export default function Home() {
  const [upcomingCompetitions, setUpcomingCompetitions] = useState<
    Competition[]
  >([]);
  const [registeredCompetitions, setRegisteredCompetitions] = useState<
    string[]
  >([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const competitions = await getUpcomingCompetitions();
      setUpcomingCompetitions(competitions);

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRegisteredCompetitions(
            userDoc.data().registeredCompetitions || []
          );
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="relative w-full h-screen">
        <AutoplayCarousel />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white px-4 space-y-6">
            <h1 className="text-4xl font-bold opacity-0 translate-y-4 animate-[fadeIn_1s_ease-out_forwards]">
              Добре дошли в FoxOrient
            </h1>
            <p className="text-lg opacity-0 translate-y-4 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
              Интернет приложение за улеснена организация на състезания по
              спортно радиозасичане.
            </p>
            <Link
              href="/competitions"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded text-lg 
                       opacity-0 scale-95 animate-[fadeScale_0.5s_ease-out_1s_forwards] transition-colors"
            >
              Запишете се сега
            </Link>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-gray-100 py-12 text-center text-gray-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 opacity-0 animate-[fadeIn_1s_ease-out_forwards] [animation-play-state:paused] sticky:animation-play-state:running">
            Основни функции на приложението
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow rounded opacity-0 translate-y-4 hover:shadow-lg"
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.2}s forwards`,
                }}
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="bg-white py-12 text-center text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 opacity-0 animate-[fadeIn_1s_ease-out_forwards] [animation-play-state:paused] sticky:animation-play-state:running">
            Предстоящи събития
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingCompetitions.map((competition, index) => (
              <div
                key={competition.id}
                className="bg-gray-100 p-6 shadow rounded opacity-0 translate-y-4 hover:shadow-lg"
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.2}s forwards`,
                }}
              >
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-orange-500">
                  {competition.name}
                </h3>
                <p className="mb-4 transition-all duration-300 hover:text-gray-600">
                  Дата: {new Date(competition.date).toLocaleDateString()} |
                  Място: {competition.location}
                </p>
                {registeredCompetitions.includes(competition.id) ? (
                  <p className="text-green-600 font-bold transition-all duration-300 hover:scale-105">
                    Вие сте регистрирани за това състезание.
                  </p>
                ) : (
                  <Link
                    href={`/competitions/${competition.id}/register`}
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-all duration-300 transform hover:scale-110"
                  >
                    Регистрация
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white w-12 h-12 rounded-full 
                   flex items-center justify-center shadow-lg transition-all duration-300 z-50
                   ${
                     showScrollTop
                       ? "opacity-100 translate-y-0"
                       : "opacity-0 translate-y-16"
                   }`}
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
