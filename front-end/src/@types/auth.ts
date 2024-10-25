import { User } from "../interfaces/User";

export interface AuthContextType {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
}

export interface AuthRegister {
  username: string;
  password: string;
  public_key: string;
  encrypted_private_key: string;
  profile_image: string;
}

export type AuthLogin = Pick<AuthRegister, "username" | "password">;

export type AuthToken = Pick<AuthLoginResponse, "token">;

export interface AuthLoginResponse {
  id: number;
  username: string;
  publicKey: string;
  encryptedPrivateKey: string;
  profileImage: string;
  token: string;
}
