import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaQrcode, FaListAlt, FaShieldAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../styles/Taskbar.css";

export default function Taskbar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="taskbar">
      <ul className="taskbar-menu">
        <li className="taskbar-item">
          <Link to="/" className="taskbar-link">
            <FaHome className="taskbar-icon" />
            <span>Home</span>
          </Link>
        </li>
        {isAuthenticated && (
          <>
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
            <li className="taskbar-item">
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
