import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { Thread, Message } from "./models";

type RawAuthor = {
  _id: string | ObjectId;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  createdAt?: Date | string;
  image?: string;
  bio?: string;
  role?: string;
  provider: string;
};

function mapAuthor(raw: RawAuthor): import("./models").Author {
  return {
    _id: raw._id?.toString() || "",
    id: raw.id || "",
    name: raw.name || "",
    username: raw.username || "",
    email: raw.email || "",
    createdAt:
      raw.createdAt instanceof Date
        ? raw.createdAt
        : new Date(raw.createdAt ?? Date.now()),
    image: raw.image || "",
    bio: raw.bio || "",
    role: raw.role || "",
    provider: raw.provider
  };
}

export async function getAuthorById(
  id: string
): Promise<import("./models").Author | null> {
  const db = await getDb();
  try {
    let author = await db.collection("authors").findOne({ id });
    if (!author && ObjectId.isValid(id)) {
      author = await db
        .collection("authors")
        .findOne({ _id: new ObjectId(id) });
    }
    return author ? mapAuthor(author as RawAuthor) : null;
  } catch (error) {
    console.error("Error in getAuthorById:", error);
    throw new Error(
      `Error in getAuthorById: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getAuthorByEmail(
  email: string
): Promise<import("./models").Author | null> {
  const db = await getDb();
  try {
    const author = await db.collection("authors").findOne({ email });
    return author ? mapAuthor(author as RawAuthor) : null;
  } catch (error) {
    console.error("Error in getAuthorByEmail:", error);
    throw new Error(
      `Error in getAuthorByEmail: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getAuthorByUsername(
  username: string
): Promise<import("./models").Author | null> {
  const db = await getDb();
  try {
    const author = await db.collection("authors").findOne({ username });
    return author ? mapAuthor(author as RawAuthor) : null;
  } catch (error) {
    console.error("Error in getAuthorByUsername:", error);
    throw new Error(
      `Error in getAuthorByUsername: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getThreadsForUser(username: string): Promise<Thread[]> {
  const db = await getDb();
  const author = await getAuthorByUsername(username);
  if (!author) return [];
  const threads = await db
    .collection("threads")
    .find({ userIds: author._id })
    .sort({ createdAt: -1 })
    .toArray();
  return threads.map((t: any) => ({
    _id: t._id.toString(),
    userIds: t.userIds,
    createdAt:
      t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt),
    lastMessage: t.lastMessage || "",
    encryptionKey: t.encryptionKey || undefined
  }));
}

export async function getMessagesForThread(
  threadId: string
): Promise<Message[]> {
  const db = await getDb();
  const messages = await db
    .collection("messages")
    .find({ threadId })
    .sort({ createdAt: 1 })
    .toArray();
  return messages.map((m: any) => ({
    _id: m._id.toString(),
    threadId: m.threadId,
    authorId: m.authorId,
    encryptedContent: m.encryptedContent,
    createdAt: m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt)
  }));
}

export async function getThreadById(threadId: string): Promise<Thread | null> {
  const db = await getDb();
  try {
    const t = await db
      .collection("threads")
      .findOne({ _id: new ObjectId(threadId) });
    if (!t) return null;
    return {
      _id: t._id.toString(),
      userIds: t.userIds,
      createdAt:
        t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt),
      lastMessage: t.lastMessage || "",
      encryptionKey: t.encryptionKey || undefined
    };
  } catch (error) {
    console.error("Error in getThreadById:", error);
    return null;
  }
}
