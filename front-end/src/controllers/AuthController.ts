import {
  AuthLogin,
  AuthLoginResponse,
  AuthRegister,
  AuthToken,
} from "../@types/auth";
import api from "../services/api";

export default abstract class AuthController {
  static async register(payload: AuthRegister) {
    const result = await api.post("/register/", payload);
    return result.data;
  }

  static async login(payload: AuthLogin): Promise<AuthLoginResponse> {
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

  static async validateCredentials(
    payload: AuthToken,
  ): Promise<AuthLoginResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = (await api.post<AuthLoginResponse>("/token", payload))
          .data;
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
}
