import React from 'react'; 
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center">
   
      <div className="bg-bluecustom text-white p-8 rounded-lg shadow-lg max-w-md">
       <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
				<span className="sr-only">Error</span>404
			</h2>
        <p className="text-lg font-bold text-white mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link  to="/"  className="text-white hover:underline">
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
