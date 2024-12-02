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
import {
  decryptGroupMessage,
  decryptMessage,
  decryptSessionKey,
} from "../utils/crypto";
import GroupController from "../controllers/GroupController";
import { useLoading } from "../hooks/useLoading";
import { decriptChat } from "../utils/chats";

const ChatSideBar = () => {
  // Component States
  const [searchInput, setSearchInput] = useState("");
  const [mode, setMode] = useState<"messages" | "search">("messages");

  // Global Contexts
  const { addToast } = useToast();
  const { user } = useAuth();
  const { setIsLoading } = useLoading();

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
      setIsLoading(true);
      const onlineClients = await ChatController.getConnectedClients();
      const result = await ChatController.get();
      const chats = result.map(
        async (chat) => await decriptChat(chat, user!, onlineClients),
      );
      const resultChats = await Promise.all(chats);
      changeChats([...resultChats]);
    } catch (err: any) {
      addToast(err.message, "danger");
    } finally {
      setIsLoading(false);
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
      <SideBarHeader onCreateGroup={getChats} />

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
