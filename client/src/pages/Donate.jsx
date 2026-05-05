import React, { useState } from "react";
import "../styles/Donate.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Donate() {
  const [amount, setAmount] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    feedback: "",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      console.log("RESPONSE:", res);

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        return;
      }

      const data = await res.json();
      console.log("Saved:", data);

      setShowPopup(true);
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="donate-hero">
        <div className="donate-overlay">
          <h1>Give Wildlife a Second Chance</h1>
          <p>
            Your donation directly supports rescue operations,
            medical treatment, and habitat restoration.
          </p>
        </div>
      </section>

      {/* DONATION SECTION */}
      <section className="donation-section">
        <div className="donation-container">

          {/* RIGHT SIDE FORM */}
          <div className="donation-form">
            <h2>Make a Donation</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
              />
              
              <input
                type="number"
                name="amount"
                placeholder="Donation Amount (₹)"
                required
                onChange={handleChange}
              />

              <img src="/images/qr.jpeg" alt="QR Code" className="qr-image" />

              <input
                type="text"
                name="feedback"
                placeholder="Feedback"
                onChange={handleChange}
              />

              <button type="submit" className="pay-btn" onClick={() => console.log("Button")}>
                Submit Form
              </button>
            </form>

            <p className="secure-note">For more information do contact:<br></br>+91 8928179855</p>
          </div>
        </div>
      </section>

      {/* THANK YOU POPUP */}
      {showPopup && (
        <div className="popup">
          <div className="popup-box">
            <h2>Thank You for donating❤️</h2>
            <p>
              Your small help means a lot :)
            </p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Donate;