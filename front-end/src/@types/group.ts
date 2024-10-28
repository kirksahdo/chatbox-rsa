export interface CreateGroup {
  name: string;
  users: {
    id: number;
    crypted_key: string;
  }[];
}

export interface SendGroupMessage {
  group_id: number;
  encrypted_message: string;
}

export interface GetSessionKeyGroup {
  group_id: number;
}

export interface GetGroupById extends GetSessionKeyGroup {}

export interface Group {
  id: number;
  name: string;
  timestamp: Date;
}
