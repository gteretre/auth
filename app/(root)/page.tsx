import { auth } from "@/lib/auth";
import Link from "next/link";
import { KanbanIcon, Pencil } from "lucide-react";
import React from "react";

export default async function HomePage() {
  const session = await auth();
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-1 flex-col items-center justify-center p-4">
      <main className="container mx-auto flex flex-col items-center justify-center text-center">
        {session ? (
          <div className="mb-8 flex flex-col items-center gap-6">
            <h1 className="text-3xl font-extrabold text-primary mb-2">
              Witaj, {session.user?.username}!
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Twoje projekty:
            </p>
            <div className="flex gap-4">
              <Link
                href="/plan/create"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-base font-semibold text-accent-foreground shadow transition hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <Pencil size={20} />
                Stwórz nowy plan
              </Link>
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white dark:text-black shadow transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <KanbanIcon size={20} />
                Moje plany
              </Link>
            </div>
          </div>
        ) : (
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
            Zaloguj się, aby korzystać z aplikacji
          </h1>
        )}
      </main>
    </div>
  );
}
