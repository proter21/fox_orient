"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Correct import path

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "../firebase/firebase";
import { FaMale, FaFemale } from "react-icons/fa";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast(); // Initialize useToast

  const handleRegister = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const form = e.currentTarget;
      const fullName = (form.elements.namedItem("fullName") as HTMLInputElement)
        .value;
      const email = (form.elements.namedItem("email") as HTMLInputElement)
        .value;
      const birthDate = (
        form.elements.namedItem("birthDate") as HTMLInputElement
      ).value;
      const gender =
        (form.elements.namedItem("gender") as HTMLInputElement).value === "Мъж"
          ? "male"
          : "female";
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;

      const birthDateObj = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
      ) {
        age--;
      }

      if (age < 12) {
        toast({
          title: "Грешка",
          description:
            "Трябва да сте поне на 12 години, за да се регистрирате.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          fullName,
          email,
          birthDate,
          gender,
          createdAt: new Date().toISOString(),
        });

        await auth.signOut(); // Sign out the user after registration
        router.push("/login");
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast({
            title: "Грешка",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Грешка",
            description: "An unknown error occurred",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [router, toast]
  );

  return (
    <main>
      <section className="register py-12 my-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Регистрация
          </h2>
          <div className="form bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            <form id="registrationForm" onSubmit={handleRegister}>
              <div className="form-group mb-4">
                <label
                  htmlFor="fullName"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Име и фамилия
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Вашето име и фамилия"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="form-group mb-4">
                <label
                  htmlFor="email"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Имейл
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Вашият имейл"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="form-group mb-4">
                <label
                  htmlFor="birthDate"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Дата на раждане
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="form-group mb-4">
                <label className="block text-lg font-bold mb-2 text-gray-700">
                  Пол
                </label>
                <div className="flex items-center mb-4 space-x-16">
                  {" "}
                  {/* Add more space between options */}
                  <div className="gender-radio flex items-center">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="Мъж"
                      required
                      className="mr-2"
                    />
                    <label
                      htmlFor="male"
                      className="text-gray-700 flex items-center"
                    >
                      <FaMale className="mr-1" /> Мъж
                    </label>
                  </div>
                  <div className="gender-radio flex items-center">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="Жена"
                      required
                      className="mr-2"
                    />
                    <label
                      htmlFor="female"
                      className="text-gray-700 flex items-center"
                    >
                      <FaFemale className="mr-1" /> Жена
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group mb-6">
                <label
                  htmlFor="password"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Парола
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Парола"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="form-group mb-6">
                <label
                  htmlFor="terms"
                  className="flex items-center text-gray-700"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mr-2"
                  />
                  Съгласявам се с&nbsp;
                  <Link
                    href="/terms"
                    className="text-orange-500 hover:text-orange-600 underline font-bold"
                  >
                    условията на сайта
                  </Link>
                </label>
              </div>
              <button
                type="submit"
                className="btn-primary bg-orange-500 text-white w-full py-3 rounded-lg text-lg font-bold hover:bg-orange-600 transition-all"
                disabled={loading}
              >
                {loading ? "Регистриране..." : "Регистрирай се"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
