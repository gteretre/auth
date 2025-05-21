import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getThreadsForUser } from "@/lib/queries";
import { deleteThread } from "@/lib/mutations";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Optionally implement get single thread if needed
  return NextResponse.json({});
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.username)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Optionally check thread ownership
  await deleteThread(params.id);
  return NextResponse.json({ success: true });
}
