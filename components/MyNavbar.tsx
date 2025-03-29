"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { SiFirefoxbrowser } from "react-icons/si";
import { BiSolidRightArrow } from "react-icons/bi";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { motion, AnimatePresence } from "framer-motion";

const MyNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  interface User {
    id: string;
    fullName: string;
    email: string;
    birthDate: string;
    createdAt: string;
    role: string;
    ageGroup: string;
    gender: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  interface FetchUserData {
    (uid: string): Promise<void>;
  }

  const fetchUserData: FetchUserData = useCallback(async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.error("No such user document!");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          fullName: currentUser.displayName || "",
          email: currentUser.email || "",
          birthDate: "",
          createdAt: currentUser.metadata.creationTime || "",
          role: "",
          ageGroup: "",
          gender: "",
        });
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (activeSubMenu) setActiveSubMenu(null);
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

  interface ToggleSubMenu {
    (menu: string): void;
  }

  const toggleSubMenu: ToggleSubMenu = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0 },
  };

  const subMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" },
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-800 text-white py-4 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <motion.div
          className="text-orange-500 text-2xl font-bold flex gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-orange-500">
            FoxOrient
          </Link>
          <SiFirefoxbrowser className="mt-1" />
        </motion.div>

        <Menubar className="hidden md:flex space-x-6 ml-auto bg-zinc-800 border-none">
          <MenubarMenu>
            <MenubarTrigger className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-105 focus:bg-orange-600 rounded">
              Състезания
            </MenubarTrigger>
            <MenubarContent className="bg-zinc-800 text-white shadow-lg w-48 mt-2 rounded">
              <MenubarItem asChild>
                <Link
                  href="/results"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Резултати
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link
                  href="/competitions"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  Запиши се
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
                  Кои сме ние?
                </Link>
              </MenubarItem>
              <MenubarItem asChild>
                <Link
                  href="/ardf"
                  className="block px-4 py-2 hover:bg-orange-600 transition duration-300 focus:bg-orange-600 rounded"
                >
                  АРДФ
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

        <motion.div
          className="relative md:hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            className="p-4 text-4xl focus:outline-none transition-all duration-300 ease-in-out"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <div
              className={`w-6 h-0.5 bg-orange-500 block transition-all duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-orange-500 block my-1 transition-all duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-orange-500 block transition-all duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></div>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="fixed top-0 right-0 w-3/5 max-w-xs bg-zinc-800 h-full md:hidden overflow-y-auto shadow-lg"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 pt-16">
              <button
                className="text-3xl text-orange-500 mb-4 transition-colors duration-300 hover:text-orange-400"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                &times;
              </button>
              <ul className="space-y-4">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleSubMenu("functions")}
                  >
                    Състезания
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{
                        rotate: activeSubMenu === "functions" ? 90 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <BiSolidRightArrow />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeSubMenu === "functions" && (
                      <motion.ul
                        className="ml-4 mt-2 space-y-2"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <Link
                            href="/results"
                            className="block px-4 py-2 hover:bg-orange-600 transition duration-300 rounded"
                            onClick={toggleMenu}
                          >
                            Резултати
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/competitions"
                            className="block px-4 py-2 hover:bg-orange-600 transition duration-300 rounded"
                            onClick={toggleMenu}
                          >
                            Запиши се
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleSubMenu("events")}
                  >
                    Събития
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: activeSubMenu === "events" ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BiSolidRightArrow />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeSubMenu === "events" && (
                      <motion.ul
                        className="ml-4 mt-2 space-y-2"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <Link
                            href="/calendar"
                            className="block px-4 py-2 hover:bg-orange-600 transition duration-300 rounded"
                            onClick={toggleMenu}
                          >
                            Календар
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/news"
                            className="block px-4 py-2 hover:bg-orange-600 transition duration-300 rounded"
                            onClick={toggleMenu}
                          >
                            Новини
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleSubMenu("gallery")}
                  >
                    Галерия
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: activeSubMenu === "gallery" ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BiSolidRightArrow />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeSubMenu === "gallery" && (
                      <motion.ul
                        className="ml-4 mt-2 space-y-2"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <Link
                            href="/gallery"
                            className="block px-4 py-2 hover:bg-orange-600 transition duration-300 rounded"
                            onClick={toggleMenu}
                          >
                            Галерия
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-white hover:text-orange-400 transition duration-300 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleSubMenu("about")}
                  >
                    За нас
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: activeSubMenu === "about" ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BiSolidRightArrow />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeSubMenu === "about" && (
                      <motion.ul
                        className="ml-4 mt-2 space-y-2"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <Link
                            href="/about"
                            className="block px-4 py-2 hover:bg-orange-600 transition duration-300 rounded"
                            onClick={toggleMenu}
                          >
                            Кои сме ние?
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/ardf"
                            className="block px-4 py-2 hover:bg-orange-600 transition duration-300 rounded"
                            onClick={toggleMenu}
                          >
                            АРДФ
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 text-white rounded"
                        onClick={toggleMenu}
                      >
                        Профил
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 text-white rounded"
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
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
                        className="block px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 text-white rounded"
                        onClick={toggleMenu}
                      >
                        Вход
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="block px-4 py-2 bg-orange-500 hover:bg-orange-600 transition duration-300 text-white rounded"
                        onClick={toggleMenu}
                      >
                        Регистрирай се
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default React.memo(MyNavbar);
