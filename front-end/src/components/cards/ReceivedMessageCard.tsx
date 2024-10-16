import React from "react";
import { Message } from "../../@types/chat";

const ReceivedMessageCard: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="flex mb-4 cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
        <img
          src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
      <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
        <p className="text-gray-700">{message.encrypted_message}</p>
      </div>
    </div>
  );
};

export default ReceivedMessageCard;
