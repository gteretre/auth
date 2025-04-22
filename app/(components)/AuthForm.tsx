"use client";
import { useState } from "react";

export default function AuthForm() {
  const [tab, setTab] = useState("login");
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-xl p-8 flex flex-col items-center gap-8 border border-black/10 dark:border-white/10">
      <div className="flex w-full justify-center gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
            tab === "login"
              ? "bg-foreground text-background"
              : "bg-black/5 dark:bg-white/10 text-foreground"
          }`}
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
            tab === "register"
              ? "bg-foreground text-background"
              : "bg-black/5 dark:bg-white/10 text-foreground"
          }`}
          onClick={() => setTab("register")}
        >
          Register
        </button>
      </div>
      {tab === "login" ? (
        <form className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-foreground text-background font-semibold hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            disabled
          >
            Login (coming soon)
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Name"
            className="px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-foreground text-background font-semibold hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            disabled
          >
            Register (coming soon)
          </button>
        </form>
      )}
    </div>
  );
}
