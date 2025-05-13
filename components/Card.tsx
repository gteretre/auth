import React, { useState } from "react";

interface CardProps {
  id: string;
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  onEdit?: (
    id: string,
    updates: { title: string; description: string }
  ) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  status,
  onEdit,
  onDelete
}) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title || "");
  const [editDescription, setEditDescription] = useState(description || "");
  const [loading, setLoading] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "todo":
        return "bg-secondary";
      case "in-progress":
        return "bg-amber-100 dark:bg-amber-900/30";
      case "done":
        return "bg-green-100 dark:bg-green-900/30";
      default:
        return "bg-secondary";
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (onEdit) {
      await onEdit(id, { title: editTitle, description: editDescription });
    }
    setLoading(false);
    setEditing(false);
  };

  return (
    <div className={`shadow-xl ring-ring ring-1 p-4 m-2 ${getStatusColor()}`}>
      {editing ? (
        <form onSubmit={handleEdit} className="space-y-2">
          <input
            className="w-full border rounded px-2 py-1"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            className="w-full border rounded px-2 py-1"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={loading}
            >
              Save
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {title && <h3 className="font-bold mb-1">{title}</h3>}
          {description && <p className="text-sm">{description}</p>}
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            {onDelete && (
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => onDelete(id)}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Card;
