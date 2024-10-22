import React from "react";

const ImageInput: React.FC<{
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}> = ({ label, onChange, value }) => {
  return (
    <div className="w-full">
      <label className="block text-gray-600 text-sm mb-2" htmlFor="file_input">
        {label}
      </label>

      <input
        className="block w-full px-3 py-2 border rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={onChange}
        value={value}
      />

      <p className="mt-1 text-sm text-gray-600" id="file_input_help">
        PNG, JPG or GIF.
      </p>
    </div>
  );
};

export default ImageInput;
