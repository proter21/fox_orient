"use client";

import React, { useState } from "react";
import Image from "next/image";
import MyNavbar from "@/components/MyNavbar"; // ако имаш компонент за Navbar
import MyFooter from "@/components/MyFooter"; // ако имаш компонент за Footer

const GalleryPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Масив с пътища към снимките за различни състезания
  const events = [
    {
      title: "Състезание 1: Световен шампионат 2022",
      date: "12.08.2022",
      location: "Чехия",
      mainImage: "/images/WorldChampChec2024.jpg", // Главна снимка на събитието
      images: [
        "/images/evr2022.WorldChampChec2024",
        "/images/TroianDP2024.jpg",
        "/images/photo4.jpg",
        "/images/photo5.jpg",
        "/images/photo6.jpg",
      ],
    },
    {
      title: "Състезание 2: Национален турнир 2023",
      date: "15.05.2023",
      location: "България",
      mainImage: "/images/photo7.jpg", // Главна снимка на събитието
      images: [
        "/images/photo8.jpg",
        "/images/photo9.jpg",
        "/images/photo10.jpg",
        "/images/photo11.jpg",
        "/images/photo12.jpg",
      ],
    },
    {
      title: "Състезание 3: Турнир в Парк Витоша",
      date: "20.09.2023",
      location: "София, България",
      mainImage: "/images/WorldChamp2022.jpg", // Главна снимка на събитието
      images: [
        "/images/photo14.jpg",
        "/images/photo15.jpg",
        "/images/photo16.jpg",
        "/images/photo17.jpg",
      ],
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <MyNavbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center pt-10 mb-8 text-orange-500">
          Галерия
        </h1>

        {/* Показване на събитията едно до друго */}
        <div className="flex flex-wrap justify-center gap-8">
          {events.map((event, eventIndex) => (
            <div key={eventIndex} className="w-full md:w-1/3 p-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={event.mainImage}
                  alt={`Главна снимка за ${event.title}`}
                  width={500}
                  height={240}
                  className="w-full h-60 object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(eventIndex); // Записваме кой е избраният събитие
                    setSelectedImageIndex(0); // Започваме с първата снимка на събитието
                  }}
                />
                <div className="p-4">
                  {/* Надпис за събитието */}
                  <h2 className="text-2xl font-semibold text-center mb-2">
                    {event.title}
                  </h2>
                  <p className="text-center text-gray-600">
                    {event.date} - {event.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Модален прозорец за показване на всички снимки от събитието */}
        {selectedEvent !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
            onClick={() => setSelectedEvent(null)} // Затваря модала при клик върху фона
          >
            <div className="relative bg-white rounded-lg shadow-lg max-w-5xl max-h-full overflow-auto">
              {/* Бутон за затваряне на модала */}
              <button
                className="absolute top-4 right-4 text-gray-800 bg-gray-200 p-2 rounded-full text-2xl"
                onClick={() => setSelectedEvent(null)} // Затваря модала
              >
                &times;
              </button>
              <div className="flex justify-center items-center space-x-4 p-4">
                <button
                  className="text-gray-800 text-4xl"
                  onClick={() =>
                    setSelectedImageIndex(
                      (selectedImageIndex +
                        events[selectedEvent].images.length -
                        1) %
                        events[selectedEvent].images.length
                    )
                  }
                >
                  &#60;
                </button>
                <Image
                  src={events[selectedEvent].images[selectedImageIndex]}
                  alt="Избрана снимка"
                  width={800}
                  height={600}
                  className="w-full max-w-screen-lg h-auto rounded-lg shadow-xl"
                />
                <button
                  className="text-gray-800 text-4xl"
                  onClick={() =>
                    setSelectedImageIndex(
                      (selectedImageIndex + 1) %
                        events[selectedEvent].images.length
                    )
                  }
                >
                  &#62;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <MyFooter />
    </div>
  );
};

export default GalleryPage;
