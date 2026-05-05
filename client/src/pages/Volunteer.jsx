import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";

import "../styles/Volunteer.css";
import Navbar from "../components/Navbar";

function VolunteerDashboard() {
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [availability, setAvailability] = useState("no");
  const [assignments, setAssignments] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // LOAD DATA
  useEffect(() => {
    const d = new Date();  
    setDate(d.toDateString());  

    const storedUser = getUser();   
    setUser(storedUser);   

    const storedEvents =
      JSON.parse(localStorage.getItem("events")) || [];  // Try to get events from localStorage, default to empty array
    setEvents(storedEvents);   
  }, []);  // Load availability

  // Load Assigned tasks
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));    

    fetch(`http://localhost:5000/api/assign/${user.email}`)  
      .then(res => res.json())  // Parse JSON response
      .then(data => {           // Log the data for debugging
        console.log("ASSIGNMENTS:", data);   // Update state with fetched assignments
        setAssignments(data);   // Store assignments in localStorage for persistence
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")  
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []); 

  const updateAvailability = async (value) => {  
    const user = JSON.parse(localStorage.getItem("user")); 

    console.log("SENDING EMAIL:", user.email); 

    const res = await fetch("http://localhost:5000/api/volunteer/availability", {  // API endpoint to update availability
      method: "PUT",  
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify({   
        email: user.email.trim().toLowerCase(), 
        availability: value,
      }),
    });

    const data = await res.json();  
    console.log("API RESPONSE:", data);  // Update local user data with new availability
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/assign/${id}`, {  
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }); 

      // update UI instantly
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))  // Update localStorage with new status
      );
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   if (activeTab === "profile" ||
  //     activeTab === "events" ||
  //     activeTab === "assignments"
  //   ) {
  //     updateStatus();
  //     fetchVolunteers();
  //     updateAvailability();
  //     const interval = setInterval(() => {
  //       updateStatus();
  //       assignTask();
  //       updateAvailability();
  //     }, 3000);
  //     return () => clearInterval(interval);
  //   }
  // }, [activeTab]);

  return (
    <>
      <Navbar />
      <div className="volunteer-container">
        {/* SIDEBAR */}
        <div className="vol-sidebar">
          <h2>DASHBOARD</h2>
          <a onClick={() => setActiveTab("profile")}>My Profile</a>
          <a onClick={() => setActiveTab("events")}>Events</a>
          <a onClick={() => setActiveTab("assignments")}>Work Assignments</a>
        </div>

        {/* MAIN */}
        <div className="vol-main">
          {/* TOP BAR */}
          <div className="top-bar">
            <div>
              <h1>Volunteer Dashboard</h1>
              <h3>
                {user?.username ? `Hello ${user.username}` : "Hello Volunteer"}
              </h3>
            </div>
            <p>{date}</p>
          </div>

          {/* PROFILE*/}
          {activeTab === "profile" && (
            <>
              <div id="profile" className="section">
                <h2>My Profile</h2>
                <p>Name: {user?.username}</p>
                <p>Email: {user?.email || "N/A"}</p>
                <p>Role: Volunteer</p>

                {/*  NEW DROPDOWN */}
                <label><b>Availability : </b></label>
                <select
                  value={availability}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setAvailability(value);
                    await updateAvailability(value);

                    const updatedUser = { ...user, availability: value };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                  }}
                >
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>
              </div>
            </>
          )}

          {/* events */}
          {activeTab === "events" && (
            <div className="section">
              <h2>Ongoing Events</h2>

              <div id="volunteerevents">
                {events && events.length > 0 ? (
                  events.map((a, index) => (
                    // const joined = joinedEvents.includes(index);
                    <div key={index} className="announcement-box">

                      {a.isEmergency && (
                        <div className="emergency-alert">
                          🚨 Emergency Alert
                        </div>
                      )}

                      <h3> {a.title} </h3>

                      {a.isEvent && (
                        <div className="announcement-footer">
                          <div className="event-info">
                            <span className="event-date">
                              Date: {a.eventDate}
                            </span>
                          </div>

                
                        </div>
                      )}

                      <p> Description:  {a.text} </p>

                      {a.image && (
                        <img src={a.image} className="announcement-img" />
                      )}

                      {a.isRescue && (
                        <div className="rescue-details">
                          <span className="rescue-tag">Rescue Operation</span>
                          <p><b>Location:</b> {a.rescueLocation}</p>
                          <p><b>Animal:</b> {a.rescueAnimal}</p>
                          <p><b>Volunteers Required:</b> {a.rescuePeople}</p>
                        </div>
                      )}
                    </div>
                  )
                  )
                ) : (
                  <p>No ongoing Events</p>
                )}
              </div>
            </div>
          )}

          {/* ASSIGNMENTS */}
          {activeTab === "assignments" && (
            <div id="assignments" className="section">
              <h2>My Assignments</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Task no.</th>
                      <th>Task Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length === 0 ? (
                      <tr>
                        <td colSpan="5">No assignments yet</td>
                      </tr>
                    ) : (
                      assignments
                        .sort((a, b) => a.id - b.id)
                        .map((a) => (
                          <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.task}</td>
                            <td>
                              <select
                                value={a.status}
                                onChange={(e) => updateStatus(a.id, e.target.value)}
                              >
                                <option value="assigned">Assigned</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default VolunteerDashboard;