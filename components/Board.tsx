"use client";
import React, { useState, useEffect } from "react";
import Card from "./Card";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  authorUsername?: string;
  boardId: string;
}

interface BoardProps {
  tasks?: Task[];
  onTaskMove?: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => Promise<void>;
  onTaskEdit?: (
    id: string,
    updates: { title: string; description: string }
  ) => Promise<void>;
  onTaskDelete?: (id: string) => Promise<void>;
}

const Board: React.FC<BoardProps> = ({
  tasks = [],
  onTaskMove,
  onTaskEdit,
  onTaskDelete
}) => {
  const [columns, setColumns] = useState({
    todo: [] as Task[],
    "in-progress": [] as Task[],
    done: [] as Task[]
  });

  useEffect(() => {
    // Organize tasks into columns based on status
    const newColumns = {
      todo: tasks.filter((task) => task.status === "todo"),
      "in-progress": tasks.filter((task) => task.status === "in-progress"),
      done: tasks.filter((task) => task.status === "done")
    };
    setColumns(newColumns);
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent,
    status: "todo" | "in-progress" | "done"
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    if (onTaskMove) {
      await onTaskMove(taskId, status);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full p-4">
      {/* To Do Column */}
      <div
        className="flex-1 bg-background/50 p-4 rounded-lg border-2 border-primary/20"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "todo")}
      >
        <h2 className="text-xl font-bold mb-4 text-primary">To Do</h2>
        <div className="space-y-2">
          {columns.todo.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <Card
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            </div>
          ))}
        </div>
      </div>
      {/* In Progress Column */}
      <div
        className="flex-1 bg-background/50 p-4 rounded-lg border-2 border-primary/20"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "in-progress")}
      >
        <h2 className="text-xl font-bold mb-4 text-amber-500">In Progress</h2>
        <div className="space-y-2">
          {columns["in-progress"].map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <Card
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Done Column */}
      <div
        className="flex-1 bg-background/50 p-4 rounded-lg border-2 border-primary/20"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "done")}
      >
        <h2 className="text-xl font-bold mb-4 text-green-500">Done</h2>
        <div className="space-y-2">
          {columns.done.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
            >
              <Card
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
