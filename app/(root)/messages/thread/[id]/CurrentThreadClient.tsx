"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  encryptMessage,
  decryptMessage,
  getThreadEncryptionKey
} from "@/lib/encryption";
import { SmilePlusIcon } from "lucide-react";

interface User {
  _id: string;
  username: string;
  name?: string;
  image?: string;
}

const emojis = ["😂", "❤️", "😍", "😭", "😊", "👍", "😉", "👆"];

export default function CurrentThreadClient({
  currentUser,
  otherUser,
  threadId
}: {
  currentUser: User;
  otherUser: User | null;
  threadId: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [chatColor, setChatColor] = useState<string>("blue");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageFromOther, setNewMessageFromOther] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const chatColors = [
    { name: "Blue", value: "blue" },
    { name: "Green", value: "green" },
    { name: "Purple", value: "purple" },
    { name: "Pink", value: "pink" },
    { name: "Orange", value: "orange" }
  ];

  // Fetch encryption key on mount
  useEffect(() => {
    setEncryptionKey(null); // Reset before fetching
    getThreadEncryptionKey(threadId)
      .then((key) => {
        if (key && typeof key === "string" && key.length > 0) {
          setEncryptionKey(key);
        } else {
          setEncryptionKey(null);
        }
      })
      .catch((err) => {
        setEncryptionKey(null);
        console.error(err);
      });
  }, [threadId]);

  // Fetch both users' info for header and chat
  const [userMap, setUserMap] = useState<{ [id: string]: User }>({});
  useEffect(() => {
    async function fetchUsers() {
      const ids = [currentUser._id, otherUser?._id].filter(Boolean);
      const map: { [id: string]: User } = {};
      for (const id of ids) {
        try {
          const res = await fetch(`/api/user?q=${id}`);
          const users = await res.json();
          if (users && users[0]) map[id] = users[0];
        } catch {}
      }
      setUserMap(map);
    }
    fetchUsers();
  }, [currentUser._id, otherUser?._id]);

  // Live polling for messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchMessages = async () => {
      if (!encryptionKey) return; // Don't fetch/decrypt if key is not ready
      try {
        const res = await fetch(`/api/messages/messages?threadId=${threadId}`);
        const msgs = await res.json();
        // Decrypt all messages using encryptionKey
        const decryptedMsgs = msgs.map((msg: any) => ({
          ...msg,
          content: encryptionKey
            ? decryptMessage(msg.encryptedContent || msg.content, encryptionKey)
            : ""
        }));
        if (decryptedMsgs.length > 0) {
          const lastMsg = decryptedMsgs[decryptedMsgs.length - 1];
          if (
            lastMessageIdRef.current &&
            lastMsg._id !== lastMessageIdRef.current &&
            lastMsg.authorId === otherUser?._id
          ) {
            // Check if at bottom
            const container = chatContainerRef.current;
            const atBottom = container
              ? container.scrollHeight -
                  container.scrollTop -
                  container.clientHeight <
                40
              : true;
            if (atBottom) {
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
              setNewMessageFromOther(false);
            } else {
              setNewMessageFromOther(true);
            }
          }
          lastMessageIdRef.current = lastMsg._id;
        }
        setMessages(decryptedMsgs);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    interval = setInterval(fetchMessages, 1_000);
    return () => clearInterval(interval);
  }, [threadId, encryptionKey, otherUser?._id, showScrollButton]);

  // Always scroll to bottom when messages change (including after refresh)
  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show scroll-to-bottom button if not at bottom
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    function handleScroll() {
      if (!container) return;
      const atBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        40;
      setShowScrollButton(!atBottom);
    }
    container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

  useEffect(() => {
    if (!showScrollButton) setNewMessageFromOther(false);
  }, [showScrollButton]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageFromOther(false);
  }

  async function sendMessage() {
    if (!encryptionKey || !content) return;
    setLoading(true);
    // Encrypt message
    const encryptedContent = encryptMessage(content, encryptionKey);
    await fetch("/api/messages/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        content, // plain text for DB verification
        encryptedContent
      })
    });
    setContent("");
    // Fetch and decrypt updated messages
    const res = await fetch(`/api/messages/messages?threadId=${threadId}`);
    const msgs = await res.json();
    const decryptedMsgs = msgs.map((msg: any) => {
      if (msg.encryptedContent && typeof msg.encryptedContent === "string") {
        try {
          return {
            ...msg,
            content: decryptMessage(msg.encryptedContent, encryptionKey)
          };
        } catch (e) {
          console.error("Failed to decrypt message:", e);
          return { ...msg, content: "[Failed to decrypt]" };
        }
      }
      return { ...msg, content: "" };
    });
    setMessages(decryptedMsgs);
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
    setLoading(false);
  }

  async function sendEmoji(emoji: string) {
    setShowEmojiPicker(false);
    setLoading(true);
    if (!encryptionKey) return;
    const encryptedContent = encryptMessage(emoji, encryptionKey);
    await fetch("/api/messages/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        content: emoji,
        encryptedContent
      })
    });
    // Fetch and decrypt updated messages
    const res = await fetch(`/api/messages/messages?threadId=${threadId}`);
    const msgs = await res.json();
    const decryptedMsgs = msgs.map((msg: any) => {
      if (msg.encryptedContent && typeof msg.encryptedContent === "string") {
        try {
          return {
            ...msg,
            content: decryptMessage(msg.encryptedContent, encryptionKey)
          };
        } catch (e) {
          console.error("Failed to decrypt message:", e);
          return { ...msg, content: "[Failed to decrypt]" };
        }
      }
      return { ...msg, content: "" };
    });
    setMessages(decryptedMsgs);
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
    setLoading(false);
  }

  // Color values for inline style
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "#3b82f6", text: "#fff" },
    green: { bg: "#22c55e", text: "#fff" },
    purple: { bg: "#a21caf", text: "#fff" },
    pink: { bg: "#ec4899", text: "#fff" },
    orange: { bg: "#f59e42", text: "#fff" }
  };

  // Gradient values for inline style
  const gradientMap: Record<string, string> = {
    blue: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    green: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
    purple: "linear-gradient(135deg, #a21caf 0%, #c084fc 100%)",
    pink: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    orange: "linear-gradient(135deg, #f59e42 0%, #fbbf24 100%)"
  };

  return (
    <div className="card max-w-2xl w-full mx-auto flex flex-col h-[70vh] md:h-[80vh]">
      {/* Header */}
      <div className="card-header flex items-center gap-3 border-b px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
        {userMap[otherUser?._id || ""]?.image || otherUser?.image ? (
          <Image
            src={userMap[otherUser?._id || ""]?.image ?? otherUser?.image ?? ""}
            alt={
              userMap[otherUser?._id || ""]?.username ||
              otherUser?.username ||
              "User"
            }
            width={48}
            height={48}
            className="rounded-full border shadow"
          />
        ) : (
          <div className="rounded-full w-12 h-12 bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 border">
            {userMap[otherUser?._id || ""]?.username?.[0]?.toUpperCase() ||
              otherUser?.username?.[0]?.toUpperCase() ||
              "?"}
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            {userMap[otherUser?._id || ""]?.name ||
              otherUser?.name ||
              userMap[otherUser?._id || ""]?.username ||
              otherUser?.username ||
              "Chat"}
            {newMessageFromOther && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs animate-pulse">
                Nowa Wiadomość!
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            @{userMap[otherUser?._id || ""]?.username || otherUser?.username}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {chatColors.map((c) => (
            <button
              key={c.value}
              onClick={() => setChatColor(c.value)}
              className={`w-6 h-6 rounded-full border-2 ${chatColor === c.value ? "border-black dark:border-white" : "border-transparent"}`}
              style={{ background: c.value }}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 min-h-0 flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 px-3 py-2 relative"
      >
        <ul className="flex flex-col gap-4">
          {messages.map((msg) => {
            const isMe = msg.authorId === currentUser._id;
            const user =
              userMap[msg.authorId] || (isMe ? currentUser : otherUser);
            return (
              <li
                key={msg._id}
                className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}
              >
                {user?.image ? (
                  <Image
                    src={user.image ?? ""}
                    alt={user.username}
                    width={32}
                    height={32}
                    className="rounded-full border shadow"
                  />
                ) : (
                  <div className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center text-base font-bold text-gray-500 border">
                    {user?.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div
                  className={`chat-bubble ${isMe ? "chat-bubble-me" : "chat-bubble-other bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"} px-4 py-2 rounded-2xl shadow max-w-xs`}
                  style={
                    isMe
                      ? {
                          background: gradientMap[chatColor],
                          color: colorMap[chatColor].text
                        }
                      : undefined
                  }
                >
                  <div className="font-medium text-xs mb-1 opacity-70">
                    {isMe
                      ? "You"
                      : user?.name || user?.username || msg.authorId}
                  </div>
                  <div className="text-sm break-words">{msg.content}</div>
                  <div
                    className={`chat-bubble-meta text-[10px] mt-1 text-right opacity-60 ${isMe ? "" : "chat-bubble-meta-other"}`}
                  >
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={messagesEndRef} />
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 z-20 rounded-full shadow-lg p-3 transition"
            aria-label="Scroll to newest message"
            style={{
              background: colorMap[chatColor].bg,
              color: colorMap[chatColor].text,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-area flex items-center gap-2 border-t px-4 py-3 bg-white dark:bg-gray-800 relative">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={
            encryptionKey ? "Napisz wiadomość" : "Ładowanie klucza..."
          }
          className="chat-input flex-1 px-4 py-2 rounded-full border bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={!encryptionKey}
          id="chat-message-input"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="emoji-btn px-2 py-2 rounded-full text-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            tabIndex={0}
          >
            <SmilePlusIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          {showEmojiPicker && (
            <div
              className="absolute bottom-12 right-0 z-50 bg-white dark:bg-gray-800 border rounded-xl shadow-lg p-2 flex flex-wrap gap-1 w-[12.5rem]"
              style={{ maxHeight: 200, overflowY: "auto" }}
            >
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="text-2xl p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  onClick={() => sendEmoji(emoji)}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={sendMessage}
          disabled={loading || !content || !encryptionKey}
          className="chat-send-btn px-5 py-2 rounded-full font-semibold shadow transition disabled:opacity-50"
          style={{
            background: colorMap[chatColor].bg,
            color: colorMap[chatColor].text
          }}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}
