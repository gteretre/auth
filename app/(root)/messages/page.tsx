import { auth } from "@/lib/auth";
import ThreadsClient from "./ThreadsClient";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.username)
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Unauthorized
      </div>
    );
  return (
    <section className="app-main-content">
      <ThreadsClient username={session.user.username} />
    </section>
  );
}
