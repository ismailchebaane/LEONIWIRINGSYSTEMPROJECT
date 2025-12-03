import React from 'react';
import { useNavigate } from 'react-router-dom';

const FirstPage = () => {
  const navigate = useNavigate();

  const handleSelectMode = (mode) => {
    navigate(`/second?mode=${mode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <div className="bg-bluecustom max-w-md w-full p-6 border-2 border-bluecustom rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Choose an Action</h2>

        <div className="flex gap-4">
          <button
            onClick={() => handleSelectMode("read-only")}
            className="w-full text-white font-bold py-4 px-4 rounded shadow bg-green-700 hover:bg-green-600 transition-all"
          >
            View Documents
          </button>

          <button
            onClick={() => handleSelectMode("read-write")}
            className="w-full text-white font-bold py-4 px-4 rounded shadow bg-blue-900 hover:bg-blue-700  transition-all"
          >
            Sign Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
