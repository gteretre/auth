"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MemberSessionInfo from "../(components)/MemberSessionInfo";

const Member = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/api/auth/signin?callbackUrl=/member");
    }
  }, [status, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md">
        <MemberSessionInfo />
      </div>
    </div>
  );
};

export default Member;
