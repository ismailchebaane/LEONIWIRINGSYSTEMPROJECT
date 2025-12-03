import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SecondPage = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get mode from query param
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (serialNumber.trim() === "") {
      toast.warn("Please enter a serial number.", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.get(`http://svtn3local01:9095/api/equipment/check/${serialNumber}`);

      if (response.data.exists) {
        toast.success("Equipment found!", { position: "top-center" });

        // Navigate based on selected mode
        if (mode === "read-only") {
          navigate(`/read-only/${serialNumber}`);
        } else if (mode === "read-write") {
          navigate(`/read-write/${serialNumber}`);
        } else {
          toast.error("Invalid mode!", { position: "top-center" });
        }
      } else {
        toast.error("Equipment not found.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error checking serial number:", error);
      toast.error("Something went wrong.", { position: "top-center" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 ">
     
      <div className="w-full bg-bluecustom max-w-md p-6 border-2 border-bluecustom rounded-lg shadow-2xl">
      <button onClick={() => navigate(-1)} className="hover:underline text-white mb-4">
          Return
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Enter Equipment Serial Number</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
        
            <input 
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3 py-2 bg-bluecustom border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold text-white placeholder:text-gray-500" 
              placeholder="SerialNumber"
            />  
          </div>
          <button className="w-full text-white font-bold py-2 px-4 rounded shadow bg-blue-900 hover:bg-blue-700 transition-all">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecondPage;
