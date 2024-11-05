import { useCallback } from "react";
import { Chat } from "../../@types/chat";
import { useCurrentChat } from "../../hooks/useCurrentChat";
import ChatCard from "../cards/ChatCard";

const ChatList: React.FC<{ chats: Chat[] }> = ({ chats }) => {
  const { currentChat, changeCurrentChat } = useCurrentChat();

  const handleClick = useCallback(
    (index: number, selected?: boolean) => {
      if (currentChat === chats[index] && selected) {
        changeCurrentChat(undefined);
        return;
      }
      changeCurrentChat(chats[index]);
    },
    [chats, currentChat],
  );

  return (
    <div className="overflow-y-auto h-screen p-3 mb-9 pb-28">
      {chats.length > 0 ? (
        chats.map((chat, i) => (
          <ChatCard
            chat={chat}
            key={i}
            onClick={(selected) => handleClick(i, selected)}
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
