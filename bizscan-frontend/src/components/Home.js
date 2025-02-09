import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Home.css";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FaQrcode } from "react-icons/fa";

export default function Home({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleForm = () => setIsLogin((prev) => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is BizScan?",
      answer: "BizScan is a QR code-based user profile system that allows individuals and businesses to create digital profiles.",
    },
    {
      question: "How does the QR code system work?",
      answer: "When you create a profile on BizScan, a unique QR code is generated for you. Scanning it redirects users to your online profile.",
    },
    {
      question: "Can I update my profile after registration?",
      answer: "Yes! You can log in to your account and update your profile information anytime.",
    },
    {
      question: "Is BizScan free to use?",
      answer: "Yes, BizScan offers a free version for users. Future premium features may be introduced.",
    },
    {
      question: "Can I customize my QR code?",
      answer: "Yes, BizScan allows you to customize the design of your QR code with different colors and styles to match your branding.",
    }
  ];

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
      toast.error(error.message);
      setFormData({ name: "", email: "", password: "" });
    }
  };

  return (
    <div className="home-container">
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-left">BizScan</div>
        <ul className="nav-menu">
          <li><Link to="home" smooth={true} duration={500}>Home</Link></li>
          <li><Link to="about" smooth={true} duration={500}>About</Link></li>
          <li><Link to="faqs" smooth={true} duration={500}>FAQs</Link></li>
          <li><Link to="contact" smooth={true} duration={500}>Contact Us</Link></li>
        </ul>
        <div className="nav-right">
          <button className="nav-button" onClick={handleOpenModal}>Register</button>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="qr-code">
            <FaQrcode className="qr-icon" />
          </div>
          <h1 className="hero-title">Smart Business Scanning, Simplified</h1>
          <p className="hero-subtitle">Scan, track, and manage business instantly with BizScan</p>
          <Link to="about-section" smooth={true} duration={500}>
            <button className="hero-button">Learn More</button>
          </Link>
        </div>
      </section>

      <section id="about" className="content-section about-section">
        <div className="about-content">
          <h2 className="about-title">About BizScan</h2>
          <div className="slider">
            <div className="slider-line"></div>
            <div className="slider-circle"></div>
          </div>
          <div className="about-text">
            <p>
              BizScan is a modern QR code-based user profile system designed to simplify information sharing. Built using <strong>Java Spring Boot</strong>, BizScan allows individuals and businesses to create personalized profiles that can be accessed instantly by scanning a QR code.
            </p>
            <h3>How It Works</h3>
            <ul>
              <li><strong>User Registration</strong> – Users sign up and enter their personal or business details.</li>
              <li><strong>QR Code Generation</strong> – A unique QR code is created for each user, linking to their profile page.</li>
              <li><strong>Profile Access</strong> – When scanned, the QR code redirects to an online profile hosted on the platform.</li>
            </ul>
            <h3>Why Use BizScan?</h3>
            <ul>
              <li><strong>Eliminates Paper Business Cards</strong> – A digital alternative to traditional business cards.</li>
              <li><strong>Easy Information Sharing</strong> – Share your profile instantly with a single scan.</li>
              <li><strong>Customizable & Secure</strong> – Users can update their details anytime while keeping data secure.</li>
            </ul>
            <p>
              BizScan is an innovative and user-friendly solution that bridges the gap between technology and networking, making it easier for professionals, businesses, and individuals to share their identity effortlessly.
            </p>
          </div>
        </div>
      </section>

      <section id="faqs" className="content-section faqs-section">
        <h2 className="faqs-title">FAQs</h2>
        <div className="slider">
          <div className="slider-line"></div>
          <div className="slider-circle"></div>
        </div>
        <div className="faqs-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">{faq.question}
                <span className="faq-toggle-icon">
                  {activeIndex === index ? "▼" : "►"}
                </span>
              </div>
              {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="content-section contact-section">
        <h2 className="contact-title">Contact Us</h2>
        <div className="slider">
          <div className="slider-line"></div>
          <div className="slider-circle"></div>
        </div>
        <div className="contact-content">
          {/* Left Column: Contact Form */}
          <div className="contact-form">
            <h3>Get in Touch</h3>
            <form>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="4" placeholder="Enter your message" required></textarea>
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>

          {/* Right Column: Location and Map */}
          <div className="contact-info-map">
            <div className="contact-info">
              <h3>Our Location</h3>
              <p>Electronics City,</p>
              <p>Bangalore, Karnataka, India</p>

              <h3>Email Us</h3>
              <p>
                <a href="mailto:faizahmadkhan999@gmail.com" className="contact-email">
                  contact@bizscan.com
                </a>
              </p>
            </div>

            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62255.85694966864!2d77.65906625448491!3d12.841915285842014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6be5e3baffeb%3A0xdbcf72a139bed3a7!2sElectronic%20City%2C%20Bengaluru%2C%20Karnataka%20560099!5e0!3m2!1sen!2sin!4v1675718820282!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Map of Electronics City, Bangalore"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
                  <span onClick={toggleForm} className="auth-link">
                    {isLogin ? "Signup" : "Login"}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
