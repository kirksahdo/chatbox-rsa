import { useCallback } from "react";
import { Chat } from "../../@types/chat";
import { useCurrentChat } from "../../hooks/useCurrentChat";
import ChatCard from "../cards/ChatCard";
import ChatController from "../../controllers/ChatController";

const ChatList: React.FC<{ chats: Chat[] }> = ({ chats }) => {
  const { currentChat, changeCurrentChat } = useCurrentChat();

  const handleClick = useCallback(
    (index: number, selected?: boolean) => {
      if (currentChat === chats[index] && selected) {
        changeCurrentChat(undefined);
        return;
      }
      changeCurrentChat(chats[index]);
      if (chats[index].is_group === false)
        updateChatMessagesStatus(chats[index].recipient_id);
    },
    [chats, currentChat],
  );

  const updateChatMessagesStatus = async (user_id: number) => {
    try {
      await ChatController.updateChatMessagesStatus({ user_id });
    } catch (err) {
      console.error(err);
    }
  };

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
