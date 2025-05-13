import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { Task } from "../components/Board";

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
    // Try to find by 'id' (OAuth provider ID)
    let author = await db.collection("authors").findOne({ id });
    // If not found, try by MongoDB _id
    if (!author && ObjectId.isValid(id)) {
      author = await db
        .collection("authors")
        .findOne({ _id: new ObjectId(id) });
    }
    // Use mapAuthor to ensure correct type
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
    // Use mapAuthor to ensure correct type
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
    // Use mapAuthor to ensure correct type
    return author ? mapAuthor(author as RawAuthor) : null;
  } catch (error) {
    console.error("Error in getAuthorByUsername:", error);
    throw new Error(
      `Error in getAuthorByUsername: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Board type for Kanban tables
export interface BoardDoc {
  _id: string;
  title: string;
  authorUsername: string;
  createdAt: Date;
}

export async function getBoardsByUser(
  authorUsername: string
): Promise<BoardDoc[]> {
  const db = await getDb();
  const boards = await db
    .collection("boards")
    .find({ authorUsername })
    .sort({ createdAt: -1 })
    .toArray();
  return boards.map((b) => ({
    _id: b._id.toString(),
    title: b.title || "Untitled Board",
    authorUsername: b.authorUsername,
    createdAt: b.createdAt || new Date()
  }));
}

// Task-related queries
export async function getAllTasks(): Promise<Task[]> {
  const db = await getDb();
  try {
    const tasks = await db.collection("tasks").find().toArray();

    return tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      authorId: task.authorId || ""
    }));
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    throw new Error(
      `Error in getAllTasks: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getTasksByAuthor(
  authorUsername: string
): Promise<Task[]> {
  const db = await getDb();
  try {
    const tasks = await db
      .collection("tasks")
      .find({ authorUsername })
      .toArray();

    return tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      authorUsername: task.authorUsername
    }));
  } catch (error) {
    console.error("Error in getTasksByAuthor:", error);
    throw new Error(
      `Error in getTasksByAuthor: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getTasksByBoard(
  boardId: string,
  authorUsername: string
): Promise<Task[]> {
  const db = await getDb();
  try {
    const tasks = await db
      .collection("tasks")
      .find({ boardId, authorUsername })
      .toArray();
    return tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      authorUsername: task.authorUsername,
      boardId: task.boardId
    }));
  } catch (error) {
    console.error("Error in getTasksByBoard:", error);
    throw new Error(
      `Error in getTasksByBoard: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export interface Card {
  _id: string;
  boardId: string;
  authorUsername: string;
  title: string;
  content: string;
  position: number;
  status: "todo" | "in-progress" | "done";
  createdAt: Date;
}

export async function getCardsByBoard(
  boardId: string,
  authorUsername: string
): Promise<Card[]> {
  const db = await getDb();
  try {
    const cards = await db
      .collection("cards")
      .find({ boardId, authorUsername })
      .sort({ position: 1 })
      .toArray();
    return cards.map((card) => ({
      _id: card._id.toString(),
      boardId: card.boardId,
      authorUsername: card.authorUsername,
      title: card.title,
      content: card.content,
      position: card.position,
      status: card.status,
      createdAt: card.createdAt || new Date()
    }));
  } catch (error) {
    console.error("Error in getCardsByBoard:", error);
    throw new Error(
      `Error in getCardsByBoard: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
