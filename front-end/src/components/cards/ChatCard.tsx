import React from "react";
import { Chat } from "../../@types/chat";
import clsx from "clsx";

const ChatCard: React.FC<{
  chat: Chat;
  onClick: () => void;
  selected?: boolean;
}> = ({ chat, onClick, selected }) => {
  return (
    <div
      className={clsx(
        "flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md",
        selected && "bg-gray-100",
      )}
      onClick={(_) => onClick()}
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
        <img
          src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{chat.recipient_username}</h2>
        <p className="text-gray-600">
          {chat.messages.slice(-1)[0].encrypted_message}
        </p>
      </div>
    </div>
  );
};

export default ChatCard;
