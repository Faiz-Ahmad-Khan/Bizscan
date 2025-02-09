import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Security.css";

const Security = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setProfile(storedUser);
      setEmail(storedUser.email);
      setOldEmail(storedUser.email);
    }
  }, []);

  const handleEmailChange = async () => {
    if (!email) {
      toast.warn("Email cannot be empty.");
      return;
    }
    try {
      await axios.put(`http://localhost:8080/profile/${profile.id}/change-email`, { email });
      toast.success("Email updated successfully.");
      setOldEmail(email);
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email.");
      setEmail(oldEmail);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/profile/${profile.id}/change-password`, {
        oldPassword,
        newPassword
      });

      if (response.status === 200) {
        toast.success("Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Old password is incorrect.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/profile/${profile.id}`);
      localStorage.removeItem("user");
      toast.success("Account deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile.");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="security-container">
      <h2>Security Settings</h2>

      <div className="security-section">
        <h3>Change Email</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="update-button" onClick={handleEmailChange}>
          Update Email
        </button>
      </div>

      <div className="security-section">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="update-button" onClick={handlePasswordChange}>
          Update Password
        </button>
      </div>

      <div className="security-section delete-section">
        <h3>Delete Account</h3>
        <button className="delete-button" onClick={() => setIsDeleteModalOpen(true)}>
          Delete Account
        </button>
      </div>

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Profile</h3>
            <p>Are you sure you want to delete your profile <strong>{profile.name}</strong>?</p>
            <p>Type "<strong>{profile.name}</strong>" to confirm your action:</p>
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={handleDeleteAccount}
                disabled={confirmDelete !== profile.name}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
