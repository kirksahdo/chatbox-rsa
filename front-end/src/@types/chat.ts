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
  timestamp: Date;
}

export interface ChatContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  addMessage: (
    message: string,
    sender_id: number,
    recipient_id: number,
  ) => Promise<void>;
}

export interface CurrentChatContextType {
  currentChat: Chat | undefined;
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
}

export interface MessageRegister {
  recipient_id: number;
  encrypted_message: string;
}
