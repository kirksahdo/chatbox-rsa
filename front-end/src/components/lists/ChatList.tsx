import { Chat } from "../../@types/chat";
import { useCurrentChat } from "../../hooks/useCurrentChat";
import ChatCard from "../cards/ChatCard";

const ChatList: React.FC<{ chats: Chat[] }> = ({ chats }) => {
  const { currentChat, setCurrentChat } = useCurrentChat();

  const handleClick = (index: number) => {
    if (currentChat === chats[index]) {
      setCurrentChat(undefined);
      return;
    }
    setCurrentChat(chats[index]);
  };

  return (
    <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
      {chats.length > 0 ? (
        chats.map((chat, i) => (
          <ChatCard
            chat={chat}
            key={i}
            onClick={() => handleClick(i)}
            selected={currentChat === chat}
          />
        ))
      ) : (
        <h3 className="w-full text-gray-500 text-center">
          {"You don't have chats."}
        </h3>
      )}
    </div>
  );
};

export default ChatList;
