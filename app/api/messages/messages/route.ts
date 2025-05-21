import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMessagesForThread } from "@/lib/queries";
import { createMessage } from "@/lib/mutations";

export async function GET(req: NextRequest) {
  const threadId = req.nextUrl.searchParams.get("threadId");
  if (!threadId)
    return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
  const messages = await getMessagesForThread(threadId);
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.username)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { threadId, content } = await req.json();
  const message = await createMessage(threadId, session.user.username, content);
  return NextResponse.json(message);
}
