export interface User {
  id: number;
  username: string;
  publicKey: string;
}

export interface GetUsers {
  name?: string;
}
