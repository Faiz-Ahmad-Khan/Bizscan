import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    profileImage: "",
    description: "",
    location: "",
    phoneNo: "",
    carousels: [],
    services: []
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [carouselFiles, setCarouselFiles] = useState([]);
  const [serviceFiles, setServiceFiles] = useState([]);
  const [serviceDescriptions, setServiceDescriptions] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setProfile({
        ...storedUser,
        name: storedUser.name || "",
        email: storedUser.email || "",
        description: storedUser.description || "",
        location: storedUser.location || "",
        phoneNo: storedUser.phoneNo || "",
        profileImage: storedUser.profileImage || "",
        carousels: storedUser.carousels || [],
        services: storedUser.services || []
      });
      setCarouselFiles(new Array(storedUser.carousels?.length || 0).fill(null));
      setServiceFiles(new Array(storedUser.services?.length || 0).fill(null));
      setServiceDescriptions(storedUser.services ? storedUser.services.map(service => service.description || "") : []);
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value || "" });
  };

  const handleFileChange = (e, index = null, type = "") => {
    const file = e.target.files[0];
    if (file) {
      if (type === "carousel") {
        const updatedCarouselFiles = [...carouselFiles];
        updatedCarouselFiles[index] = file;
        setCarouselFiles(updatedCarouselFiles);
      } else if (type === "service") {
        const updatedServiceFiles = [...serviceFiles];
        updatedServiceFiles[index] = file;
        setServiceFiles(updatedServiceFiles);
      } else {
        setProfileImageFile(file);
      }
    }
  };

  const addCarousel = () => {
    setProfile({ ...profile, carousels: [...profile.carousels, ""] });
    setCarouselFiles([...carouselFiles, null]);
  };

  const deleteCarousel = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/profile/${profile.id}/carousel/${index}`);
      setProfile((prevProfile) => ({
        ...prevProfile,
        carousels: prevProfile.carousels.filter((_, i) => i !== index),
      }));

      setCarouselFiles((prev) => prev.filter((_, i) => i !== index));

      toast.success("Carousel image deleted successfully");
    } catch (error) {
      console.error("Error deleting carousel", error);
      toast.warn("No image to delete");
    }
  };

  const handleServiceChange = (e, index) => {
    const updatedServiceDescriptions = [...serviceDescriptions];
    updatedServiceDescriptions[index] = e.target.value || "";
    setServiceDescriptions(updatedServiceDescriptions);
  };
  const addService = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      services: [...prevProfile.services, { imageUrl: "", description: "" }]
    }));
  
    setServiceFiles([...serviceFiles, null]);
    setServiceDescriptions([...serviceDescriptions, ""]);
  };
  
  const deleteService = async (index) => {
    try {
      const response = await axios.delete(`http://localhost:8080/profile/${profile.id}/service/${index}`);
      setProfile((prevProfile) => ({
      ...prevProfile,
      services: response.data.services || [] 
    }));
  
      setServiceFiles((prev) => prev.filter((_, i) => i !== index));
      setServiceDescriptions((prev) => prev.filter((_, i) => i !== index));
  
      toast.success("Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service", error);
      toast.error("Failed to delete service");
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("description", profile.description);
    formData.append("location", profile.location);
    formData.append("phoneNo", profile.phoneNo);

    if (profileImageFile) formData.append("profileImage", profileImageFile);

    carouselFiles.forEach((file) => {
      if (file) formData.append("carouselImages", file);
    });

    serviceFiles.forEach((file, index) => {
      if (file) {
        formData.append("serviceImages", file);
      }
    });    
    
    serviceDescriptions.forEach((desc) => {
      formData.append("serviceDescriptions", desc);
    });    
    
    try {
      const response = await axios.put(
        `http://localhost:8080/profile/${profile.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setProfile(response.data);
      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>

      <div className="profile-images">
        {profile.profileImage && (
          <img
            src={`http://localhost:8080/uploads/${profile.profileImage}`}
            alt="Profile"
            width="100"
            height="100"
          />
        )}
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Profile Image:</label>
        <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />

        <label>Name:</label>
        <input type="text" name="name" value={profile.name || ""} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={profile.email || ""} disabled />

        <label>Description:</label>
        <textarea name="description" value={profile.description || ""} onChange={handleChange} />

        <label>Location:</label>
        <input type="text" name="location" value={profile.location || ""} onChange={handleChange} />

        <label>Phone Number:</label>
        <input type="text" name="phoneNo" value={profile.phoneNo || ""} onChange={handleChange} />

        <label>Carousel Images:</label>
        {(profile.carousels ?? []).map((image, index) => (
          <div key={index} className="carousel-entry">
            {image && (
              <img
                src={`http://localhost:8080/uploads/${image}`}
                alt={`Carousel ${index + 1}`}
                width="100"
                height="100"
              />
            )}
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index, "carousel")} />
            <button type="button" onClick={() => deleteCarousel(index)}>Delete</button>
          </div>
        ))}
        <button type="button" className="carousel-button" onClick={addCarousel}>
          {(profile.carousels?.length || 0) === 0 ? "Add an Image" : "Add Another Image"}
        </button>

        <label>Services:</label>
        {profile.services && profile.services.map((service, index) => (
          <div key={index} className="service-entry">
            <label>Service Image:</label>
            {service.imageUrl  && (
              <img 
                src={`http://localhost:8080/uploads/${service.imageUrl }`} 
                alt={`Service ${index + 1}`} 
                width="100" 
                height="100"
              />
            )}
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index, "service")} className="service-input"/>
            <label>Service Description:</label>
            <textarea value={serviceDescriptions[index] || ""} onChange={(e) => handleServiceChange(e, index)} />
            <button type="button" onClick={() => deleteService(index)}>Delete</button>
          </div>
        ))}
        <button type="button" className="service-button" onClick={addService}>
          {(profile.services?.length || 0) === 0 ? "Add a Service" : "Add Another Service"}
        </button>

        <div className="button-group">
          <button type="submit" className="update-button">Update Profile</button>
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
