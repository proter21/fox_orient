"use client";

import React, { useState, useCallback } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../../firebase/firebase";
import { FirebaseError } from "firebase/app";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/"); // Пренасочване към профила след успешен вход
      } catch (error) {
        if (error instanceof FirebaseError) {
          setError(error.message); // Firebase error message
        } else {
          setError("Неизвестна грешка при влизането.");
        }
      }
    },
    [email, password, router]
  );

  return (
    <main>
      <section className="login py-12 my-12 min-h-screen">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Вход
          </h2>
          <div className="form bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} id="loginForm">
              {/* Email */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Вашият имейл"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Password */}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Парола"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary bg-orange-500 text-white w-full py-3 rounded-lg text-lg font-bold hover:bg-orange-600 transition-all"
              >
                Вход
              </button>
            </form>

            {/* Link to Register page */}
            <div className="text-center mt-4">
              <span className="text-gray-600">Нямате акаунт? </span>
              <Link
                href="/register"
                className="text-orange-500 hover:text-orange-600 underline font-bold"
              >
                Регистрирайте се
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default React.memo(LoginPage);
