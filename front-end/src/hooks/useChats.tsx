import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Chat, ChatContextType } from "../@types/chat";
import { useAuth } from "./useAuth";
import { useCurrentChat } from "./useCurrentChat";
import UserController from "../controllers/UserController";
import { useToast } from "./useToast";
import { decryptMessage } from "../utils/crypto";

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Chats
  const [chats, setChats] = useState<Chat[]>([]);
  const chatsRef = useRef(chats); // Ref

  // Current Chat Context
  const { currentChat, changeCurrentChat } = useCurrentChat();
  const currentChatRef = useRef(currentChat);

  // WebSocket Connection Ref
  const connection = useRef<WebSocket | null>(null);

  const { user } = useAuth();
  const { addToast } = useToast();

  // Atualiza o valor do ref sempre que `chats` mudar
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // Atualiza o valor do ref sempre que `currentChat` mudar
  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  const addNewChat = useCallback(
    async (message: string, sender_id: number, recipient_id: number) => {
      const newChats = [...chatsRef.current];
      const sender = await UserController.getUser({
        id: sender_id !== user!.id ? sender_id : recipient_id,
      });

      const newChat: Chat = {
        recipient_id: sender.id,
        recipient_public_key: sender.publicKey,
        recipient_username: sender.username,
        messages: [
          {
            id: 0,
            recipient_id: recipient_id,
            sender_id: sender_id,
            encrypted_message: message,
            sender_encrypted_message: message,
            timestamp: new Date(),
          },
        ],
      };
      setChats([...newChats, newChat]);
      addToast(message, "notification", sender.username);
    },
    [addToast, user],
  );

  const addMessage = useCallback(
    async (
      message: string,
      sender_message: string,
      sender_id: number,
      recipient_id: number,
    ) => {
      try {
        const sender = await UserController.getUser({
          id: sender_id !== user!.id ? sender_id : recipient_id,
        });
        const newChats = [...chatsRef.current];

        const decryptedMessage =
          recipient_id === user!.id
            ? decryptMessage(message, user!.encryptedPrivateKey)
            : decryptMessage(sender_message, user!.encryptedPrivateKey);

        for (let i = 0; newChats.length; i++) {
          if (
            newChats[i].recipient_id === recipient_id ||
            newChats[i].recipient_id === sender.id
          ) {
            newChats[i].messages.push({
              id: newChats[i].messages.length + 1,
              recipient_id: recipient_id,
              sender_id: sender_id,
              encrypted_message: decryptedMessage,
              sender_encrypted_message: decryptedMessage,
              timestamp: new Date(),
            });
            if (
              currentChatRef.current?.recipient_id === sender_id ||
              currentChatRef.current?.recipient_id === recipient_id
            ) {
              changeCurrentChat(newChats[i]);
            } else {
              addToast(
                decryptedMessage,
                "notification",
                newChats[i].recipient_username,
              );
            }
            setChats([...newChats]);
            return;
          }
        }
        await addNewChat(decryptedMessage, sender_id, recipient_id);
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  useEffect(() => {
    if (!user) return;

    const uniqueParam = Date.now(); // Gera um timestamp único
    const socket = new WebSocket(
      `ws://127.0.0.1:3333/ws/${user.id}?token=${user.token}&t=${uniqueParam}`,
    );

    socket.onopen = () => console.log("WebSocket connection established");
    socket.onclose = () => console.log("WebSocket connection closed");
    socket.onmessage = (event) => {
      const message: {
        sender_id: number;
        message: string;
        sender_message: string;
      } = JSON.parse(event.data);
      console.log("message:", message);
      addMessage(
        message.message,
        message.sender_message,
        message.sender_id,
        user!.id,
      );
    };
    connection.current = socket;
  }, [user]);

  const changeChats = (chats: Chat[]) => {
    setChats([...chats]);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (connection.current) {
        console.log("Fechando WebSocket antes de sair.");
        connection.current.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <ChatContext.Provider value={{ chats, changeChats, addMessage }}>
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
