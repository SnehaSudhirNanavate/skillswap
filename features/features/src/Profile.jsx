import React from "react";
import "./Profile.css";

function Profile() {

  const handleFindMatches = () => {
    // Go directly to the Matching page
    window.location.href = "/matching";
  };

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* Header */}
        <div className="profile-header">
          <div>
            <span className="small-title">✨ YOUR SKILLM8 PROFILE</span>

            <h1>Profile Ready!</h1>

            <p>
              Your profile is ready to discover students with
              compatible skills, interests and goals.
            </p>
          </div>
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
            onClick={() => window.location.href = "/profile"}
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