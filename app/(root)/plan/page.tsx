import { getBoardsByUser } from "@/lib/queries";
import { createBoard } from "@/lib/mutations";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Add import for deleting board
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function PlanPage() {
  const session = await auth();
  const authorUsername = session?.user?.username as string | undefined;
  if (!authorUsername) {
    redirect("/api/auth/signin");
  }
  const boards = await getBoardsByUser(authorUsername);

  async function handleCreateBoard(formData: FormData) {
    "use server";
    const newBoard = await createBoard({
      title: "Untitled Board",
      authorUsername
    });
    redirect(`/plan/${newBoard._id}`);
  }

  async function handleDeleteBoard(formData: FormData) {
    "use server";
    const boardId = formData.get("boardId") as string;
    if (!boardId) return;
    const db = await getDb();
    await db
      .collection("boards")
      .deleteOne({ _id: new ObjectId(boardId), authorUsername });
    // Optionally, delete related tasks/cards
    await db.collection("tasks").deleteMany({ boardId, authorUsername });
    await db.collection("cards").deleteMany({ boardId, authorUsername });
    // Refresh the page
    redirect("/plan");
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 mt-8">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-primary">
        Moje tablice Kanban
      </h1>
      <form action={handleCreateBoard} className="flex justify-center mb-8">
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          + Stwórz nową tablicę Kanban
        </button>
      </form>
      <ul className="space-y-4">
        {boards.map((board) => (
          <li
            key={board._id}
            className="flex items-center justify-between bg-card dark:bg-card rounded-lg shadow p-4 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
              <a
                href={`/plan/${board._id}`}
                className="text-lg font-semibold text-blue-700 truncate hover:text-blue-900 transition-colors"
              >
                {board.title}
              </a>
              <span className="ml-0 sm:ml-4 text-gray-500 text-xs whitespace-nowrap">
                {new Date(board.createdAt).toLocaleString()}
              </span>
            </div>
            <form action={handleDeleteBoard} className="ml-4">
              <input type="hidden" name="boardId" value={board._id} />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold shadow hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                title="Usuń tablicę"
              >
                Usuń
              </button>
            </form>
          </li>
        ))}
      </ul>
      {boards.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          Nie masz jeszcze żadnych tablic. Stwórz pierwszą!
        </div>
      )}
    </div>
  );
}
