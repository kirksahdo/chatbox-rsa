export interface Chat {
  recipient_id: number;
  recipient_username: string;
  recipient_public_key: string;
  recipient_profile_image: string;
  messages: Message[];
  is_group: boolean;
  status?: string;
}

export interface Message {
  id: number;
  recipient_id: number;
  sender_id: number;
  sender_username: string;
  encrypted_message: string;
  sender_encrypted_message: string;
  timestamp: Date;
  status?: string;
}

export interface ChatContextType {
  chats: Chat[];
  changeChats: (chats: Chat[]) => void;
  addMessage: (
    sender_id: number,
    recipient_id: number,
    is_group: boolean,
    type: string,
  ) => Promise<void>;
  getChats: () => Promise<void>;
}

export interface CurrentChatContextType {
  currentChat: Chat | undefined;
  changeCurrentChat: (chat: Chat | undefined) => void;
}

export interface MessageRegister {
  recipient_id: number;
  sender_encrypted_message: string;
  encrypted_message: string;
}

export interface ConnectedClientsResult {
  usersIds: number[];
}

export interface GetMessagesByUserId {
  user_id: number;
}

export interface MessagesUpdate {
  user_id: number;
}
