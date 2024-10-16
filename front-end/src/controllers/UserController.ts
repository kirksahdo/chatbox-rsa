import { GetUsers, User } from "../@types/user";
import api from "../services/api";

export default abstract class UserController {
  static async getAll(payload: GetUsers): Promise<User[]> {
    const token = localStorage.getItem("token");
    const result = await api.get<User[]>(`/users?name=${payload.name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  }
}