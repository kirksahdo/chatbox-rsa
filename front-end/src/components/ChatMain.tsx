import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCurrentChat } from "../hooks/useCurrentChat";
import ReceivedMessageCard from "./cards/ReceivedMessageCard";
import SendedMessageCard from "./cards/SendedMessageCard";
import { useToast } from "../hooks/useToast";
import ChatController from "../controllers/ChatController";
import { useChat } from "../hooks/useChats";

const ChatMain = () => {
  const { currentChat } = useCurrentChat();
  const { addMessage } = useChat();
  const { user } = useAuth();
  const { addToast } = useToast();
  const messagesDivRef = React.useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentChat) {
      scrollToBottom();
    }
  }, [currentChat]);

  const scrollToBottom = () => {
    if (messagesDivRef.current) {
      const scrollHeight = messagesDivRef.current.scrollHeight;
      const height = messagesDivRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messagesDivRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  const handleMessage = async () => {
    if (message.trim().length === 0) {
      addToast("The message field should not be empty", "danger");
      return;
    }

    try {
      if (currentChat) {
        await ChatController.sendMessage({
          encrypted_message: message,
          recipient_id: currentChat.recipient_id,
        });
        addMessage(message, user!.id, currentChat.recipient_id);
        addToast("Message sent!", "success");
        setMessage("");
      }
    } catch (error: any) {
      addToast(error.message, "danger");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {currentChat ? (
        <>
          <header className="bg-white p-4 text-gray-700">
            <h1 className="text-2xl font-semibold">
              {" "}
              {currentChat?.recipient_username}
            </h1>
          </header>

          <div className="h-screen overflow-y-auto p-4" ref={messagesDivRef}>
            {currentChat.messages.map((message, i) =>
              message.sender_id === user!.id ? (
                <SendedMessageCard message={message} key={i} />
              ) : (
                <ReceivedMessageCard message={message} key={i} />
              ),
            )}
          </div>

          <footer className="bg-white border-t border-gray-300 p-4 w-full">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
                onClick={(_) => handleMessage()}
              >
                Send
              </button>
            </div>
          </footer>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl text-gray-500">None chat selected</h1>
        </div>
      )}
    </div>
  );
};

export default ChatMain;
