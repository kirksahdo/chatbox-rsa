import { useCallback } from "react";
import { Chat } from "../../@types/chat";
import { User } from "../../@types/user";
import { useChat } from "../../hooks/useChats";
import { useCurrentChat } from "../../hooks/useCurrentChat";
import UserCard from "../cards/UserCard";

const UsersList: React.FC<{ users: User[]; handleClick: () => void }> = ({
  users,
  handleClick,
}) => {
  const { chats, changeChats } = useChat();
  const { changeCurrentChat } = useCurrentChat();

  const addNewChat = useCallback(
    (user: User) => {
      const newChat: Chat = {
        recipient_id: user.id,
        recipient_public_key: user.public_key,
        recipient_username: user.username,
        recipient_profile_image: user.profile_image,
        messages: [],
        is_group: false,
      };
      changeChats([...chats, newChat]);
      changeCurrentChat(newChat);
    },
    [chats],
  );

  const handleClickCard = useCallback(
    (user: User) => {
      const chat = chats.find(
        (chat) => chat.recipient_id === user.id && !chat.is_group,
      );
      if (chat) {
        changeCurrentChat(chat);
      } else {
        addNewChat(user);
      }
      handleClick();
    },
    [chats],
  );

  return (
    <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
      {users.length > 0 ? (
        users.map((user, i) => (
          <UserCard user={user} key={i} onClick={() => handleClickCard(user)} />
        ))
      ) : (
        <h3 className="w-full text-gray-500 text-center">
          {"Users with name not found."}
        </h3>
      )}
    </div>
  );
};

export default UsersList;
