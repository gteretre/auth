import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/mutations";

export async function PATCH(
  request: Request,
  { params: routeParams }: { params: { id?: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(routeParams);

    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ error: "Missing task id" }, { status: 400 });
    }
    const updates = await request.json();
    await updateTask(resolvedParams.id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params: routeParams }: { params: { id?: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(routeParams);

    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json({ error: "Missing task id" }, { status: 400 });
    }
    await deleteTask(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
