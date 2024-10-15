import React from "react";

const SearchInput: React.FC<{
  value: string;
  onChange: (text: string) => void;
  onClick: () => void;
}> = ({ value, onChange, onClick }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-b-gray-200"
        placeholder="Search User..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
        onClick={(_) => onClick()}
      >
        Search
      </button>
    </div>
  );
};

export default SearchInput;
