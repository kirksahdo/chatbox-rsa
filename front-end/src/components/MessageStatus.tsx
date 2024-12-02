import React from "react";
import { FaCheckDouble, FaPaperPlane, FaRegEnvelope } from "react-icons/fa";

const MessageStatus: React.FC<{ status: string }> = ({ status }) => {
  let icon;
  if (status === "sent") {
    icon = <FaPaperPlane />;
  } else if (status === "received") {
    icon = <FaRegEnvelope />;
  } else if (status === "read") {
    icon = <FaCheckDouble />;
  }

  return <div>{icon}</div>;
};

export default MessageStatus;
