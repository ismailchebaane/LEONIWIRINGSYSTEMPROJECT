import React, { useState } from "react";

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [work, setWork] = useState("Productor");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState(["FouFou"]);

  const workOptions = ["Productor", "QM", "PPE", "IM"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !userName || !password || !work) {
      setError("All fields are required!");
      return;
    }
    if (users.includes(userName)) {
      setError("User already exists!");
      return;
    }
    setError("");
    alert("Account created successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen  p-6">
      <div className="bg-bluecustom text-white p-6 rounded-lg shadow-md w-96">

        <h2 className="text-xl font-bold mb-4">Create an account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Foulen Fouleni"
          className="w-full p-2 mb-4 rounded bg-bluecustom border border-white text-white"
        />
        
        <label className="block mb-2">User Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="FouFou"
          className="w-full p-2 mb-4 rounded bg-bluecustom border border-white text-white"
        />
        
        <label className="block mb-2">Password/ Matricule</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="*************"
          className="w-full p-2 mb-4 rounded bg-bluecustom border border-white text-white"
        />
        
        <label className="block mb-2">Work</label>
        <div className="relative">
          <div
            className="w-full p-2 border bg-bluecustom text-white rounded flex justify-between items-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {work} <span className="text-white">&#x25BC;</span>
          </div>
          {dropdownOpen && (
            <div className="absolute w-full bg-bluecustom text-white mt-1 rounded shadow-md">
              {workOptions.map((option) => (
                <div
                  key={option}
                  className="p-2  hover:bg-white hover:text-bluecustom cursor-pointer"
                  onClick={() => {
                    setWork(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={handleSubmit} 
          className="w-full  text-white font-bold py-2 px-4 rounded mt-4 shadow  bg-blue-900 hover:bg-blue-700 transition-all"
        >
          Sign up
        </button>
        <div className="text-center mt-2">
          <a 
            href="#" 
            className="text-white underline"
            onClick={() => window.history.back()}
          >
            Return
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
