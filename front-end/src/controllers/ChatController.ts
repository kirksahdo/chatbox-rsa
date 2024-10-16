import { Chat, MessageRegister } from "../@types/chat";
import api from "../services/api";

export default abstract class ChatController {
  static async get(): Promise<Chat[]> {
    const token = localStorage.getItem("token");
    const result = await api.get<Chat[]>("/chats", {
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
}
