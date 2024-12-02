import React from "react";
import { FaCheckDouble, FaPaperPlane } from "react-icons/fa";

const MessageStatus: React.FC<{ status: string }> = ({ status }) => {
  let icon;
  if (status === "sent") {
    icon = <FaPaperPlane className="fill-gray-300" title="Sent" />;
  } else if (status === "received") {
    icon = <FaCheckDouble className="fill-gray-300" title="Received" />;
  } else if (status === "read") {
    icon = <FaCheckDouble className="fill-green-300" title="Read" />;
  }

  return <div>{icon}</div>;
};

export default MessageStatus;
