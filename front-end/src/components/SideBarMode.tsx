import clsx from "clsx";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const SideBarMode: React.FC<{
  mode: "messages" | "search";
  onClickSearch: () => void;
  onClickMessages: () => void;
}> = ({ mode, onClickMessages, onClickSearch }) => {
  return (
    <div className="flex w-full">
      <div
        className={clsx(
          "flex-1 flex gap-2 items-center p-4 hover:cursor-pointer ",
          mode === "messages"
            ? "bg-purple-700 hover:bg-purple-800"
            : "hover:bg-purple-600 bg-purple-500",
        )}
        onClick={onClickMessages}
      >
        <FaMessage className="text-white" />
        <h1 className="text-white"> Messages </h1>
      </div>
      <div
        className={clsx(
          "flex-1 flex gap-2 items-center p-4 hover:cursor-pointer ",
          mode === "search"
            ? "bg-purple-700 hover:bg-purple-800"
            : "hover:bg-purple-600 bg-purple-500",
        )}
        onClick={onClickSearch}
      >
        <FaSearch className="text-white" />
        <h1 className="text-white"> Search Users </h1>
      </div>
    </div>
  );
};

export default SideBarMode;
