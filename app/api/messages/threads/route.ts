import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createThread, deleteThread } from "@/lib/mutations";
import { getThreadsForUser } from "@/lib/queries";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.username)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const threads = await getThreadsForUser(session.user.username);
  return NextResponse.json(threads);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.username)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { receiverUsername, encryptionKey } = await req.json();
  const thread = await createThread(
    session.user.username,
    receiverUsername,
    encryptionKey
  );
  return NextResponse.json(thread);
}
