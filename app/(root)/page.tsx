import React from "react";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <main className="container mx-auto flex flex-col items-center justify-center text-center">
        {session ? (
          <>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
              Przejdź do wiadomości
            </h1>
            <Link
              href="/messages"
              className="inline-block rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300"
            >
              Wiadomości
            </Link>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
              Zaloguj się, aby wysyłać prywatne wiadomości
            </h1>
          </>
        )}
      </main>
    </div>
  );
}
