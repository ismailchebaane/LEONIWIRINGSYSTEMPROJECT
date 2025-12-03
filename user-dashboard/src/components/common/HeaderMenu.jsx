import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";

const TopNavbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [username, setUsername] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username || payload.sub);
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://svtn3local01:9095/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const countRes = await axios.get("http://svtn3local01:9095/api/notifications/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
      setUnreadCount(countRes.data);
    } catch (err) {
      console.error("Notification fetch error", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      await axios.post(`http://svtn3local01:9095/api/notifications/read/${notif.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowNotifications(false);
      fetchNotifications();
      navigate(`/read-write/${notif.equipmentSerialNumber}`);
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  };
  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation(); // Prevent click from triggering navigation
    try {
      await axios.delete(`http://svtn3local01:9095/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update notifications list after deletion
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };
  

  return (
    <header className="bg-bluedark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo or App Name */}
        <div className="flex items-center justify-start gap-6 w-full px-4">
  {/* LEONI Logo */}
  <Link to="/" className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
    LEONI
  </Link>

  {/* Vertical Divider */}
  <div className="w-px h-12 bg-white opacity-50"></div>

  {/* Dashboard Link */}
  <a 
    href="http://svtn3local01:4202" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white"
  >
    Dashboard
  </a>
</div>

        {/* Right side: Icons */}
        <div className="flex items-center space-x-6 relative">
          {/* Notification */}
          <div className="relative">
            <FaBell
              size={22}
              className="cursor-pointer hover:text-yellow-300 transition"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow">
                {unreadCount}
              </span>
            )}
            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white text-black shadow-2xl rounded-lg border border-gray-200 p-3 z-50">
                <h4 className="font-semibold text-sm mb-2">Notifications</h4>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notifications.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`group relative flex justify-between items-center text-sm p-2 mb-1 rounded ${
                        notif.read ? "text-gray-400 bg-gray-50" : "text-gray-800 bg-gray-100"
                      } hover:bg-blue-100 transition`}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notif)}
                      >
                        📄 {notif.message}
                      </div>
                  
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteNotification(e, notif.id)}
                        className="ml-2 text-xs text-red-500 hover:text-red-700"
                        title="Delete notification"
                      >
                        ✖
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
      {/* Profile */}
<div className="relative">
  {username ? (
    <>
      <FaUserCircle
        size={24}
        className="cursor-pointer hover:text-blue-300 transition"
        onClick={() => {
          setShowProfileMenu(!showProfileMenu);
          setShowNotifications(false);
        }}
      />
      {showProfileMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white text-black shadow-xl rounded-lg p-4 z-50 border border-gray-200">
          <p className="text-sm mb-3">
            👤 Logged in as<br />
            <strong>{username || "Unknown"}</strong>
          </p>
          <a
            className="block w-full text-center bg-bluedark hover:bg-blue-800 text-white py-1.5 px-4 rounded transition"
            href="/logout"
          >
            Logout
          </a>
        </div>
      )}
    </>
  ) : (
    <Link
      to="/login"
      className="text-white hover:text-blue-300 transition font-medium"
    >
      Login
    </Link>
  )}
</div>

        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
