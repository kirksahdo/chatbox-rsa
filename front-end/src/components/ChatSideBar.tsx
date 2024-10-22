import { useCallback, useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import SearchInput from "./inputs/SearchInput";
import UsersList from "./lists/UsersList";
import SideBarHeader from "./SideBarHeader";
import UserController from "../controllers/UserController";
import SideBarMode from "./SideBarMode";
import ChatController from "../controllers/ChatController";
import ChatList from "./lists/ChatList";
import { User } from "../@types/user";
import { useChat } from "../hooks/useChats";
import { useAuth } from "../hooks/useAuth";
import { decryptMessage } from "../utils/crypto";

const ChatSideBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const { addToast } = useToast();
  const { user } = useAuth();

  const [mode, setMode] = useState<"messages" | "search">("messages");

  // Users List
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async () => {
    try {
      const result = await UserController.getAll({ name: searchInput });
      setUsers([...result]);
      addToast("Users searched successfuly", "success");
    } catch (err: any) {
      addToast(err.message, "danger");
    }
  };
  useEffect(() => {
    if (mode === "search") {
      getUsers();
    }
  }, [mode]);

  // Chat List
  const { chats, changeChats } = useChat();
  const getChats = async () => {
    try {
      const result = await ChatController.get();
      const chats = result.map((chat) => ({
        ...chat,
        messages: chat.messages.map((message) => {
          const msg =
            user!.id === message.recipient_id
              ? decryptMessage(
                  message.encrypted_message,
                  user!.encryptedPrivateKey,
                )
              : decryptMessage(
                  message.sender_encrypted_message,
                  user!.encryptedPrivateKey,
                );
          return { ...message, encrypted_message: msg };
        }),
      }));
      changeChats([...chats]);
    } catch (err: any) {
      addToast(err.message, "danger");
    }
  };

  useEffect(() => {
    getChats();
  }, [user]);

  const handleClickUser = () => {
    setMode("messages");
  };

  return (
    <div className="w-1/4 bg-white border-r border-gray-300">
      <SideBarHeader />

      <SideBarMode
        mode={mode}
        onClickMessages={() => setMode("messages")}
        onClickSearch={() => setMode("search")}
      />

      {mode === "search" && (
        <>
          <SearchInput
            value={searchInput}
            onChange={(text) => setSearchInput(text)}
            onClick={getUsers}
          />
          <UsersList users={users} handleClick={handleClickUser} />
        </>
      )}
      {mode === "messages" && <ChatList chats={chats} />}
    </div>
  );
};

export default ChatSideBar;
