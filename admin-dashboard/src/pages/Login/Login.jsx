import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login({ location }) {
  const navigate = useNavigate();
  const [username, setEmail] = useState("");
  const [matricule, setPassword] = useState("");
  const { loading, dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post("http://svtn3local01:9095/api/auth/login", {
        username: username,
        matricule: matricule
      });

      if (res.status === 200) {
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });

        const token = res.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(res.data));

        setTimeout(() => {
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data, loading: true });
          window.location.assign(location || "/");
        }, 2000);
      }
    } catch (error) {
      toast.error("Wrong input! Try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      dispatch({ type: "LOGIN_FAILURE", payload: error });
    }
  };

  return (
    <div className={`w-full h-screen flex items-center justify-center bg-white ${loading ? 'opacity-70' : ''}`}>
      <ToastContainer />

      <div className="w-full max-w-md bg-[#f1f4f9] border border-[#164e96] rounded-lg p-8 shadow-md">
        <div className="mb-6 text-left">
          <h1 className="text-[#164e96] font-bold text-4xl mb-2">LEONI</h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-[#164e96] text-2xl font-bold text-center mb-4">Admin Authentification</h2>
          
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">Admin name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Foulen Fouleni"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#164e96]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={matricule}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**************"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#164e96]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#8aaf2f] hover:bg-[#779a28] text-white font-semibold rounded-md text-lg transition duration-300"
          >
            login
          </button>
        </form>
      </div>
    </div>
  );
}
