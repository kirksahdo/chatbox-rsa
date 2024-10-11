import { AuthLogin, AuthLoginResponse, AuthRegister } from "../@types/auth";
import api from "../services/api";

export default abstract class AuthController {
  static async register(payload: AuthRegister) {
    const result = await api.post("/register/", payload);
    return result.data;
  }

  static async login(payload: AuthLogin) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = (await api.post<AuthLoginResponse>("/login", payload))
          .data;
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
}
