import { auth } from "@/lib/auth";
import CurrentThreadClient from "./CurrentThreadClient";
import {
  getThreadsForUser,
  getAuthorByUsername,
  getAuthorById
} from "@/lib/queries";

export default async function ThreadPage({
  params
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.username)
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Unauthorized
      </div>
    );
  const threads = await getThreadsForUser(session.user.username);
  const thread = threads.find((t) => t._id === params.id);
  if (!thread)
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Thread not found
      </div>
    );
  const currentUser = await getAuthorByUsername(session.user.username);
  const otherId = thread.userIds.find((id) => id !== currentUser?._id);
  const otherUser = otherId ? await getAuthorById(otherId) : null;
  return (
    <section className="app-main-content" style={{ overflow: "hidden" }}>
      <CurrentThreadClient
        currentUser={currentUser}
        otherUser={otherUser}
        threadId={params.id}
      />
    </section>
  );
}
