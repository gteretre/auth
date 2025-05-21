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
            <Link href="/messages">Wiadomości</Link>
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
