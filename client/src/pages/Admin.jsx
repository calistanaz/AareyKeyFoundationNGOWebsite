import React, { useEffect, useState } from "react";
import "../styles/Admin.css";
import { getUser } from "../utils/auth";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [assignmentType, setAssignmentType] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    text: "",
    isEvent: false,
    eventDate: "",
    isEmergency: false,
    isRescue: false,
    rescueLocation: "",
    rescueAnimal: "",
    rescuePeople: "",
    image: null,
  });

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    const d = new Date();
    setDate(d.toDateString());
  }, []);

  useEffect(() => {
    if (activeTab === "assignments") {  
      fetch("http://localhost:5000/api/assign") 
        .then(res => res.json())   
        .then(data => setAssignments(data)); 
    }
  }, [activeTab]);

  /* ===== HANDLE INPUT ===== */
  const handleChange = (e) => {  // universal handler for all form inputs
    const { id, value, type, checked } = e.target;  

    setForm({
      ...form,
      [id]:    
        type === "checkbox"
          ? checked
          : type === "file"
            ? e.target.files[0]
            : value,
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (section) setActiveTab(section);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/donations")
      .then(res => res.json())
      .then(data => setDonations(data))
      .catch(err => console.error(err));
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  /* ===== POST ANNOUNCEMENT ===== */
  const postEvents = async () => {
    if (!form.title || !form.text) {
      alert("Enter details");
      return;
    }

    try {
      let imageData = null;

      if (form.image) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          imageData = e.target.result;

          const res = await fetch("http://localhost:5000/api/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...form, image: imageData }),
          });

          const data = await res.json();
          console.log("POST RESPONSE:", data);

          fetchEvents(); // refresh UI
        };

        reader.readAsDataURL(form.image);
      } else {
        const res = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form, image: null }),
        });

        const data = await res.json();
        console.log("POST RESPONSE:", data);

        fetchEvents();
      }
    } catch (err) {
      console.error("POST ERROR:", err);
    }
  };

  /* ===== DELETE ===== */
  const deleteEvents = async (id) => {
    await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
    });

    fetchEvents();
  };

  const assignTask = async (volunteerEmail) => {
    await fetch("http://localhost:5000/api/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        volunteerEmail,
        task: assignmentType,
      }),
    });
  };

  const fetchVolunteers = () => {
    fetch("http://localhost:5000/api/volunteer/volunteers")
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.id - b.id);
        setVolunteers(sorted);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {

    if (activeTab === "profile" ||
      activeTab === "events" ||
      activeTab === "assignments" ||
      activeTab === "donations" ||
      activeTab === "messages"
    
    ) {
      fetchEvents();
      fetchVolunteers();
      fetchMessages();
      const interval = setInterval(() => {
        fetchVolunteers();
        fetchEvents();
        fetchMessages();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    const res = await fetch("http://localhost:5000/api/contact");
    const data = await res.json();
    setMessages(data);
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">

        {/* SIDEBAR */}
        <div className="adm-sidebar">
          <h2>DASHBOARD</h2>
          <a onClick={() => setActiveTab("profile")}>My Profile</a>
          <a onClick={() => setActiveTab("events")}>Events</a>
          <a onClick={() => setActiveTab("assignments")}>Work Assignments</a>
          <a onClick={() => setActiveTab("donations")}>Donation Records</a>
          <a onClick={() => setActiveTab("messages")}>Inquiry Details</a>
        </div>

        {/* MAIN */}
        <div className="adm-main">
          {/* TOP BAR */}
          <div className="top-bar">
            <h1>Admin Dashboard</h1>
            <p>{date}</p>
          </div>

          <h2>{user ? `Hello ${user.username}` : "Hello Admin"}</h2>

          <div id="dashboard" class="cards">

            <div class="card">
              <h3>Total Volunteers</h3>
              <p> {volunteers.length} </p>
            </div>

            <div class="card">
              <h3>Available Volunteers</h3>
              <p> {volunteers.filter(v => v.availability === "yes").length} </p>
            </div>

            <div class="card">
              <h3>Pending Tasks</h3>
              <p>{assignments.filter(a => a.status === "assigned").length}</p>
            </div>

            <div class="card">
              <h3>Ongoing Events</h3>
              <p> {events.length} </p>
            </div>
          </div>

          {/* PROFILE SECTION */}
          {activeTab === "profile" && (
            <>
              <div className="section">
                <h2>My Details</h2>
                <p>Name: {user?.username} </p>
                <p>Email: {user?.email} </p>
                <p>Contact no.: {user?.phoneNo} </p>
              </div>
            </>
          )}


          {/* EVENTS SECTION */}
          {activeTab === "events" && (
            <>
              <div className="section">

                <h2>Add Event</h2>

                <label className="event-checkbox">
                  <input type="checkbox" id="isEmergency" checked={form.isEmergency} onChange={handleChange} />
                  Emergency Alert 🚨
                </label>

                <label className="event-checkbox">
                  <input type="checkbox" id="isRescue" checked={form.isRescue} onChange={handleChange} />
                  Rescue Operation
                </label>

                {form.isRescue && (
                  <div className="rescue-box">
                    <div className="rescue-grid">
                      <input id="rescueLocation" value={form.rescueLocation} onChange={handleChange} placeholder="Rescue Location" />
                      <input id="rescueAnimal" value={form.rescueAnimal} onChange={handleChange} placeholder="Rescue Animal" />
                      <input id="rescuePeople" value={form.rescuePeople} onChange={handleChange} placeholder="People Required" />
                    </div>
                  </div>
                )}

                <input id="title" value={form.title} onChange={handleChange} placeholder="Event Title" />
                <textarea id="text" value={form.text} onChange={handleChange} placeholder="Event Details..." />

                <label className="event-checkbox">
                  <input type="checkbox" id="isEvent" checked={form.isEvent} onChange={handleChange} />
                  Select The Date of Event
                </label>

                {form.isEvent && (
                  <input type="date" id="eventDate" value={form.eventDate} onChange={handleChange} />
                )}

                <input type="file" id="image" accept="image/*" onChange={handleChange} />

                <button className="btn-primary" onClick={postEvents}>
                  Post Event
                </button>
              </div>
              <div className="section">

                <h2>Ongoing Events</h2>

                {events && events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="event-card">

                      <div className="event-header">
                        <h3>{event.title}</h3>
                        <span className="delete-btn" onClick={() => deleteEvents(event.id)}>🗑</span>
                      </div>

                      <p className="event-text">{event.text}</p>

                      {event.eventDate && (
                        <p className="event-date">
                          <strong>EVENT Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
                        </p>
                      )}

                      {/* TAGS */}
                      <div className="event-tags">
                        {event.isEmergency && <span className="tag emergency">🚨 EMERGENCY</span>}
                        {event.isRescue && <span className="tag rescue">Rescue Operation</span>}
                      </div>

                      {/* RESCUE DETAILS */}
                      {event.isRescue && (
                        <div className="rescue-details">
                          <p><strong>Location:</strong> {event.rescueLocation}</p>
                          <p><strong>Animal:</strong> {event.rescueAnimal}</p>
                          <p><strong>People Required:</strong> {event.rescuePeople}</p>
                        </div>
                      )}

                      {/* IMAGE */}
                      {event.image && (
                        <img src={event.image} alt="event" className="event-image" />
                      )}

                    </div>
                  ))
                ) : (
                  <p>No ongoing events</p>
                )}
              </div>
            </>
          )}

          {/* ASSIGNMENTS SECTION */}
          {activeTab === "assignments" && (
            <>
              <div className="section">

                <h2>Assign Work / Rescue Case</h2>

                <input
                  type="text"
                  placeholder="Assignment descripation..."
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value)}
                />

                <h2>Volunteers List :</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Sr. no</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Task Assignment</th>
                    </tr>
                  </thead>
                  {volunteers.length === 0 ? (
                    <p>No volunteers found</p>
                  ) : (
                    volunteers.map((v) => (
                      <tbody key={v.id} className="volunteer-card">
                        <td> {v.id} </td>
                        <td> {v.username} </td>
                        <td> {v.email} </td>
                        <td> {v.availability === "yes" ? "🟢 Available" : "🔴 Unavailable"} </td>

                        <td>
                          <button
                            onClick={() => assignTask(v.email)}
                            disabled={v.availability !== "yes"}
                          >
                            {v.availability === "yes" ? "Assign Task" : "Unavailable"}
                          </button>
                        </td>
                      </tbody>
                    ))
                  )}
                </table>
              </div>
              <div className="section">

                <h2>All Assigned Tasks</h2>

                {assignments.length === 0 ? (
                  <p>No assignments yet</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Task no.</th>
                        <th>Task</th>
                        <th>Volunteer Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(assignments) ? (
                        assignments
                          .sort((a, b) => a.id - b.id)
                          .map((a) => (
                            <tr key={a.id}>
                              <td>{a.id}</td>
                              <td>{a.task}</td>
                              <td>{a.volunteerEmail}</td>
                              <td>{a.status}</td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="4">Loading or no data...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {activeTab === "donations" && (
            <>
              <div className="section">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Amount (₹)</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>

                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td>{d.email}</td>
                        <td>{d.amount}</td>
                        <td>{d.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "messages" && (
            <>
              <div className="section">
                <h2>Contact Messages</h2>
                {messages.length === 0 ? (
                  <p>No messages available</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {messages.map((msg) => (
                        <tr key={msg.id}>
                          <td>{msg.name}</td>
                          <td>{msg.email}</td>
                          <td>{msg.subject}</td>
                          <td>{msg.message}</td>
                          <td>{new Date(msg.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;