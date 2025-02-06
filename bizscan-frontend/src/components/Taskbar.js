import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaQrcode, FaListAlt, FaShieldAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../styles/Taskbar.css";

export default function Taskbar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!user

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="taskbar">
      <ul className="taskbar-menu">
        {isAuthenticated && (
          <>
            <li className="taskbar-item welcome-text">
              <div className="taskbar-link">
                <FaUserAlt className="taskbar-icon" />
                <span>{user.name}</span>
              </div>
            </li>
            <li className="taskbar-item">
              <Link to="/scan" className="taskbar-link">
                <FaQrcode className="taskbar-icon" />
                <span>Scan</span>
              </Link>
            </li>
            <li className="taskbar-item">
              <Link to="/dashboard" className="taskbar-link">
                <FaListAlt className="taskbar-icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="taskbar-item">
              <Link to="/security" className="taskbar-link">
                <FaShieldAlt className="taskbar-icon" />
                <span>Security</span>
              </Link>
            </li>
            <li className="taskbar-item">
              <Link to="/profile" className="taskbar-link">
                <FaUser className="taskbar-icon" />
                <span>Profile</span>
              </Link>
            </li>
            <li className="taskbar-item logout">
              <button onClick={handleLogout} className="taskbar-link">
                <FaSignOutAlt className="taskbar-icon" />
                <span>Logout</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
