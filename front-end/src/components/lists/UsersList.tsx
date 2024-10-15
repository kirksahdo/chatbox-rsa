import { User } from "../../@types/user";
import UserCard from "../cards/UserCard";

const UsersList: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
      {users.length > 0 ? (
        users.map((user, i) => <UserCard user={user} key={i} />)
      ) : (
        <h3 className="w-full text-gray-500 text-center">
          {" "}
          {"Users with name not found."}{" "}
        </h3>
      )}
    </div>
  );
};

export default UsersList;
