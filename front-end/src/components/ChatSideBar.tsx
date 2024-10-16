import { useEffect, useState } from "react";
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

const ChatSideBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const { addToast } = useToast();

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
  const { chats, setChats } = useChat();
  const getChats = async () => {
    try {
      const result = await ChatController.get();
      setChats([...result]);
      console.log(chats);
      console.log(result);
      addToast("Chats fetched successfully", "success");
    } catch (err: any) {
      addToast(err.message, "danger");
    }
  };

  useEffect(() => {
    getChats();
  }, []);

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
