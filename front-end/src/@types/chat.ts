export interface Chat {
  recipient_id: number;
  recipient_username: string;
  recipient_public_key: string;
  messages: Message[];
}

export interface Message {
  id: number;
  recipient_id: number;
  sender_id: number;
  encrypted_message: string;
  sender_encrypted_message: string;
  timestamp: Date;
}

export interface ChatContextType {
  chats: Chat[];
  changeChats: (chats: Chat[]) => void;
  addMessage: (
    message: string,
    sender_message: string,
    sender_id: number,
    recipient_id: number,
  ) => Promise<void>;
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
