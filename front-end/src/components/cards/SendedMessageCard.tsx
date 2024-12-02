import React from "react";
import { Message } from "../../@types/chat";
import moment from "moment";
import MessageStatus from "../MessageStatus";

const SendedMessageCard: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex max-w-96 flex-wrap bg-indigo-500 text-white rounded-lg p-3 items-end gap-2">
        <div className="flex flex-col">
          <h3 className="text-xs text-white font-bold">
            {" "}
            {message.sender_username}
          </h3>
          <p style={{ wordBreak: "break-all" }}>{message.encrypted_message}</p>
          <p className="text-xs text-gray-400">
            {moment(message.timestamp).format("HH:mm DD/mm/YYYY")}
          </p>
        </div>
        {message.status && <MessageStatus status={message.status} />}
      </div>
      {/* <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
        <img
          src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
          alt="My Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div> */}
    </div>
  );
};

export default SendedMessageCard;
