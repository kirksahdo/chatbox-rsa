import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import SearchInput from "./inputs/SearchInput";
import UsersList from "./lists/UsersList";
import SideBarHeader from "./SideBarHeader";
import UserController from "../controllers/UserController";
import { User } from "../@types/user";
import SideBarMode from "./SideBarMode";

const ChatSideBar = () => {
  const [searchInput, setSearchInput] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const { addToast } = useToast();

  const [mode, setMode] = useState<"messages" | "search">("search");

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
          <UsersList users={users} />
        </>
      )}
    </div>
  );
};

export default ChatSideBar;
