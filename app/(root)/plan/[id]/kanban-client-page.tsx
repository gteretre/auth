"use client";
import React, { useEffect, useState, useTransition } from "react";
import Board, { Task } from "@/components/Board";

interface KanbanClientPageProps {
  initialTasks: Task[];
  authorUsername: string;
  boardId: string;
}

const KanbanClientPage: React.FC<KanbanClientPageProps> = ({
  initialTasks,
  authorUsername,
  boardId
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Utility to check for valid MongoDB ObjectId
  const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

  const handleCreateTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Nowe zadanie",
          description: "Kliknij Edit, aby zmienić opis zadania",
          status: "todo",
          boardId,
          authorUsername
        })
      });
      if (!res.ok) throw new Error("Failed to create task");
      const createdTask = await res.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch {
      setError("Nie udało się utworzyć zadania. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  // Update task status via API
  const handleTaskMove = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    if (!isValidObjectId(taskId)) return;
    const originalTasks = tasks;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) throw new Error("Failed to update task status");
      } catch (err) {
        setTasks(originalTasks);
        setError(
          "Nie udało się zaktualizować statusu zadania. Spróbuj ponownie."
        );
      }
    });
  };

  // Cancel new task creation (remove temp task)
  const handleCancelNewTask = (tempId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== tempId));
  };

  // Edit a task via API
  const handleEditTask = async (
    id: string,
    updates: { title: string; description: string }
  ) => {
    if (!isValidObjectId(id)) return;
    const originalTasks = tasks;
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error("Failed to update task");
      } catch (err) {
        setTasks(originalTasks);
        setError("Nie udało się zaktualizować zadania. Spróbuj ponownie.");
      }
    });
  };

  // Delete a task via API
  const handleDeleteTask = async (taskId: string) => {
    if (!isValidObjectId(taskId)) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      return;
    }
    const originalTasks = tasks;
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Failed to delete task");
      } catch (err) {
        setTasks(originalTasks);
        setError("Nie udało się usunąć zadania. Spróbuj ponownie.");
      }
    });
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Moja tablica Kanban</h1>
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      <button
        onClick={handleCreateTask}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={isPending || loading}
      >
        {isPending || loading ? "Przetwarzanie..." : "Dodaj nowe zadanie"}
      </button>
      <Board
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        onCancelNewTask={handleCancelNewTask}
      />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Lista zadań</h2>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>
              {task.title} ({task.status})
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanClientPage;
