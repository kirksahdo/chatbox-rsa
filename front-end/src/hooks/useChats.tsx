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
import {
  decryptGroupMessage,
  decryptMessage,
  decryptSessionKey,
} from "../utils/crypto";
import GroupController from "../controllers/GroupController";

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
    async (
      message: string,
      sender_id: number,
      recipient_id: number,
      is_group: boolean,
    ) => {
      const newChats = [...chatsRef.current];
      let newChat: Chat;

      const sender = await UserController.getUser({
        id: is_group
          ? sender_id
          : sender_id !== user!.id
          ? sender_id
          : recipient_id,
      });

      if (is_group) {
        const group = await GroupController.get({
          group_id: recipient_id,
        });
        const cryptedSessionKey = await GroupController.getSessionKey({
          group_id: group.id,
        });
        newChat = {
          recipient_id: group.id,
          recipient_public_key: cryptedSessionKey,
          recipient_username: group.name,
          recipient_profile_image: group.profile_image,
          messages: [
            {
              id: 0,
              recipient_id: recipient_id,
              sender_id: sender_id,
              sender_username: sender.username,
              encrypted_message: message,
              sender_encrypted_message: message,
              timestamp: new Date(),
            },
          ],
          is_group: true,
        };
      } else {
        newChat = {
          recipient_id: sender.id,
          recipient_public_key: sender.public_key,
          recipient_username: sender.username,
          recipient_profile_image: sender.profile_image,
          messages: [
            {
              id: 0,
              recipient_id: recipient_id,
              sender_id: sender_id,
              sender_username:
                sender_id === user!.id ? user!.username : sender.username,
              encrypted_message: message,
              sender_encrypted_message: message,
              timestamp: new Date(),
            },
          ],
          is_group: false,
        };
      }

      setChats([newChat, ...newChats]);
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
      is_group: boolean,
    ) => {
      try {
        const sender = await UserController.getUser({
          id: is_group
            ? sender_id
            : sender_id !== user!.id
            ? sender_id
            : recipient_id,
        });
        let decryptedMessage = "";
        if (is_group) {
          const group = await GroupController.get({ group_id: recipient_id });
          const cryptedSessionKey = await GroupController.getSessionKey({
            group_id: group.id,
          });

          const decryptedSessionKey = decryptSessionKey(
            cryptedSessionKey,
            user!.encryptedPrivateKey,
          );
          decryptedMessage = decryptGroupMessage(message, decryptedSessionKey);
        } else {
          decryptedMessage =
            recipient_id === user!.id
              ? decryptMessage(message, user!.encryptedPrivateKey)
              : decryptMessage(sender_message, user!.encryptedPrivateKey);
        }

        const newChats = [...chatsRef.current];

        for (let i = 0; i < newChats.length; i++) {
          if (newChats[i].is_group === is_group) {
            if (
              ((newChats[i].recipient_id === recipient_id ||
                newChats[i].recipient_id === sender_id) &&
                !is_group) ||
              (is_group && newChats[i].recipient_id === recipient_id)
            ) {
              newChats[i].messages.push({
                id: newChats[i].messages.length + 1,
                recipient_id: recipient_id,
                sender_id: sender_id,
                sender_username:
                  sender_id === user!.id ? user!.username : sender.username,
                encrypted_message: decryptedMessage,
                sender_encrypted_message: decryptedMessage,
                timestamp: new Date(),
              });

              if (
                ((currentChatRef.current?.recipient_id === sender_id ||
                  currentChatRef.current?.recipient_id === recipient_id) &&
                  !is_group) ||
                (is_group &&
                  currentChatRef.current?.recipient_id === recipient_id)
              ) {
                changeCurrentChat(newChats[i]);
              } else {
                addToast(
                  decryptedMessage,
                  "notification",
                  newChats[i].recipient_username,
                );
              }
              var aux = newChats[i];
              newChats[i] = newChats[0];
              newChats[0] = aux;
              setChats([...newChats]);
              return;
            }
          }
        }
        await addNewChat(decryptedMessage, sender_id, recipient_id, is_group);
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  const changeChatsStatus = (userId: number, status: string) => {
    const chats = [...chatsRef.current];
    const chatIndex = chats.findIndex((chat) => chat.recipient_id === userId);
    if (chatIndex !== -1) {
      chats[chatIndex].status = status;
    }
    setChats([...chats]);
  };

  useEffect(() => {
    if (!user) return;

    const uniqueParam = Date.now(); // Gera um timestamp único
    const socket = new WebSocket(
      `ws://${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_WS_PORT}/ws/${user.id}?token=${user.token}&t=${uniqueParam}`,
    );

    socket.onopen = () => console.log("WebSocket connection established");
    socket.onclose = () => console.log("WebSocket connection closed");
    socket.onmessage = (event) => {
      const message: {
        type: string;
        sender_id: number;
        message: string;
        sender_message: string;
        group_id?: number;
        user_id?: number;
        status?: string;
      } = JSON.parse(event.data);
      if (message.type === "status" && message.user_id && message.status) {
        changeChatsStatus(message.user_id, message.status);
        console.log(message.user_id!, message.status);
      } else if (message.type === "message") {
        addMessage(
          message.message,
          message.sender_message,
          message.sender_id,
          message.group_id ? message.group_id : user!.id,
          !!message.group_id,
        );
      }
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
