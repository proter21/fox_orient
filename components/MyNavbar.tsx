import React from "react";
import Link from "next/link";

const MyNavbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-800 text-white py-4 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-orange-500 text-2xl font-bold">
          <Link href="/" className="text-orange-500">
            FoxOrient
          </Link>
        </div>
        <nav className="flex space-x-4">
          <Link href="#features" className="text-white hover:text-orange-400">
            Функции
          </Link>
          <Link href="#events" className="text-white hover:text-orange-400">
            Събития
          </Link>
          <Link href="/gallery" className="text-white hover:text-orange-400">
            Галерия
          </Link>
          <Link href="#about" className="text-white hover:text-orange-400">
            За нас
          </Link>
          <Link href="/register">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
              Регистрирай се
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default MyNavbar;
