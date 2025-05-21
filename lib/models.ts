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

export interface Thread {
  _id: string;
  userIds: [string, string];
  createdAt: Date;
  lastMessage?: string;
}

export interface Message {
  _id: string;
  threadId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}
