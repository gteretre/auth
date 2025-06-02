"use client";
import { useEffect, useState, useRef } from "react";
import { generateEncryptionKey } from "@/lib/encryption";
import Image from "next/image";

interface User {
  _id: string;
  username: string;
  name?: string;
  image?: string;
}

interface Thread {
  _id: string;
  userIds: [string, string];
  createdAt: string;
  lastMessage?: string;
  users?: User[]; // Both users
  otherUser?: User;
  encryptionKey?: string;
}

export default function ThreadsClient({ username }: { username: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [receiver, setReceiver] = useState("");
  const [receiverUser, setReceiverUser] = useState<User | null>(null);
  const [userResults, setUserResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  async function fetchThreads() {
    setLoadingThreads(true);
    const res = await fetch("/api/messages/threads");
    const data = await res.json();
    let currentUserId: string | undefined;
    for (const thread of data) {
      for (const id of thread.userIds) {
        const userRes = await fetch(`/api/user?id=${id}`);
        const userArr = await userRes.json();
        if (userArr && userArr[0] && userArr[0].username === username) {
          currentUserId = id;
          break;
        }
      }
      if (currentUserId) break;
    }
    // Fallback: if not found, just use the first id
    if (!currentUserId && data[0]) currentUserId = data[0].userIds[0];
    // Fetch other user for each thread
    const threadsWithUsers = await Promise.all(
      data.map(async (thread: Thread) => {
        const otherUserId = thread.userIds.find((id) => id !== currentUserId);
        let otherUser: User | undefined = undefined;
        if (otherUserId) {
          const otherRes = await fetch(`/api/user?id=${otherUserId}`);
          const otherArr = await otherRes.json();
          if (otherArr && otherArr[0]) {
            otherUser = { _id: otherUserId, ...otherArr[0] };
          } else {
            otherUser = { _id: otherUserId, username: otherUserId };
          }
        }
        return { ...thread, otherUser };
      })
    );
    setThreads(threadsWithUsers);
    setLoadingThreads(false);
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
    const encryptionKey = generateEncryptionKey();
    const response = await fetch("/api/messages/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverUsername: receiver,
        encryptionKey: encryptionKey
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create thread");
    }

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
      {/* New Chat Modal/Section */}
      <div className="relative mb-4 w-full max-w-md mx-auto">
        <div className="flex gap-2 items-center mb-2">
          <input
            value={receiverUser ? receiverUser.username : receiver}
            onChange={(e) => {
              setReceiver(e.target.value);
              setReceiverUser(null);
            }}
            placeholder="Napisz imię lub nazwę użytkownika..."
            className="chat-input flex-1 px-4 py-2 rounded-full border bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onFocus={() => receiver && setShowDropdown(true)}
          />
          <button
            onClick={createThread}
            disabled={loading || !receiverUser}
            className="chat-send-btn px-4 py-2 rounded-full font-semibold shadow transition disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600"
          >
            Nowy Chat
          </button>
        </div>
        {showDropdown && userResults.length > 0 && (
          <ul className="user-dropdown absolute left-0 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg mt-1 z-10">
            {userResults.map((user) => (
              <li
                key={user.username}
                className="user-dropdown-item flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.username}
                    width={32}
                    height={32}
                    className="user-dropdown-avatar rounded-full border"
                  />
                ) : (
                  <div className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center text-base font-bold text-gray-500 border">
                    {user.username[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="user-dropdown-info flex flex-col">
                  <div className="user-dropdown-title font-semibold text-sm">
                    {user.name || user.username}
                  </div>
                  <div className="user-dropdown-subtitle text-xs text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Thread List with fixed height */}
      <div className="thread-list overflow-y-auto max-h-[420px] min-h-[320px] border rounded-lg bg-white dark:bg-gray-900 shadow p-2">
        {loadingThreads ? (
          <div className="text-center text-gray-400 py-16 text-lg">
            Loading...
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-lg">
            Brak rozmów. Zacznij nową rozmowę!
          </div>
        ) : (
          <ul className="p-0 list-none m-0 flex flex-col gap-2">
            {threads.map((thread: Thread) => {
              const other = thread.otherUser;
              return (
                <li
                  key={thread._id}
                  className={`thread-list-item flex items-center gap-3 px-4 py-3 rounded-lg border bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition cursor-pointer${
                    selectedThread === thread._id
                      ? " selected border-blue-500"
                      : " border-transparent"
                  }`}
                  onClick={() => setSelectedThread(thread._id)}
                >
                  {other?.image ? (
                    <Image
                      src={other.image}
                      alt={other.username}
                      width={40}
                      height={40}
                      className="thread-list-avatar rounded-full border"
                    />
                  ) : (
                    <div className="rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500 border">
                      {other?.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="thread-list-info flex-1 flex flex-col">
                    <a
                      href={`/messages/thread/${thread._id}`}
                      className="thread-list-title font-semibold text-base text-gray-900 dark:text-white hover:underline"
                    >
                      {other?.name || other?.username || "Unknown"}
                    </a>
                    <div className="thread-list-subtitle text-xs text-gray-500 dark:text-gray-400">
                      @{other?.username}
                    </div>
                    <div className="thread-list-date text-xs text-gray-400 mt-1">
                      Created:{" "}
                      {thread.createdAt
                        ? new Date(thread.createdAt).toLocaleString()
                        : "-"}
                    </div>
                    {thread.lastMessage && (
                      <div className="thread-list-last-message text-xs text-gray-700 dark:text-gray-300 mt-1 truncate">
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
                    className="thread-delete-btn ml-2 px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-xs hover:bg-red-200 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
