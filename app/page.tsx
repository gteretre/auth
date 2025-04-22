"use client";

import AuthForm from "./(components)/AuthForm";
import MemberSessionInfo from "./(components)/MemberSessionInfo";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-transparent">
        <AuthForm />
        <MemberSessionInfo />
      </div>
    </div>
  );
}
