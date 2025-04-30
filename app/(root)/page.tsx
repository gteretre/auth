import React from "react";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-1 flex-col items-center justify-center p-4">
      <main className="container mx-auto flex flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          Cześć, pisz prywatne wiadomości i nie wiem...
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">Jakiś inny tekst.</p>
        <div className="space-x-4">czesc</div>
      </main>
    </div>
  );
}
