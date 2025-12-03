import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [matricule, setMatricule] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://svtn3local01:9095/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, matricule }),
      });

      if (!response.ok) {
        setError(true);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store JWT token

      setError(false);
      alert("Login successful!");
      navigate(-1);
     
    } catch (err) {
      console.error("Login failed:", err);
      setError(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-bluecustom p-8 rounded-lg shadow-lg text-white w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Who are you?</h2>
        <form onSubmit={handleLogin}>
          <label className="block mb-2">User Name</label>
          <input
            type="text"
            required
            placeholder="Enter User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-bluecustom border border-white text-white p-2 mb-4 rounded"
          />

          <label className="block mb-2">Password/ Matricule</label>
          <input
            type="password"
            required
            placeholder="Enter password"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            className="w-full bg-bluecustom p-2 mb-4 border border-white text-white rounded"
          />

          {error && (
            <p className="underline text-center font-bold mb-4">
              Sorry, your User Name or Password was incorrect. Please try again!
            </p>
          )}

          <button className="w-full py-2 transition-all text-white font-bold rounded bg-blue-900 hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="text-center mt-2">
          <a href="/" className="text-white underline">
            Return
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
