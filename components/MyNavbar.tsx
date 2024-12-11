"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/interfaces"; // Import User type
import { auth, db } from "@/app/firebase/firebase";

const MyNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-800 text-white py-4 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-orange-500 text-2xl font-bold">
          <Link href="/" className="text-orange-500">
            FoxOrient
          </Link>
        </div>

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
          <Link href="/about" className="text-white hover:text-orange-400">
            За нас
          </Link>

          {user ? (
            <div className="relative">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                onClick={toggleDropdown}
              >
                {userData?.fullName || user.email}
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-2 bg-zinc-800 text-white rounded shadow-lg w-44">
                  <Link href="/profile">
                    <button className="w-full text-left px-4 py-2 hover:bg-orange-600">
                      Профил
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-orange-600"
                  >
                    Изход
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                onClick={toggleDropdown}
              >
                Вход/Регистрация
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-2 bg-zinc-800 text-white rounded shadow-lg w-44">
                  <Link href="/login">
                    <button className="w-full text-left px-4 py-2 hover:bg-orange-600 ">
                      Вход
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="w-full text-left px-4 py-2 hover:bg-orange-600">
                      Регистрирай се
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

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

      <nav
        className={`${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } fixed top-0 right-0 w-7/8 bg-zinc-800 mt-16 text-white h-full md:hidden transition-all duration-300 ease-in-out`}
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
              href="/about"
              className="block py-2 text-white hover:text-orange-400"
              onClick={() => setIsMenuOpen(false)}
            >
              За нас
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  href="/profile"
                  className="block py-2 text-white hover:text-orange-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профил
                </Link>
              </li>
              <li>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full"
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Вход
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Регистрирай се
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MyNavbar;
