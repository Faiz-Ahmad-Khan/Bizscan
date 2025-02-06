import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-scroll";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id) {
          fetchProfile(parsedUser.id);
        }
      }
    }
  }, [userId]);

  const fetchProfile = (id) => {
    axios
      .get(`http://localhost:8080/profile/${id}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  };

  useEffect(() => {
    if (profile?.location) {
      fetchCoordinates(profile.location);
    }
  }, [profile]);

  const fetchCoordinates = async (location) => {
    if (!location) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  if (!profile) {
    return <div className="dashboard-container">Loading profile...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">{profile.name}</div>
        <ul className="nav-links">
          <li><Link to="home" smooth={true} duration={500}>Home</Link></li>
          <li><Link to="about" smooth={true} duration={500}>About</Link></li>
          <li><Link to="projects" smooth={true} duration={500}>Projects</Link></li>
          <li><Link to="contact" smooth={true} duration={500}>Contact</Link></li>
        </ul>
      </nav>

      {/* Home Section */}
      <section id="home" className="home-section">
        {profile.headerImage && (
          <div className="header-image-container">
            <img
              src={`http://localhost:8080/uploads/${profile.headerImage}`}
              alt="Header"
              className="header-image"
            />
          </div>
        )}
        <div className="profile-info">
          {profile.profileImage && (
            <img
              src={`http://localhost:8080/uploads/${profile.profileImage}`}
              alt="Profile"
              className="profile-image"
            />
          )}
          <h1>{profile.name}</h1>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About Me</h2>
        <p>{profile.description}</p>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <h2>Projects</h2>
        <p>Coming Soon...</p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Contact Me</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phoneNo}</p>
        <p><strong>Location:</strong> {profile.location}</p>
        {coordinates && (
          <div className="map-container">
            <MapContainer center={coordinates} zoom={18} scrollWheelZoom={false} className="leaflet-map">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={coordinates} icon={L.divIcon({ className: "custom-pin", html: "📍", iconSize: [30, 30], iconAnchor: [15, 30] })}>
                <Popup>{profile.location}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </section>

      {/* Edit Button */}
      {!userId && (
        <button className="edit-button" onClick={() => navigate("/profile")}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default Dashboard;
