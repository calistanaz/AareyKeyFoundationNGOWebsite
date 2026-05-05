import React, { useState } from "react";
import "../styles/Contact.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();

      console.log("RESPONSE:", data);

      alert("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      console.error("ERROR:", err);
      alert("Error sending message");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="contact-hero">
        <div className="hero-content">
          <p className="hero-small">REACH OUT</p>
          <h1>Contact Us</h1>
          <p className="hero-text">
            Whether you have questions, want to volunteer, or need to report a
            wildlife emergency — we're here to help.
          </p>
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="emergency-section">
        <div className="emergency-box">
          <div className="emergency-icon">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>

          <div>
            <h3>Wildlife Emergency?</h3>
            <p>
              If you've found an injured or distressed animal, call our 24/7
              emergency helpline immediately.
            </p>
            <span className="emergency-number">+91 09152202995</span>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section">
        <div className="contact-container">
          {/* FORM */}
          <div className="contact-form">
            <h2>Send Us a Message</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Message subject"
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  required
                />
              </div>

              <button type="submit" className="send-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* INFO */}
          <div className="contact-info">
            <h2>Get in Touch</h2>

            <div className="info-item">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <h4>Address</h4>
                <p>Aarey Colony, Goregaon East, Mumbai, Maharashtra 400065</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fa-solid fa-phone"></i>
              <div>
                <h4>Phone</h4>
                <p>+91 09152202995</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>aareykey@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fa-solid fa-clock"></i>
              <div>
                <h4>Office Hours</h4>
                <p>Mon-Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <h3 className="follow-title">Follow Us</h3>

            <div className="social-icons">
              <a
                href="https://www.instagram.com/aarey_key/?hl=en"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>

              <a
                href="https://facebook.com/aareykey"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>

              <a
                href="https://twitter.com/aareykey"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>

              <a
                href="https://www.youtube.com/@aareykeyfoundation7710"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Contact;
