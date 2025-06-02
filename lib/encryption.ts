import CryptoJS from 'crypto-js';

export const generateEncryptionKey = (): string => {
    return CryptoJS.lib.WordArray.random(32).toString();
};

export const getThreadEncryptionKey = async (threadId: string): Promise<string> => {
    try {
        const response = await fetch(`/api/messages/thread/${threadId}`);
        const thread = await response.json();

        if (!thread?.encryptionKey) {
            throw new Error('No encryption key found');
        }

        return thread.encryptionKey;
    } catch (error) {
        console.error('Failed to get encryption key:', error);
        throw error;
    }
};


export const encryptMessage = (message: string, thread: Thread): string => {
    if (!thread.encryptionKey) {
        throw new Error('Thread encryption key is not set');
    }
    return CryptoJS.AES.encrypt(message, thread.encryptionKey).toString();
};

export const decryptMessage = (encryptedMessage: string, thread: Thread): string => {
    if (!thread.encryptionKey) {
        throw new Error('Thread encryption key is not set');
    }
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, thread.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
