import { getDb } from "./mongodb";
import { Author } from "./models";

export async function createAuthor(author: Omit<Author, "_id">) {
  const db = await getDb();
  if (!author.provider) {
    throw new Error("Provider is required for author");
  }
  const authorData = {
    ...author,
    createdAt: new Date()
  };
  const result = await db.collection("authors").insertOne(authorData);

  return {
    _id: result.insertedId.toString(),
    ...authorData
  };
}

export async function updateAuthor() {
  return true;
}
