import { createBoard } from "@/lib/mutations";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function CreatePlanPage() {
  const session = await auth();
  const authorUsername = session?.user?.username as string | undefined;
  if (!authorUsername) {
    redirect("/api/auth/signin");
  }
  const newBoard = await createBoard({
    title: "Untitled Board",
    authorUsername
  });
  redirect(`/plan/${newBoard._id}`);
  return null;
}
