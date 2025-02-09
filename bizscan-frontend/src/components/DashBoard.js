import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

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
    return <div className={styles.dashboardContainer}>Loading profile...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.sidebar}>
        {profile.profileImage && (
          <img
            src={`http://localhost:8080/uploads/${profile.profileImage}`}
            alt="Profile"
            className={styles.sidebarProfileImage}
          />
        )}
        <h2 className={styles.sidebarProfileName}>{profile.name}</h2>
        <ul className={styles.sidebarLinks}>
          <li>
            <a href="#home" onClick={() => setActiveSection("home")}>Home</a>
          </li>
          <li>
            <a href="#about" onClick={() => setActiveSection("about")}>About</a>
          </li>
          <li>
            <a href="#projects" onClick={() => setActiveSection("projects")}>Projects</a>
          </li>
          <li>
            <a href="#contact" onClick={() => setActiveSection("contact")}>Contact Us</a>
          </li>
          <li>
            {!userId && (
              <button
                className={styles.editButton}
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </button>
            )}
          </li>
        </ul>
      </nav>

      <div className={styles.mainContent}>
        {activeSection === "home" && (
          <section id="home" className={styles.homeSection}>
            <h1 className={styles.homeProfileName}>{profile.name} says Hi!</h1>
            {profile.carousels && profile.carousels.length > 0 && (
              <div className={styles.carouselGrid}>
                {profile.carousels.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8080/uploads/${image}`}
                    alt={`Carousel ${index + 1}`}
                    className={styles.carouselImage}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === "about" && (
          <section id="about" className={styles.aboutSection}>
            <h2>About Me</h2>
            <p>{profile.description}</p>
          </section>
        )}
        {activeSection === "projects" && (
          <section id="projects" className={styles.projectsSection}>
            <h2>My Projects</h2>
            {profile.services && profile.services.length > 0 ? (
            <div className={styles.servicesList}>
              {profile.services.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                  <p>{service.description}</p>
                  {service.imageUrl && (
                    <img
                      src={`http://localhost:8080/uploads/${service.imageUrl}`}
                      alt={`Service ${index + 1}`} 
                      className={styles.serviceImage}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No services available.</p>
          )}
          </section>
        )}
        {activeSection === "contact" && (
          <section id="contact" className={styles.contactSection}>
            <h2>Contact Us</h2>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phoneNo}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            {coordinates && (
              <div className={styles.mapContainer}>
                <MapContainer
                  center={coordinates}
                  zoom={18}
                  scrollWheelZoom={false}
                  className={styles.leafletMap}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={coordinates}
                    icon={L.divIcon({
                      className: styles.customPin,
                      html: "📍",
                      iconSize: [30, 30],
                      iconAnchor: [15, 30],
                    })}
                  >
                    <Popup>{profile.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
