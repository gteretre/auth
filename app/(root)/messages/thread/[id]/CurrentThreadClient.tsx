"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { encryptMessage, decryptMessage, getThreadEncryptionKey } from '@/lib/encryption';

interface User {
  _id: string;
  username: string;
  name?: string;
  image?: string;
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch encryption key on mount
  useEffect(() => {
    getThreadEncryptionKey(threadId)
        .then(setEncryptionKey)
        .catch(console.error);
  }, [threadId]);


  // Live polling for messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/messages?threadId=${threadId}`);
        const msgs = await res.json();
        // Decrypt all messages
        const decryptedMsgs = msgs.map((msg: any) => ({
          ...msg,
          content: decryptMessage(msg.content, { encryptionKey })
        }));
        setMessages(decryptedMsgs);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    interval = setInterval(fetchMessages, 10_000);
    return () => clearInterval(interval);
  }, [threadId]);

  // Scroll to bottom only on initial load or when sending a message
  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line
  }, []); // Only on mount

  async function sendMessage() {
    setLoading(true);
    //encrypt message
    const encryptedContent = encryptMessage(content, encryptionKey);
    await fetch("/api/messages/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        encryptedContent
      })
    });
    setContent("");
    // Fetch and decrypt updated messages
    const res = await fetch(`/api/messages/messages?threadId=${threadId}`);
    const msgs = await res.json();
    const decryptedMsgs = msgs.map((msg: any) => ({
      ...msg,
      content: decryptMessage(msg.encryptedContent, { encryptionKey })  // Changed from content to encryptedContent
    }));
    setMessages(decryptedMsgs);
    setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
    setLoading(false);
  }

  return (
    <div className="card max-w-2xl w-full mx-auto flex flex-col h-[70vh] md:h-[80vh]">
      {/* Header */}
      <div className="card-header">
        {otherUser?.image && (
          <Image
            src={otherUser.image}
            alt={otherUser.username}
            width={48}
            height={48}
            className="card-header-avatar"
          />
        )}
        <div className="card-header-info">
          <div className="card-header-title">
            {otherUser?.name || otherUser?.username || "Chat"}
          </div>
          <div className="card-header-subtitle">@{otherUser?.username}</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900 px-3 py-2">
        <ul className="flex flex-col gap-3">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className={`flex ${msg.authorId === currentUser._id ? "flex-row-reverse" : "flex-row"} items-end`}
            >
              <div
                className={`chat-bubble ${
                  msg.authorId === currentUser._id
                    ? "chat-bubble-me"
                    : "chat-bubble-other"
                }`}
              >
                <div className="font-medium text-xs mb-1">
                  {msg.authorId === currentUser._id
                    ? "You"
                    : otherUser?.name || msg.authorId}
                </div>
                <div className="text-sm">{msg.content}</div>
                <div
                  className={`chat-bubble-meta ${
                    msg.authorId === currentUser._id
                      ? ""
                      : "chat-bubble-meta-other"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message"
          className="chat-input"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !content}
          className="chat-send-btn"
        >
          Send
        </button>
      </div>
    </div>
  );
}
