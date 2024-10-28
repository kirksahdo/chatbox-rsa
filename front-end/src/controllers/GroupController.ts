import {
  CreateGroup,
  GetSessionKeyGroup,
  SendGroupMessage,
  GetGroupById,
  Group,
} from "../@types/group";
import api from "../services/api";

export default abstract class GroupController {
  static async create(payload: CreateGroup) {
    const token = localStorage.getItem("token");
    const result = await api.post("/groups", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result;
  }

  static async sendMessage(payload: SendGroupMessage) {
    const token = localStorage.getItem("token");
    await api.post("/groups/messages", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  static async getSessionKey(payload: GetSessionKeyGroup): Promise<string> {
    const token = localStorage.getItem("token");
    const result = await api.get<string>(
      `/groups/session/${payload.group_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return result.data;
  }

  static async get(payload: GetGroupById): Promise<Group> {
    const token = localStorage.getItem("token");
    const result = await api.get<Group>(`/groups/${payload.group_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }
}
