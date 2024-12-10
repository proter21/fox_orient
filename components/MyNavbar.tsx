"use client";

import React, { useState } from "react";
import Link from "next/link";

const MyNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Затваряне на менюто при клик извън него
  const closeMenu = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target && !target.closest("nav") && !target.closest("button")) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-800 text-white py-4 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Логото */}
        <div className="text-orange-500 text-2xl font-bold">
          <Link href="/" className="text-orange-500">
            FoxOrient
          </Link>
        </div>

        {/* Навигационни линкове за десктоп */}
        <nav className="hidden md:flex space-x-6 ml-auto">
          <Link href="/#features" className="text-white hover:text-orange-400">
            Функции
          </Link>
          <Link href="/#events" className="text-white hover:text-orange-400">
            Събития
          </Link>
          <Link href="/gallery" className="text-white hover:text-orange-400">
            Галерия
          </Link>
          <Link href="/#about" className="text-white hover:text-orange-400">
            За нас
          </Link>
          <Link href="/register">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
              Регистрирай се
            </button>
          </Link>
        </nav>

        {/* Бургер бутон за мобилни екрани */}

        <button
          className={`p-4 md:hidden text-4xl focus:outline-none transition-all duration-300 ease-in-out absolute top-1/2 right-4 transform -translate-y-1/2 z-50`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {/* Три черти за бургер меню */}
          <div
            className={`w-6 h-0.5 bg-orange-500 block transition-all duration-300 ease-in-out ${
              isMenuOpen ? "rotate-45 translate-y-1" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-orange-500 block transition-all duration-300 ease-in-out ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-orange-500 block transition-all duration-300 ease-in-out ${
              isMenuOpen ? "-rotate-45 translate-y-[-1px]" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Мобилно меню */}
      <nav
        className={`${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 w-7/8 bg-zinc-800 text-white h-full md:hidden transition-all duration-300 ease-in-out`}
        onClick={closeMenu} // Затваряне при клик извън менюто
      >
        <ul className="space-y-4 p-4 text-sm my-8">
          <li>
            <Link
              href="/#features"
              className="block py-2 text-white hover:text-orange-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Функции
            </Link>
          </li>
          <li>
            <Link
              href="/#events"
              className="block py-2 text-white hover:text-orange-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Събития
            </Link>
          </li>
          <li>
            <Link
              href="/gallery"
              className="block py-2 text-white hover:text-orange-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Галерия
            </Link>
          </li>
          <li>
            <Link
              href="/#about"
              className="block py-2 text-white hover:text-orange-400"
              onClick={() => setIsMenuOpen(false)}
            >
              За нас
            </Link>
          </li>
          <li>
            <Link href="/register">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Регистрирай се
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MyNavbar;
