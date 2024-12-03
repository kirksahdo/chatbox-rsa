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
import { decryptSessionKey } from "../utils/crypto";
import GroupController from "../controllers/GroupController";
import ChatController from "../controllers/ChatController";
import {
  decriptChat,
  decriptGroupMessages,
  decriptMessages,
} from "../utils/chats";
import { useLoading } from "./useLoading";

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
  const { setIsLoading } = useLoading();

  // Atualiza o valor do ref sempre que `chats` mudar
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // Atualiza o valor do ref sempre que `currentChat` mudar
  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  const addNewChat = useCallback(
    async (sender_id: number, recipient_id: number, is_group: boolean) => {
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
        const decryptedSessionKey = decryptSessionKey(
          cryptedSessionKey,
          user!.encryptedPrivateKey,
        );
        const messages = await GroupController.getMessages({
          group_id: group.id,
        });
        newChat = {
          recipient_id: group.id,
          recipient_public_key: cryptedSessionKey,
          recipient_username: group.name,
          recipient_profile_image: group.profile_image,
          messages: decriptGroupMessages(messages, decryptedSessionKey),
          is_group: true,
        };
      } else {
        const messages = await ChatController.getMessages({
          user_id: sender_id !== user?.id ? sender_id : recipient_id,
        });
        newChat = {
          recipient_id: sender.id,
          recipient_public_key: sender.public_key,
          recipient_username: sender.username,
          recipient_profile_image: sender.profile_image,
          messages: decriptMessages(messages, user!),
          is_group: false,
        };
      }

      setChats([newChat, ...newChats]);
      addToast(
        newChat.messages.at(-1)?.encrypted_message ?? "Message received",
        "notification",
        newChat.messages.at(-1)?.sender_username,
      );
    },
    [addToast, user],
  );

  const addMessage = useCallback(
    async (
      sender_id: number,
      recipient_id: number,
      is_group: boolean,
      type: string,
    ) => {
      try {
        const recipient = is_group
          ? recipient_id
          : sender_id !== user?.id
          ? sender_id
          : recipient_id;

        const chat = chatsRef.current.findIndex(
          (chat) =>
            chat.recipient_id === recipient && chat.is_group === is_group,
        );
        if (chat !== -1) {
          let messages = [];
          if (is_group) {
            messages = await GroupController.getMessages({
              group_id: recipient_id,
            });
            const cryptedSessionKey = await GroupController.getSessionKey({
              group_id: recipient_id,
            });

            const decryptedSessionKey = decryptSessionKey(
              cryptedSessionKey,
              user!.encryptedPrivateKey,
            );
            chatsRef.current[chat].messages = decriptGroupMessages(
              messages,
              decryptedSessionKey,
            );
          } else {
            messages = await ChatController.getMessages({
              user_id: recipient,
            });
            chatsRef.current[chat].messages = decriptMessages(messages, user!);
          }

          if (currentChatRef.current?.recipient_id === recipient) {
            if (
              recipient_id === user?.id &&
              is_group === false &&
              type === "new_message"
            ) {
              await ChatController.updateChatMessagesStatus({
                user_id: recipient,
              });
            }
            changeCurrentChat(chatsRef.current[chat]);
          } else if (type === "new_message") {
            addToast(
              chatsRef.current[chat].messages.at(-1)?.encrypted_message ??
                "Message received",
              "notification",
              chatsRef.current[chat].messages.at(-1)?.sender_username,
            );
          }
          setChats([...chatsRef.current]);
          return;
        }

        await addNewChat(sender_id, recipient_id, is_group);
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
          message.sender_id,
          message.group_id ? message.group_id : user!.id,
          !!message.group_id,
          "new_message",
        );
      } else if (message.type === "message_status_update") {
        console.log("Receving status update", message.sender_id);
        addMessage(message.sender_id, user!.id, false, message.type);
      }
    };
    connection.current = socket;
  }, [user]);

  const getChats = async () => {
    try {
      setIsLoading(true);
      const onlineClients = await ChatController.getConnectedClients();
      const result = await ChatController.get();
      const chats = result.map(
        async (chat) => await decriptChat(chat, user!, onlineClients),
      );
      const resultChats = await Promise.all(chats);
      await ChatController.updateMessagesStatus();
      changeChats([...resultChats]);
    } catch (err: any) {
      addToast(err.message, "danger");
    } finally {
      setIsLoading(false);
    }
  };

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
    <ChatContext.Provider value={{ chats, changeChats, addMessage, getChats }}>
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
