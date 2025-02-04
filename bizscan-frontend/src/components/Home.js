import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FaQrcode, FaHome, FaListAlt, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home({ setIsAuthenticated }) {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    const requestBody = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to authenticate");
      }

      localStorage.setItem("user", JSON.stringify(data));
      setIsAuthenticated(true);
      navigate("/profile");

    } catch (error) {
      console.error("Authentication Error:", error);
      alert(error.message);
      setFormData({
        name: "",
        email: "",
        password: "",
    });
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">Smart Business Scanning, Simplified</h1>
        <p className="subtitle">Scan, track, and manage business instantly with BizScan.</p>
      </header>

      <main className="main-section">
        <div className="qr-section">
          <div className="qr-code">
            <FaQrcode className="qr-icon" />
          </div>
          <p className="qr-text">Scan the QR code to get started!</p>
        </div>

        <Card className="form-card">
          <CardContent>
            <h2 className="form-title">{isLogin ? "Login" : "Get Started"}</h2>
            <form className="form" onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button className="form-button" type="submit">
                {isLogin ? "Login" : "Get Started"}
              </Button>
            </form>
            <p className="switch-auth">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setIsLogin(!isLogin)} className="auth-link">
                {isLogin ? "Signup" : "Login"}
              </span>
            </p>
          </CardContent>
        </Card>
      </main>

      <section className="features-section">
        <div className="feature">
          <FaHome className="feature-icon" />
          <h3 className="feature-title">Home</h3>
          <p className="feature-text">Get started quickly with an intuitive home screen.</p>
        </div>
        <div className="feature">
          <Link to="/scan">
            <FaQrcode className="feature-icon" />
          </Link>
          <h3 className="feature-title">QR Scanning</h3>
          <p className="feature-text">Easily scan and generate QR codes.</p>
        </div>
        <div className="feature">
          <Link to="/dashboard">
            <FaListAlt className="feature-icon" />
          </Link>
          <h3 className="feature-title">Organized Dashboard</h3>
          <p className="feature-text">Track and manage your profiles efficiently.</p>
        </div>
        <div className="feature">
          <Link to="/security">
            <FaShieldAlt className="feature-icon" />
          </Link>
          <h3 className="feature-title">Secure Dashboard</h3>
          <p className="feature-text">Your data is safe and secure with BizScan.</p>
        </div>
      </section>
    </div>
  );
}
