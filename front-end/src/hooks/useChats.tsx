import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Chat, ChatContextType } from "../@types/chat";
import { useAuth } from "./useAuth";
import { useCurrentChat } from "./useCurrentChat";

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { currentChat, setCurrentChat } = useCurrentChat();
  const connection = useRef<WebSocket | null>(null);

  const { user } = useAuth();

  const addMessage = (
    message: string,
    sender_id: number,
    recipient_id: number,
  ) => {
    const newChats = [...chats];
    for (let i = 0; newChats.length; i++) {
      if (
        newChats[i].recipient_id === recipient_id ||
        newChats[i].recipient_id === sender_id
      ) {
        newChats[i].messages.push({
          id: newChats[i].messages.length + 1,
          recipient_id: recipient_id,
          sender_id: sender_id,
          encrypted_message: message,
          timestamp: new Date(),
        });
        if (
          currentChat?.recipient_id === sender_id ||
          currentChat?.recipient_id === recipient_id
        ) {
          setCurrentChat({ ...newChats[i] });
        }
        break;
      }
    }
    setChats([...newChats]);
  };

  useEffect(() => {
    const socket = new WebSocket(
      `ws://127.0.0.1:3333/ws/${user!.id}?token=${user!.token}`,
    );

    socket.onopen = () => console.log("WebSocket connection established");
    socket.onclose = () => console.log("WebSocket connection closed");
    socket.onmessage = (event) => {
      const message: {
        sender_id: number;
        message: string;
      } = JSON.parse(event.data);
      addMessage(message.message, message.sender_id, user!.id);
    };
    connection.current = socket;

    return () => {
      socket.close();
    };
  }, [chats]);

  return (
    <ChatContext.Provider value={{ chats, setChats, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat should be used within a ChatProvider");
  }
  return context;
};
