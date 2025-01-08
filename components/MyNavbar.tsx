"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/interfaces"; // Import User type
import { auth, db } from "@/app/firebase/firebase";
import { SiFirefoxbrowser } from "react-icons/si";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

const MyNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          fullName: currentUser.displayName || "",
          email: currentUser.email || "",
          birthDate: "", // Placeholder if not available
          createdAt: currentUser.metadata.creationTime || "",
        });
        // Fetch user document from Firestore
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User);
          } else {
            console.error("No such user document!");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const toggleSubMenu = (menu: string) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  const goBack = () => {
    setActiveSubMenu(null);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-800 text-white py-4 z-50 shadow-md flex">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-orange-500 text-2xl font-bold flex gap-3">
          <Link href="/" className="text-orange-500">
            FoxOrient
          </Link>
          <SiFirefoxbrowser className="mt-1" />
        </div>

        <Menubar className="hidden md:flex space-x-6 ml-auto bg-zinc-800 border-none">
          <MenubarMenu>
            <MenubarTrigger className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-105 focus:bg-orange-600 rounded">
              Функции
            </MenubarTrigger>
            <MenubarContent className="bg-zinc-800 text-white shadow-lg w-48 mt-2 rounded">
              <MenubarItem asChild>
                <Link
                  href="/classes"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Класове
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link
                  href="/results"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Резултати
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-105 focus:bg-orange-600 rounded">
              Събития
            </MenubarTrigger>
            <MenubarContent className="bg-zinc-800 text-white shadow-lg w-48 mt-2 rounded">
              <MenubarItem asChild>
                <Link
                  href="/calendar"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Календар
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link
                  href="/news"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Новини
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-105 focus:bg-orange-600 rounded">
              Галерия
            </MenubarTrigger>
            <MenubarContent className="bg-zinc-800 text-white shadow-lg w-48 mt-2 rounded">
              <MenubarItem asChild>
                <Link
                  href="/gallery"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Галерия
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-105 focus:bg-orange-600 rounded">
              За нас
            </MenubarTrigger>
            <MenubarContent className="bg-zinc-800 text-white shadow-lg w-48 mt-2 rounded">
              <MenubarItem asChild>
                <Link
                  href="/about"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Кои сме ние
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link
                  href="/competitors"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Състезатели
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded focus:bg-orange-600">
              {user ? userData?.fullName || user.email : "Вход/Регистрация"}
            </MenubarTrigger>
            <MenubarContent className="bg-zinc-800 text-white shadow-lg w-48 mt-2 rounded">
              {user ? (
                <>
                  <MenubarItem asChild>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                    >
                      Профил
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                    >
                      Изход
                    </button>
                  </MenubarItem>
                </>
              ) : (
                <>
                  <MenubarItem asChild>
                    <Link
                      href="/login"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                    >
                      Вход
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link
                      href="/register"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                    >
                      Регистрирай се
                    </Link>
                  </MenubarItem>
                </>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* Мобилно меню (burger) */}
        <div className="relative md:hidden">
          <button
            className="p-4 text-4xl focus:outline-none transition-all duration-300 ease-in-out"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
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
      </div>

      {/* Responsive меню */}
      <nav
        className={`${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 w-7/8 bg-zinc-800 mt-16 text-white h-full md:hidden transition-all duration-300 ease-in-out`}
      >
        {activeSubMenu ? (
          <div className="space-y-4 p-4 text-sm my-8">
            <button
              className="block w-full text-left px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 text-white rounded"
              onClick={goBack}
            >
              Назад
            </button>
            <ul className="space-y-4">
              {activeSubMenu === "functions" && (
                <>
                  <li>
                    <Link
                      href="/classes"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Класове
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/results"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Резултати
                    </Link>
                  </li>
                </>
              )}
              {activeSubMenu === "events" && (
                <>
                  <li>
                    <Link
                      href="/calendar"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Календар
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/news"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Новини
                    </Link>
                  </li>
                </>
              )}
              {activeSubMenu === "gallery" && (
                <li>
                  <Link
                    href="/gallery"
                    className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Галерия
                  </Link>
                </li>
              )}
              {activeSubMenu === "about" && (
                <>
                  <li>
                    <Link
                      href="/about"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Кои сме ние
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/competitors"
                      className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Състезатели
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        ) : (
          <ul className="space-y-4 p-4 text-sm my-8">
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:bg-orange-600"
                onClick={() => toggleSubMenu("functions")}
              >
                Функции <span className="float-right">{">"}</span>
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:bg-orange-600"
                onClick={() => toggleSubMenu("events")}
              >
                Събития <span className="float-right">{">"}</span>
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:bg-orange-600"
                onClick={() => toggleSubMenu("gallery")}
              >
                Галерия <span className="float-right">{">"}</span>
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:bg-orange-600"
                onClick={() => toggleSubMenu("about")}
              >
                За нас <span className="float-right">{">"}</span>
              </button>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 text-white rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Профил
                  </Link>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 text-white rounded"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Изход
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="block px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 text-white rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Вход
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="block px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 text-white rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Регистрирай се
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MyNavbar;
