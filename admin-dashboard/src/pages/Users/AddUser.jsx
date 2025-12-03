import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    matricule: "",
    work: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // Adjust the key name if it's different
  
    try {
      await axios.post("http://svtn3local01:9095/add/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/users"); // Or wherever you want to redirect
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Failed to add user. Please try again.");
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mt-16 mx-auto">
      <button onClick={() => navigate(-1)} className="text-blue-700 underline text-sm">
        Return
      </button>
      <h1 className="text-3xl font-bold text-blue-900 mt-2 mb-4">Add User</h1>
      <div className="border-t border-gray-200 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Matricule</label>
              <input
                type="text"
                name="matricule"
                required
                value={formData.matricule}
                onChange={handleChange}
                placeholder="Enter matricule"
                className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Work</label>
              <select
                name="work"
                required
                value={formData.work}
                onChange={handleChange}
                className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Work
                </option>
                <option value="QM">QM</option>
                <option value="PPE">PPE</option>
                <option value="IM">IM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              type="reset"
              onClick={() =>
                setFormData({
                  fullName: "",
                  username: "",
                  matricule: "",
                  work: "",
                  role: "",
                })
              }
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
