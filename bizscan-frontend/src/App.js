import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Taskbar from "./components/Taskbar";
import Home from "./components/Home";
import Scan from "./components/Scan";
import Dashboard from "./components/DashBoard";
import Security from "./components/Security";
import Profile from "./components/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);
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
      </div>
    </Router>
  );
}

export default App;