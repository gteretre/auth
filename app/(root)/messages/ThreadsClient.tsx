"use client";
import { useEffect, useState, useRef } from "react";

interface User {
  username: string;
  name?: string;
  image?: string;
}

interface Thread {
  _id: string;
  userIds: [string, string];
  createdAt: string;
  lastMessage?: string;
  otherUser?: User;
}

export default function ThreadsClient({ username }: { username: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [receiver, setReceiver] = useState("");
  const [receiverUser, setReceiverUser] = useState<User | null>(null);
  const [userResults, setUserResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  async function fetchThreads() {
    const res = await fetch("/api/messages/threads");
    const data = await res.json();
    // Fetch user info for each thread (other than current user)
    const users = await Promise.all(
      data.map(async (thread: Thread) => {
        const otherId = thread.userIds.find((id) => id !== username);
        if (!otherId) return { ...thread, otherUser: null };
        const userRes = await fetch(`/api/user?q=${otherId}`);
        const users = await userRes.json();
        return { ...thread, otherUser: users[0] || { username: otherId } };
      })
    );
    setThreads(users);
  }

  // Live user search
  useEffect(() => {
    if (!receiver) {
      setUserResults([]);
      setShowDropdown(false);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      const res = await fetch(`/api/user?q=${receiver}`);
      const users = await res.json();
      setUserResults(users);
      setShowDropdown(true);
    }, 200);
  }, [receiver]);

  function handleSelectUser(user: User) {
    setReceiver(user.username);
    setReceiverUser(user);
    setShowDropdown(false);
  }

  async function createThread() {
    setLoading(true);
    await fetch("/api/messages/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverUsername: receiver })
    });
    setReceiver("");
    setReceiverUser(null);
    fetchThreads();
    setLoading(false);
  }

  async function deleteThread(id: string) {
    setLoading(true);
    await fetch(`/api/messages/thread/${id}`, { method: "DELETE" });
    fetchThreads();
    setLoading(false);
  }

  return (
    <div className="centered-section w-full h-full">
      <h2 className="text-center my-6 text-2xl font-semibold">Messages</h2>
      <div className="relative mb-4 w-full max-w-md mx-auto">
        <input
          value={receiverUser ? receiverUser.username : receiver}
          onChange={(e) => {
            setReceiver(e.target.value);
            setReceiverUser(null);
          }}
          placeholder="Type username or name..."
          className="chat-input"
          onFocus={() => receiver && setShowDropdown(true)}
        />
        {showDropdown && userResults.length > 0 && (
          <ul className="user-dropdown">
            {userResults.map((user) => (
              <li
                key={user.username}
                className="user-dropdown-item"
                onClick={() => handleSelectUser(user)}
              >
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="user-dropdown-avatar"
                  />
                )}
                <div className="user-dropdown-info">
                  <div className="user-dropdown-title">
                    {user.name || user.username}
                  </div>
                  <div className="user-dropdown-subtitle">@{user.username}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={createThread}
        disabled={loading || !receiverUser}
        className="w-full chat-send-btn mb-6"
      >
        Start Chat
      </button>
      <div className="thread-list">
        <ul className="p-0 list-none m-0">
          {threads.map((thread: any) => (
            <li
              key={thread._id}
              className={`thread-list-item${selectedThread === thread._id ? " selected" : ""}`}
              onClick={() => setSelectedThread(thread._id)}
            >
              {thread.otherUser?.image && (
                <img
                  src={thread.otherUser.image}
                  alt={thread.otherUser.username}
                  className="thread-list-avatar"
                />
              )}
              <div className="thread-list-info">
                <a
                  href={`/messages/thread/${thread._id}`}
                  className="thread-list-title"
                >
                  {thread.otherUser?.name ||
                    thread.otherUser?.username ||
                    "Unknown"}
                </a>
                <div className="thread-list-subtitle">
                  @{thread.otherUser?.username}
                </div>
                {thread.lastMessage && (
                  <div className="thread-list-last-message">
                    {thread.lastMessage}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread._id);
                }}
                disabled={loading}
                className="thread-delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
