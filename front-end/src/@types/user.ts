export interface User {
  id: number;
  username: string;
  public_key: string;
  profile_image: string;
}

export interface GetUsers {
  name?: string;
}

export interface GetUser {
  id: number;
}
