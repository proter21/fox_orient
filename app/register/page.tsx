"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import MyNavbar from "@/components/MyNavbar";
import MyFooter from "@/components/MyFooter";
import Link from "next/link";
import { auth, db } from "../firebase/firebase";
import { FaMale, FaFemale } from "react-icons/fa";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const birthDate = (form.elements.namedItem("birthDate") as HTMLInputElement)
      .value;
    const gender =
      (form.elements.namedItem("gender") as HTMLInputElement).value === "Мъж"
        ? "male"
        : "female";
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

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
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <MyNavbar />
      <section className="register py-12 my-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Регистрация
          </h2>
          <div className="form bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            {error && (
              <div className="text-red-500 text-center mb-4 font-semibold">
                {error}
              </div>
            )}
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
      <MyFooter />
    </main>
  );
}
