"use client";

import React, { useState } from "react";
import MyNavbar from "@/components/MyNavbar"; // ако имаш компонент за Navbar
import MyFooter from "@/components/MyFooter"; // ако имаш компонент за Footer

const GalleryPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Масив с пътища към снимките за различни състезания
  const events = [
    {
      title: "Състезание 1: Световен шампионат 2022",
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
        <h1 className="text-3xl font-bold text-center pt-10 mb-8 text-orange-500">
          Галерия
        </h1>

        {/* Показване на събитията едно до друго */}
        <div className="flex flex-wrap justify-center gap-8">
          {events.map((event, eventIndex) => (
            <div key={eventIndex} className="w-full md:w-1/3 p-4">
              {/* Надпис за събитието */}
              <h2 className="text-2xl font-semibold text-center mb-4">
                {event.title}
              </h2>

              {/* Главна снимка на събитието */}
              <img
                src={event.mainImage}
                alt={`Главна снимка за ${event.title}`}
                className="w-full h-60 object-cover rounded-lg shadow-md cursor-pointer"
                onClick={() => {
                  setSelectedEvent(eventIndex); // Записваме кой е избраният събитие
                  setSelectedImageIndex(0); // Започваме с първата снимка на събитието
                }}
              />
            </div>
          ))}
        </div>

        {/* Модален прозорец за показване на всички снимки от събитието */}
        {selectedEvent !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setSelectedEvent(null)} // Затваря модала при клик върху фона
          >
            <div className="relative max-w-5xl max-h-full">
              {/* Бутон за затваряне на модала */}
              <button
                className="absolute top-4 right-4 text-white bg-gray-800 p-3 rounded-full text-3xl"
                onClick={() => setSelectedEvent(null)} // Затваря модала при клик върху бутона
              >
                &times; {/* Иконка за затваряне */}
              </button>

              {/* Преглед на снимките на събитието */}
              <div className="flex justify-center items-center space-x-4">
                {/* Ляв бутон за предишна снимка */}
                <button
                  className="text-white text-4xl"
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

                {/* Избрана снимка от галерията */}
                <img
                  src={events[selectedEvent].images[selectedImageIndex]}
                  alt="Избрана снимка"
                  className="w-full max-w-screen-lg h-auto rounded-lg shadow-xl"
                />

                {/* Десен бутон за следваща снимка */}
                <button
                  className="text-white text-4xl"
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
