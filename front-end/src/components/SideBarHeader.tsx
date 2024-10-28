import { CiLogout } from "react-icons/ci";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";

const SideBarHeader = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-purple-950 text-white">
      <div className="flex gap-3 items-center">
        <img
          src={user?.profileImage}
          className="w-9 h-9 rounded-full"
          alt="Profile"
        />
        <h1 className="text-2xl font-semibold">{`Hello, ${user?.username}`}</h1>
      </div>

      <div className="relative p-0 m-0">
        <button
          id="menuButton"
          className="focus:outline-none"
          onClick={() => setShowMenu(!showMenu)}
        >
          <IoMdMenu className="h-7 w-7 text-white hover:text-gray-400" />
        </button>
        {/* <!-- Menu Dropdown --> */}
        {showMenu && (
          <div
            id="menuDropdown"
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-30"
          >
            <ul className="py-2 px-3">
              <li>
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-gray-400"
                  onClick={() => {
                    logout();
                  }}
                >
                  <CiLogout />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default SideBarHeader;
