export interface Author {
  _id: string;
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: Date;
  provider: string;
  image?: string;
  bio?: string;
  role?: string;
}

export interface Task {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  authorUsername: string;
  boardId: string;
  id?: string; // Optional, for client-side usage
}
