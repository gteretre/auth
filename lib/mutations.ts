import { getDb } from "./mongodb";
import { Author } from "./models";
import { ObjectId } from "mongodb";
import { Task } from "../components/Board";

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

// Kanban Task Mutations
// Update the Task type used here if necessary, or ensure authorId is always provided.
// For this change, we'll modify the function signature to make authorId explicit if not part of Task.
export async function createTask(
  task: Omit<Task, "id"> & { authorUsername: string }
) {
  const db = await getDb();
  const taskData = {
    ...task,
    createdAt: new Date()
  };
  const result = await db.collection("tasks").insertOne(taskData);
  return {
    id: result.insertedId.toString(),
    ...taskData,
    authorUsername: taskData.authorUsername,
    boardId: taskData.boardId
  };
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id">>
) {
  const db = await getDb();
  let taskId;

  try {
    taskId = new ObjectId(id);
  } catch (error) {
    console.error("Invalid task ID format", error);
    throw new Error("Invalid task ID format");
  }

  const result = await db
    .collection("tasks")
    .updateOne({ _id: taskId }, { $set: updates });

  if (result.matchedCount === 0) {
    throw new Error("Task not found");
  }

  return true;
}

export async function updateTaskStatus(
  id: string,
  status: "todo" | "in-progress" | "done"
) {
  return updateTask(id, { status });
}

export async function deleteTask(id: string) {
  const db = await getDb();
  let taskId;

  try {
    taskId = new ObjectId(id);
  } catch (error) {
    console.error("Invalid task ID format", error);
    throw new Error("Invalid task ID format");
  }

  const result = await db.collection("tasks").deleteOne({ _id: taskId });

  if (result.deletedCount === 0) {
    throw new Error("Task not found");
  }

  return true;
}

// Board (Kanban table) creation
export async function createBoard({
  title,
  authorUsername
}: {
  title: string;
  authorUsername: string;
}) {
  const db = await getDb();
  const boardData = {
    title: title || "Untitled Board",
    authorUsername,
    createdAt: new Date()
  };
  const result = await db.collection("boards").insertOne(boardData);
  const boardId = result.insertedId.toString();

  const demoTasks = [
    {
      title: "Przykładowe zadanie 1",
      description: "To jest Twoje pierwsze przykładowe zadanie.",
      status: "todo",
      authorUsername,
      boardId
    },
    {
      title: "Przykładowe zadanie 2",
      description: "Spróbuj przeciągnąć to zadanie do sekcji W trakcie!",
      status: "in-progress",
      authorUsername,
      boardId
    },
    {
      title: "Przykładowe zadanie 3",
      description: "Oto ukończone zadanie.",
      status: "done",
      authorUsername,
      boardId
    }
  ];
  await db.collection("tasks").insertMany(demoTasks);

  return {
    _id: boardId,
    ...boardData
  };
}

export async function createCard({
  boardId,
  authorUsername,
  title,
  content,
  position,
  status
}: {
  boardId: string;
  authorUsername: string;
  title: string;
  content: string;
  position: number;
  status: "todo" | "in-progress" | "done";
}) {
  const db = await getDb();
  const cardData = {
    boardId,
    authorUsername,
    title,
    content,
    position,
    status,
    createdAt: new Date()
  };
  const result = await db.collection("cards").insertOne(cardData);
  return {
    _id: result.insertedId.toString(),
    ...cardData
  };
}

export async function updateCard(
  id: string,
  updates: Partial<
    Omit<Card, "_id" | "boardId" | "authorUsername" | "createdAt">
  >
) {
  const db = await getDb();
  let cardId;
  try {
    cardId = new ObjectId(id);
  } catch (error) {
    throw new Error("Invalid card ID format");
  }
  const result = await db
    .collection("cards")
    .updateOne({ _id: cardId }, { $set: updates });
  if (result.matchedCount === 0) {
    throw new Error("Card not found");
  }
  return true;
}

export async function deleteCard(id: string) {
  const db = await getDb();
  let cardId;
  try {
    cardId = new ObjectId(id);
  } catch (error) {
    throw new Error("Invalid card ID format");
  }
  const result = await db.collection("cards").deleteOne({ _id: cardId });
  if (result.deletedCount === 0) {
    throw new Error("Card not found");
  }
  return true;
}
