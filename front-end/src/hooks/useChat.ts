import { useState, useEffect } from "react";
import { encryptMessage, decryptMessage, generateKeyPair } from "../utils/rsa";
import {
  registerUserAPI,
  sendMessageAPI,
  fetchMessagesAPI,
} from "../services/api";
import { getRecipientPublicKey } from "../services/api";
import { Message } from "../interfaces/Messages";

export const useChat = (loggedInUser: string) => {
  const [privateKey, setPrivateKey] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

  const registerUser = async (username: string) => {
    const { publicKey, privateKey } = generateKeyPair();
    setPrivateKey(privateKey);
    await registerUserAPI(username, publicKey);
  };

  const sendMessage = async (payload: {
    recipient: string;
    message: string;
  }) => {
    const { publicKey: recipientPublicKey } = await getRecipientPublicKey(
      payload.recipient,
    );
    const encryptedMessage = encryptMessage(
      payload.message,
      recipientPublicKey,
    );
    await sendMessageAPI(
      loggedInUser,
      payload.recipient,
      encryptedMessage as string,
    );
  };

  const fetchMessages = async () => {
    const messages = await fetchMessagesAPI(loggedInUser);
    const decryptedMessages = messages.map((msg) => ({
      sender: msg.sender,
      content: decryptMessage(msg.content, privateKey) as string,
      timestamp: msg.timestamp,
    }));
    setReceivedMessages(decryptedMessages);
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchMessages();
    }
  }, [loggedInUser]);

  return {
    registerUser,
    sendMessage,
    receivedMessages,
  };
};
