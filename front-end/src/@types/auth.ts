import { User } from "../interfaces/User";

export interface AuthContextType {
  user: any;
  login: (data: User) => void;
  logout: () => void;
}

export interface AuthRegister {
  username: string;
  password: string;
  public_key: string;
  encrypted_private_key: string;
}

export type AuthLogin = Pick<AuthRegister, "username" | "password">;

export interface AuthLoginResponse {
  id: number;
  username: string;
  password: string;
  publicKey: string;
  encryptedPrivateKey: string;
}
