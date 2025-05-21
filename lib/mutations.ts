import { getDb } from "./mongodb";
import { ObjectId } from "mongodb";
import { Author, Thread, Message } from "./models";
import { getAuthorByUsername } from "./queries";

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

export async function createThread(
  authorUsername: string,
  receiverUsername: string
) {
  const db = await getDb();
  const author = await getAuthorByUsername(authorUsername);
  const receiver = await getAuthorByUsername(receiverUsername);
  if (!author || !receiver) throw new Error("User not found");
  const threadData = {
    userIds: [author._id, receiver._id],
    createdAt: new Date()
  };
  const result = await db.collection("threads").insertOne(threadData);
  return {
    _id: result.insertedId.toString(),
    ...threadData
  } as Thread;
}

export async function deleteThread(threadId: string) {
  const db = await getDb();
  await db.collection("threads").deleteOne({ _id: new ObjectId(threadId) });
  return true;
}

export async function createMessage(
  threadId: string,
  authorUsername: string,
  content: string
) {
  const db = await getDb();
  const author = await getAuthorByUsername(authorUsername);
  if (!author) throw new Error("User not found");
  const messageData = {
    threadId,
    authorId: author._id,
    content,
    createdAt: new Date()
  };
  const result = await db.collection("messages").insertOne(messageData);
  return {
    _id: result.insertedId.toString(),
    ...messageData
  } as Message;
}

export async function deleteMessage(messageId: string) {
  const db = await getDb();
  await db.collection("messages").deleteOne({ _id: new ObjectId(messageId) });
  return true;
}
