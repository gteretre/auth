import { auth } from "@/lib/auth";
import { createMessage } from "@/lib/mutations";
import { getMessagesForThread } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get("threadId");
  if (!threadId) return NextResponse.json([]);
  const messages = await getMessagesForThread(threadId);
  // Only return encryptedContent and required fields
  return NextResponse.json(
    messages.map((m) => ({
      _id: m._id,
      threadId: m.threadId,
      authorId: m.authorId,
      encryptedContent: m.encryptedContent,
      createdAt: m.createdAt
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.username)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { threadId, content, encryptedContent } = await req.json();
  if (!threadId || !encryptedContent || !content)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const message = await createMessage(
    threadId,
    session.user.username,
    content,
    encryptedContent
  );
  return NextResponse.json(message);
}
