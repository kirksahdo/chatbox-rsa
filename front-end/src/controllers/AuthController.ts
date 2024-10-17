import { rejects } from "assert";
import {
  AuthLogin,
  AuthLoginResponse,
  AuthRegister,
  AuthToken,
} from "../@types/auth";
import api from "../services/api";

export default abstract class AuthController {
  static async register(payload: AuthRegister) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await api.post("/register/", payload);
        resolve(result.data);
      } catch (err) {
        reject(err);
      }
    });
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
