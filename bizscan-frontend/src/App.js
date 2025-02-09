import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Taskbar from "./components/Taskbar";
import Home from "./components/Home";
import Scan from "./components/Scan";
import Dashboard from "./components/DashBoard";
import Security from "./components/Security";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (isAuthenticated) {
      document.body.classList.add("with-taskbar");
      document.body.classList.remove("no-taskbar");
    } else {
      document.body.classList.add("no-taskbar");
      document.body.classList.remove("with-taskbar");
    }
    setIsAuthenticated(!!user);
  }, [isAuthenticated]);
  return (
    <Router>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/security" element={<Security />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        {isAuthenticated && <Taskbar setIsAuthenticated={setIsAuthenticated} />}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </Router>
  );
}

export default App;