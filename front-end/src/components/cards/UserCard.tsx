import React from "react";
import { User } from "../../@types/user";

const UserCard: React.FC<{ user: User; onClick: () => void }> = ({
  user,
  onClick,
}) => {
  return (
    <div
      className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
      onClick={(_) => onClick()}
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
        <img
          src={user.profile_image}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{user.username}</h2>
        <p className="text-gray-600">Hoorayy!!</p>
      </div>
    </div>
  );
};

export default UserCard;
