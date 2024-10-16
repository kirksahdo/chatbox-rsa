import { Chat } from "../../@types/chat";
import { User } from "../../@types/user";
import { useChat } from "../../hooks/useChats";
import { useCurrentChat } from "../../hooks/useCurrentChat";
import UserCard from "../cards/UserCard";

const UsersList: React.FC<{ users: User[]; handleClick: () => void }> = ({
  users,
  handleClick,
}) => {
  const { chats, setChats } = useChat();
  const { setCurrentChat } = useCurrentChat();

  const handleClickCard = (user: User) => {
    const chat = chats.find((chat) => chat.recipient_id === user.id);
    if (chat) {
      setCurrentChat(chat);
    } else {
      addNewChat(user);
    }
    handleClick();
  };

  const addNewChat = (user: User) => {
    const newChat: Chat = {
      recipient_id: user.id,
      recipient_public_key: user.publicKey,
      recipient_username: user.username,
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
  };

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
