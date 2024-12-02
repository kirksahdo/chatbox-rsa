import {
  Chat,
  GetMessagesByUserId,
  Message,
  MessageRegister,
  MessagesUpdate,
} from "../@types/chat";
import api from "../services/api";

export default abstract class ChatController {
  static async get(): Promise<Chat[]> {
    const token = localStorage.getItem("token");
    const result = await api.get<Chat[]>("/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  static async getMessages(payload: GetMessagesByUserId): Promise<Message[]> {
    const token = localStorage.getItem("token");
    const result = await api.get<Message[]>(`/messages/${payload.user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  static async sendMessage(payload: MessageRegister) {
    const token = localStorage.getItem("token");
    await api.post("/messages", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async getConnectedClients() {
    const token = localStorage.getItem("token");
    const result = await api.get<number[]>("/connected_clients/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }

  static async updateChatMessagesStatus(payload: MessagesUpdate) {
    const token = localStorage.getItem("token");
    await api.post(
      `/messages/status/${payload.user_id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  static async updateMessagesStatus() {
    const token = localStorage.getItem("token");
    await api.post(
      "/messages/status",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }
}
