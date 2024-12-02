import { User } from "./user";

export interface CreateGroup {
  name: string;
  users: {
    id: number;
    crypted_key: string;
  }[];
  profile_image: string;
}

export interface SendGroupMessage {
  group_id: number;
  encrypted_message: string;
}

export interface GetSessionKeyGroup {
  group_id: number;
}

export interface GetGroupById extends GetSessionKeyGroup {}

export interface GetGroupMessagesById extends GetSessionKeyGroup {}

export interface Group {
  id: number;
  name: string;
  profile_image: string;
  users: User[];
  timestamp: Date;
}
