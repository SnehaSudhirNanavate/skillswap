import React, { useEffect, useState } from "react";
import "./Matching.css";

const API_URL = "https://skillswap-backend.onrender.com";

function Matching() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Get profiles from MongoDB
  useEffect(() => {
    fetch(`${API_URL}/api/profile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        return response.json();
      })
      .then((data) => {
        setProfiles(data.profiles || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Unable to load profiles.");
        setLoading(false);
      });
  }, []);

  const currentProfile = profiles[currentIndex];

  const handleConnect = () => {
    if (!currentProfile) return;

    setMessage(`Connection request sent to ${currentProfile.name}!`);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setMessage("");
    }, 1200);
  };

  const handlePass = () => {
    if (!currentProfile) return;

    setMessage("Profile skipped");

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setMessage("");
    }, 700);
  };

  if (loading) {
    return (
      <div className="matching-page">
        <div className="matching-loading">
          <div className="loading-icon">✦</div>
          <h2>Finding your matches...</h2>
          <p>Looking through the SkillSwap community.</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="matching-page">
        <div className="no-matches">
          <div className="empty-icon">✦</div>

          <span className="match-label">SKILLSWAP</span>

          <h1>No more profiles</h1>

          <p>
            You've reached the end of the available profiles.
            Check again later for new students.
          </p>

          <button
            className="primary-match-button"
            onClick={() => window.location.reload()}
          >
            Refresh Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="matching-page">

      {/* NAVBAR */}
      <nav className="matching-navbar">

        <div
          className="matching-logo"
          onClick={() => (window.location.href = "/")}
        >
          Skill<span>Swap</span>
        </div>

        <div className="matching-nav-links">
          <button onClick={() => (window.location.href = "/")}>
            Dashboard
          </button>

          <button className="active">
            Discover
          </button>

          <button onClick={() => (window.location.href = "/resources")}>
            Resources
          </button>

          <button onClick={() => (window.location.href = "/chat")}>
            Chat
          </button>
        </div>

      </nav>


      {/* MAIN */}
      <main className="matching-main">

        <div className="matching-heading">

          <div>
            <span className="match-label">
              DISCOVER YOUR PEOPLE
            </span>

            <h1>
              Find your
              <span> SkillMatch.</span>
            </h1>

            <p>
              Connect with students who can teach what you want
              to learn — and learn from what they know.
            </p>
          </div>

          <div className="match-counter">
            <strong>
              {profiles.length - currentIndex}
            </strong>

            <span>profiles left</span>
          </div>

        </div>


        {/* MATCH CARD */}
        <div className="match-stage">

          <div className="match-card-large">

            {/* MATCH SCORE */}
            <div className="match-score">
              <strong>92%</strong>
              <span>MATCH</span>
            </div>


            {/* AVATAR */}
            <div className="large-avatar">
              {currentProfile.name
                ? currentProfile.name.charAt(0).toUpperCase()
                : "S"}
            </div>


            {/* PROFILE INFO */}
            <div className="profile-info">

              <h2>{currentProfile.name}</h2>

              <p className="profile-email">
                {currentProfile.email}
              </p>

            </div>


            {/* BIO */}
            {currentProfile.bio && (
              <div className="bio-box">
                <span>ABOUT</span>

                <p>{currentProfile.bio}</p>
              </div>
            )}


            {/* SKILLS */}
            <div className="match-section">

              <div className="section-title">
                <span>CAN TEACH</span>
              </div>

              <div className="match-tags">

                {(currentProfile.skills || []).length > 0 ? (
                  currentProfile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="skill-tag">
                    Skills not added
                  </span>
                )}

              </div>

            </div>


            {/* INTERESTS */}
            <div className="match-section">

              <div className="section-title">
                <span>INTERESTS</span>
              </div>

              <div className="match-tags">

                {(currentProfile.interests || []).length > 0 ? (
                  currentProfile.interests.map(
                    (interest, index) => (
                      <span
                        key={index}
                        className="interest-tag"
                      >
                        {interest}
                      </span>
                    )
                  )
                ) : (
                  <span className="interest-tag">
                    No interests added
                  </span>
                )}

              </div>

            </div>


            {/* ACTION BUTTONS */}
            <div className="match-actions">

              <button
                className="pass-button"
                onClick={handlePass}
                title="Pass"
              >
                <span>×</span>
              </button>

              <button
                className="connect-button"
                onClick={handleConnect}
              >
                <span>♥</span>
                Connect
              </button>

            </div>

          </div>

        </div>


        {/* NOTIFICATION */}
        {message && (
          <div className="match-notification">
            <span className="notification-icon">✓</span>
            {message}
          </div>
        )}

      </main>

    </div>
  );
}

export default Matching;