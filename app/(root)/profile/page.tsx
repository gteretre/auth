import { auth } from "@/lib/auth";
import Image from "next/image";

import { getAuthorByUsername } from "@/lib/queries";

export default async function ProfilePage() {
  const session = await auth();
  const username = session?.user?.username || session?.user?.id || null;
  let user = null;
  if (username) {
    user = await getAuthorByUsername(username);
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card rounded-2xl shadow-lg shadow-shadow p-10 max-w-md w-full text-center">
        {user.image && (
          <div className="mb-6 flex justify-center">
            <Image
              src={user.image}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover border-2 border-border"
            />
          </div>
        )}
        <h2 className="mb-2 font-bold text-2xl">
          {user.name || user.username || user.email}
        </h2>
        <div className="text-muted-foreground mb-4">@{user.username}</div>
        <div className="mb-4 text-base">{user.bio || "No bio provided."}</div>
        <div className="flex flex-col gap-2 items-start mx-auto max-w-xs text-left">
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Role:</span> {user.role || "user"}
          </div>
          <div>
            <span className="font-semibold">Provider:</span> {user.provider}
          </div>
          <div>
            <span className="font-semibold">Created:</span>{" "}
            {user.createdAt
              ? typeof user.createdAt === "string"
                ? user.createdAt
                : user.createdAt.toLocaleString()
              : "-"}
          </div>
          <div>
            <span className="font-semibold">ID:</span> {user.id}
          </div>
          <div>
            <span className="font-semibold">_id:</span> {user._id}
          </div>
        </div>
      </div>
    </div>
  );
}
