import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);

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

  if (!profile) {
    return <div className="dashboard-container">Loading profile...</div>;
  }

  return (
    <div className="dashboard-container">
      {profile.headerImage && (
        <div className="header-image-container">
          <img
            src={`http://localhost:8080/uploads/${profile.headerImage}`}
            alt="Header"
            className="header-image"
          />
        </div>
      )}

      <div className="profile-content">
        <div className="profile-info">
          {profile.profileImage && (
            <img
              src={`http://localhost:8080/uploads/${profile.profileImage}`}
              alt="Profile"
              className="profile-image"
            />
          )}
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>

        <div className="profile-details">
          <p><strong>Description:</strong> {profile.description}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Phone Number:</strong> {profile.phoneNo}</p>
        </div>
      </div>
      {!userId && (
        <button className="edit-button" onClick={() => navigate("/profile")}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default Dashboard;
