import { Chat, Message } from "../@types/chat";
import GroupController from "../controllers/GroupController";
import { User } from "../interfaces/User";
import {
  decryptGroupMessage,
  decryptMessage,
  decryptSessionKey,
} from "./crypto";

export const decriptMessages = (messages: Message[], user: User) => {
  return messages.map((message) => {
    const msg =
      user!.id === message.recipient_id
        ? decryptMessage(message.encrypted_message, user!.encryptedPrivateKey)
        : decryptMessage(
            message.sender_encrypted_message,
            user!.encryptedPrivateKey,
          );

    return { ...message, encrypted_message: msg };
  });
};

export const decriptGroupMessages = (
  messages: Message[],
  decryptedSession: string,
) => {
  return messages.map((message) => {
    const msg = decryptGroupMessage(
      message.encrypted_message,
      decryptedSession,
    );
    return { ...message, encrypted_message: msg };
  });
};

export const decriptChat = async (
  chat: Chat,
  user: User,
  onlineClients: number[],
) => {
  if (chat.is_group) {
    const encryptedSession = await GroupController.getSessionKey({
      group_id: chat.recipient_id,
    });
    const decryptedSession = decryptSessionKey(
      encryptedSession,
      user!.encryptedPrivateKey,
    );

    return {
      ...chat,
      messages: decriptGroupMessages(chat.messages, decryptedSession),
    };
  }
  return {
    ...chat,
    status: onlineClients.some((id) => chat.recipient_id === id)
      ? "online"
      : "offline",
    messages: decriptMessages(chat.messages, user!),
  };
};
