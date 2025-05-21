import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteMessage } from "@/lib/mutations";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.username)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Optionally check message ownership
  await deleteMessage(params.id);
  return NextResponse.json({ success: true });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Optionally implement get single message if needed
  return NextResponse.json({});
}
