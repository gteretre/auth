import { getTasksByBoard } from "@/lib/queries";
import { auth } from "@/lib/auth";
import KanbanClientPage from "./kanban-client-page";
import { redirect } from "next/navigation";
import { Task } from "@/components/Board";

interface PlanPageProps {
  params: {
    id: string;
  };
}

export default async function PlanPage({ params }: PlanPageProps) {
  const session = await auth();
  const username = session?.user?.username;
  if (!username) {
    redirect("/api/auth/signin");
  }
  const boardId = (await params).id;
  const db = await import("@/lib/mongodb").then((m) => m.getDb());
  const board = await db
    .collection("boards")
    .findOne({ _id: new (await import("mongodb")).ObjectId(boardId) });

  if (!board || board.authorUsername !== username) {
    redirect("/plan");
  }

  let initialTasks: Task[] = [];
  try {
    initialTasks = await getTasksByBoard(boardId, username);
  } catch (error) {
    initialTasks = [];
  }

  return (
    <KanbanClientPage
      initialTasks={initialTasks}
      authorUsername={username}
      boardId={boardId}
    />
  );
}
