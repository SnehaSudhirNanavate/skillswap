import React, { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/api/profile")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.profiles.length > 0) {
          // Show the latest saved profile
          const latestProfile =
            data.profiles[data.profiles.length - 1];

          setProfile(latestProfile);
        }
      })
      .catch((error) => {
        console.error("Error loading profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleFindMatches = () => {
    window.location.href = "/matching";
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Loading Profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Header */}
        <div className="profile-header">
          <div>
            <span className="small-title">
              ✨ YOUR SKILLSWAP PROFILE
            </span>

            <h1>Profile Ready!</h1>

            <p>
              Your profile is ready to discover students with
              compatible skills, interests and goals.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-section">
          <h2>👤 Personal Information</h2>

          {profile ? (
            <div className="about-text">
              <p>
                <strong>Name:</strong> {profile.name}
              </p>

              <p>
                <strong>Age:</strong> {profile.age || "Not provided"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {profile.location || "Not provided"}
              </p>

              <p>
                <strong>Language:</strong>{" "}
                {profile.language || "Not provided"}
              </p>

              <p>
                <strong>College:</strong>{" "}
                {profile.college || "Not provided"}
              </p>

              <p>
                <strong>Course:</strong>{" "}
                {profile.course || "Not provided"}
              </p>
            </div>
          ) : (
            <p className="about-text">
              No profile has been saved yet.
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="profile-section">
          <h2>💻 I Can Teach</h2>

          <div className="skill-list">
            <span>Python</span>
            <span>Java</span>
            <span>C++</span>
            <span>Video Editing</span>
          </div>
        </div>

        {/* Learning */}
        <div className="profile-section">
          <h2>🎯 I Want To Learn</h2>

          <div className="skill-list learning">
            <span>React</span>
            <span>HTML/CSS</span>
            <span>UI/UX</span>
          </div>
        </div>

        {/* Interests */}
        <div className="profile-section">
          <h2>💖 Interests</h2>

          <div className="skill-list interests">
            <span>Technology</span>
            <span>Design</span>
            <span>Business</span>
          </div>
        </div>

        {/* About */}
        <div className="profile-section">
          <h2>📝 About Me</h2>

          <p className="about-text">
            I love learning new skills and sharing what I know
            with other students.
          </p>
        </div>

        {/* Buttons */}
        <div className="profile-actions">

          <button
            className="edit-button"
            onClick={() => {
              window.location.href = "/profile";
            }}
          >
            ✏️ Edit Profile
          </button>

          <button
            className="match-button"
            onClick={handleFindMatches}
          >
            💜 Find My Matches
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;