"use client";
import { useSession } from "next-auth/react";

const GlobalLoadingIndicator = () => {
  const { status } = useSession();
  if (status === "loading") {
    return (
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1 bg-blue-500 animate-pulse" />
      </div>
    );
  }
  return null;
};

export default GlobalLoadingIndicator;
