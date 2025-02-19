"use client";

import React, { useState, FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const ChangePasswordPage: React.FC = () => {
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const email = auth.currentUser?.email || "";

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Не е открит имейл адрес. Моля, влезте отново.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Линк за смяна на паролата е изпратен на вашия имейл.");
    } catch (err: unknown) {
      setError("Грешка при изпращането на линка. Моля, опитайте отново.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-gray-800 py-32">
        <div className="container mx-auto flex flex-col items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold text-orange-500 mb-4">
              Смяна на паролата
            </h1>

            <p className="mb-4">
              Линк за смяна на паролата ще бъде изпратен на имейл:{" "}
              <strong>{email}</strong>
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition"
              >
                Изпрати линк за смяна на парола
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
