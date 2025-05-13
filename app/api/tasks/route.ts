import { NextResponse } from "next/server";
import { getAllTasks } from "@/lib/queries";
import { createTask } from "@/lib/mutations";

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status, authorUsername, boardId } = body;
    if (!title || !status || !authorUsername || !boardId) {
      console.error("POST /api/tasks - Missing required fields", { body });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const newTask = await createTask({
      title,
      description: description || "",
      status,
      authorUsername,
      boardId
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    // Detailed error logging
    console.error("POST /api/tasks - Failed to create task", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
