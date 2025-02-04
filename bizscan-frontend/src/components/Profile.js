import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    profileImage: "",
    headerImage: "",
    description: "",
    location: "",
    phoneNo: ""
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [headerImageFile, setHeaderImageFile] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setProfile({
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        profileImage: storedUser.profileImage || "",
        headerImage: storedUser.headerImage || "",
        description: storedUser.description || "",
        location: storedUser.location || "",
        phoneNo: storedUser.phoneNo || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (e.target.name === "profileImage") {
        setProfileImageFile(file);
      } else if (e.target.name === "headerImage") {
        setHeaderImageFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", profile.id);
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("description", profile.description);
    formData.append("location", profile.location);
    formData.append("phoneNo", profile.phoneNo);

    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }

    if (headerImageFile) {
      formData.append("headerImage", headerImageFile);
    }

    try {
      const response = await axios.put(`http://localhost:8080/profile/${profile.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("Profile updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleGenerateQR = () => {
    navigate("/scan");
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {profile.headerImage && <img src={`http://localhost:8080/uploads/${profile.headerImage}`} alt="Header" className="header-image" />}
      <div className="profile-images">
        {profile.profileImage && <img src={`http://localhost:8080/uploads/${profile.profileImage}`} alt="Profile" />}
      </div>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={profile.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={profile.email} disabled />

        <label>Profile Image:</label>
        <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />

        <label>Header Image:</label>
        <input type="file" name="headerImage" accept="image/*" onChange={handleFileChange} />

        <label>Description:</label>
        <textarea name="description" value={profile.description} onChange={handleChange} />

        <label>Location:</label>
        <input type="text" name="location" value={profile.location} onChange={handleChange} />

        <label>Phone Number:</label>
        <input type="text" name="phoneNo" value={profile.phoneNo} onChange={handleChange} />

        <div className="button-group">
          <button type="submit">Update Profile</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        <button type="button" className="qr-button" onClick={handleGenerateQR}>
          Generate QR
        </button>
      </form>
    </div>
  );
};

export default Profile;
