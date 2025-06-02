import CryptoJS from "crypto-js";

export const generateEncryptionKey = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const getThreadEncryptionKey = async (
  threadId: string
): Promise<string> => {
  try {
    const response = await fetch(`/api/messages/thread/${threadId}`);
    const thread = await response.json();

    if (!thread?.encryptionKey) {
      throw new Error("No encryption key found");
    }

    return thread.encryptionKey;
  } catch (error) {
    console.error("Failed to get encryption key:", error);
    throw error;
  }
};

export const encryptMessage = (
  message: string,
  encryptionKey: string
): string => {
  if (!encryptionKey) {
    throw new Error("Encryption key is not set");
  }
  return CryptoJS.AES.encrypt(message, encryptionKey).toString();
};

export const decryptMessage = (
  encryptedMessage: string,
  encryptionKey: string
): string => {
  if (!encryptionKey) {
    throw new Error("Encryption key is not set");
  }
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
