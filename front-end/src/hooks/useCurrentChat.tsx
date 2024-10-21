import { createContext, ReactNode, useContext, useState } from "react";
import { Chat, CurrentChatContextType } from "../@types/chat";

const CurrentChatContext = createContext<CurrentChatContextType | null>(null);

export const CurrentChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentChat, setCurrentChat] = useState<Chat>();
  return (
    <CurrentChatContext.Provider
      value={{ changeCurrentChat: setCurrentChat, currentChat }}
    >
      {children}
    </CurrentChatContext.Provider>
  );
};

export const useCurrentChat = () => {
  const context = useContext(CurrentChatContext);
  if (!context) {
    throw new Error(
      "useCurrentChat should be used within a CurrentChatProvider",
    );
  }
  return context;
};
