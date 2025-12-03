import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function Allusers() {
  const [formValues, setFormValues] = useState({
    id: "",
    username: "",
    email: "",
    matricule: "",
    fullName: "",
    role: "",
    enabled: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userid, setUserid] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleUpdate = (user) => {
    setUserid(user.username);
    setFormValues({
      username: user.username,
      matricule: user.matricule,
      fullName: user.fullName,
      role: user.role,
      work: user.work || '',
    });
    setIsEditing(true);
    setSelectedUser(user);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://svtn3local01:9095/update/user/${userid}`, formValues, axiosConfig);
      toast.success("User updated successfully");
      setIsEditing(false);
      setUserid(null);
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to update user. Please try again.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://svtn3local01:9095/api/user', axiosConfig);
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response && err.response.status === 403) {
          setAccessDenied(true);
          toast.error('Access Denied: You do not have permission to view this data.');
        } else {
          toast.error('An error occurred while fetching user data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (event, item) => {
    event.preventDefault();
    try {
      await axios.delete(`http://svtn3local01:9095/delete/user/${item.username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success(`User ${item.username} deleted successfully`);
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response.status, error.response.data);
        toast.error(`Error ${error.response.status}: ${error.response.data.message || "Server error"}`);
      } else {
        console.error('Network or CORS error:', error.message);
        toast.error('Network error: Unable to delete user');
      }
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-xl p-8 w-[90%] max-w-3xl shadow-lg relative"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">LEONI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-500">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="text-gray-500">User Name</label>
                <input
                  type="text"
                  name="username"
                  value={formValues.username}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="text-gray-500">Matricule</label>
                <input
                  type="text"
                  name="matricule"
                  value={formValues.matricule}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="text-gray-500">Work</label>
                <select
                  name="work"
                  value={formValues.work}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select work</option>
                  <option value="PPE">PPE</option>
                  <option value="QM">QM</option>
                  <option value="IM">IM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="alert alert-error fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between w-[90%] max-w-md">
          <span>{error}</span>
          <CloseIcon onClick={() => setError(null)} className="cursor-pointer text-white" />
        </div>
      )}

      {/* Table */}
      <div className="max-w-full mt-20 px-10">
        {loading ? (
          <div className="flex justify-center items-center text-lg font-medium text-gray-700 mt-20">
            <span className="animate-pulse">Loading</span>
            <span className="animate-ping inline-block w-2 h-2 bg-blue-500 rounded-full mx-1"></span>
            <span className="animate-ping inline-block w-2 h-2 bg-blue-500 rounded-full mx-1 delay-150"></span>
            <span className="animate-ping inline-block w-2 h-2 bg-blue-500 rounded-full mx-1 delay-300"></span>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Add Button instead of Search */}
            <div className="p-4 flex justify-end">
              <button
                onClick={() => navigate('/adduser')}
                className="border border-gray-400 px-4 py-1 rounded text-gray-700 hover:bg-gray-100 shadow-md"
              >
                Add
              </button>
            </div>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center">Full Name</th>
                  <th className="px-6 py-3 text-center">Username</th>
                  <th className="px-6 py-3 text-center">Work</th>
              
                  <th className="px-6 py-3 text-center">Role</th>
                  <th className="px-6 py-3 text-center">Enabled</th>
                  <th className="px-6 py-3 text-center">Edit</th>
                  <th className="px-6 py-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.reverse().map((item) => (
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">{item.fullName}</td>
                    <td className="px-6 py-4 text-center">{item.username}</td>
                    <td className="px-6 py-4 text-center">{item.work}</td>
                   
                    <td className="px-6 py-4 text-center">{item.role}</td>
                    <td className="px-6 py-4 text-center">
                      {item.enabled ? "Enabled" : "Disabled"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleUpdate(item)} className="text-blue-500 hover:text-blue-700">Edit</button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={(e) => handleDelete(e, item)} className="text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
