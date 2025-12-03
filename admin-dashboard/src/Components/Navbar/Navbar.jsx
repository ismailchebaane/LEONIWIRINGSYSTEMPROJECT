import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleSetting, setToggleSetting] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.sub || "Unknown");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div>
      {username ? (
        <div>
          <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
              <div className="flex items-center justify-start space-x-6">
  <button
    onClick={() => setToggleMenu(!toggleMenu)}
    type="button"
    aria-label="Toggle sidebar menu"
    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 
               dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        clipRule="evenodd"
      />
    </svg>
  </button>

  <Link
    to="/"
    className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-width after:duration-300 hover:after:w-full"
  >
    Dashboard
  </Link>

  <a 
    href="http://svtn3local01:4203" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-width after:duration-300 hover:after:w-full"
  >
    LEONI
  </a>
  <Link
    to="/prediction"
    className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-width after:duration-300 hover:after:w-full"
  >
    Prediction
  </Link>
</div>

                <div className="flex relative items-center">
                  <div className="flex items-center ml-3">
                    <div>
                      <button
                        onClick={() => setToggleSetting(!toggleSetting)}
                        type="button"
                        className="flex mr-6 text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-gray-200"
                      >
                        <AccountCircleIcon className="text-white" />
                      </button>
                    </div>
                    <div
                      className={
                        toggleSetting
                          ? "z-50 bg-white absolute top-4 right-0 my-4 text-base list-none rounded-2xl shadow-2xl"
                          : "hidden"
                      }
                    >
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                          Logged in with: <br />
                          {username}
                        </p>
                      </div>
                      <ul className="py-1">
                        <li>
                          <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Settings
                          </Link>
                        </li>
                        <li>
                          <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Sign out
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Sidebar */}
          <aside
            id="logo-sidebar"
            className={
              !toggleMenu
                ? "fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform hidden bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                : "fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            }
          >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
              <ul className="space-y-2">
              
                <li>
                  <Link to="/form" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100">
                    <CreateNewFolderIcon />
                    <span className="flex-1 ml-3 whitespace-nowrap">Form</span>
                  </Link>
                </li>
                <li>
                  <Link to="/equipments" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100">
                    <PrecisionManufacturingIcon />
                    <span className="flex-1 ml-3 whitespace-nowrap">Equipments</span>
                  </Link>
                </li>
               
             
                <li>
                  <Link to="/users" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100">
                    <GroupIcon />
                    <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
                  </Link>
                </li>
                <li>
                  <Link to="/notifications" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100">
                    <NotificationsIcon />
                    <span className="flex-1 ml-3 whitespace-nowrap">Notifications</span>
                  </Link>
                </li>
              
              </ul>
            </div>
          </aside>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
