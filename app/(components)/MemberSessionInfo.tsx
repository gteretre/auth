"use client";
import { useSession } from "next-auth/react";

const MemberSessionInfo = () => {
  const { data: session, status } = useSession();
  // above line is enough to get the session data and status
  // the rest of the code is just a demo
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-xl p-8 flex flex-col gap-4 border border-black/10 dark:border-white/10 min-h-[350px]">
      <h2 className="text-lg font-bold mb-2">Token Info</h2>
      {status === "loading" ? (
        <div className="text-foreground/60 text-sm">Loading...</div>
      ) : session ? (
        <>
          <div className="flex flex-col gap-2 mb-4">
            <div>
              <span className="font-semibold">Name:</span>{" "}
              {session.user?.name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {session.user?.email || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Role:</span>{" "}
              {(session.user && (session.user as any).role) || "N/A"}
            </div>
          </div>
          <pre className="bg-black/5 dark:bg-white/10 rounded-lg p-4 text-xs overflow-x-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </>
      ) : (
        <div className="text-foreground/60 text-sm">
          No token data. Please log in to see your token info here.
        </div>
      )}
    </div>
  );
};

export default MemberSessionInfo;
