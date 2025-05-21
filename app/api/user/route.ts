import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q) return NextResponse.json([]);
  const db = await getDb();
  const users = await db
    .collection("authors")
    .find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } }
      ]
    })
    .limit(10)
    .project({ _id: 0, username: 1, name: 1, image: 1 })
    .toArray();
  return NextResponse.json(users);
}
