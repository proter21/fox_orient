import React from "react";
import Link from "next/link";

const MyFooter = () => {
  return (
    <footer className="bg-zinc-800 text-white py-4 text-center">
      <p className="mb-4">&copy; 2024 FoxOrient. Всички права запазени.</p>
      <div className="space-x-4">
        <Link
          href="https://www.facebook.com/bfrlradiozasicane"
          className="text-orange-500 hover:text-orange-400"
        >
          Facebook
        </Link>
        <Link href="#" className="text-orange-500 hover:text-orange-400">
          Instagram
        </Link>
        <Link href="#" className="text-orange-500 hover:text-orange-400">
          Twitter
        </Link>
      </div>
    </footer>
  );
};

export default MyFooter;
