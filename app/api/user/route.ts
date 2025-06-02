import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const id = req.nextUrl.searchParams.get("id") || "";

  const db = await getDb();

  let users = [];

  if (id) {
    try {
      const user = await db
        .collection("authors")
        .findOne(
          { _id: new ObjectId(id) },
          { projection: { _id: 0, username: 1, name: 1, image: 1 } }
        );
      if (user) users = [user];
    } catch (e) {
      users = [];
    }
    return NextResponse.json(users);
  }

  if (!q) return NextResponse.json([]);

  users = await db
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
