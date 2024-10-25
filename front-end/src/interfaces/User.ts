export interface User {
  id: number;
  username: string;
  token: string;
  encryptedPrivateKey: string;
  profileImage: string;
  publicKey: string;
}
