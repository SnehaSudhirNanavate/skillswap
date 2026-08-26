import React from "react";
import "./Matching.css";

function Matching() {

  const matches = [
    {
      name: "Rahul",
      emoji: "👨🏻‍💻",
      age: 21,
      location: "Bangalore",
      languages: ["Hindi", "English"],
      teaches: ["Python", "Java"],
      wants: ["UI/UX"],
      match: 96
    },

    {
      name: "Ananya",
      emoji: "👩🏻‍💻",
      age: 20,
      location: "Bangalore",
      languages: ["Hindi", "English"],
      teaches: ["UI/UX", "Figma"],
      wants: ["Python"],
      match: 92
    },

    {
      name: "Arjun",
      emoji: "👨🏻‍🎓",
      age: 22,
      location: "Mysore",
      languages: ["English", "Kannada"],
      teaches: ["React", "HTML/CSS"],
      wants: ["Java"],
      match: 84
    }
  ];

  return (
    <div className="matching-page">

      {/* Top navigation */}
      <nav className="matching-nav">

        <div className="logo">
          Skill<span>M8</span>
        </div>

        <div className="nav-links">
          <button onClick={() => window.location.href = "/profile"}>
            Profile
          </button>

          <button className="active">
            Matches
          </button>

          <button>
            💬 Chat
          </button>

          <button>
            🔔 Notifications
          </button>
        </div>

      </nav>


      {/* Main content */}
      <main className="matching-container">

        <div className="matching-heading">

          <div>
            <span className="eyebrow">
              ✨ AI-POWERED DISCOVERY
            </span>

            <h1>
              Find your
              <span> skill matches.</span>
            </h1>

            <p>
              We found students whose skills, interests,
              location and languages could match yours.
            </p>
          </div>

          <div className="match-count">
            <strong>{matches.length}</strong>
            <span>Potential Matches</span>
          </div>

        </div>


        {/* Match cards */}
        <div className="matches-grid">

          {matches.map((person, index) => (

            <div
              className="match-card"
              key={index}
            >

              {/* Match percentage */}
              <div className="match-score">
                <span>{person.match}%</span>
                <small>Match</small>
              </div>


              {/* Profile */}
              <div className="person-info">

                <div className="avatar">
                  {person.emoji}
                </div>

                <div>
                  <h2>{person.name}</h2>

                  <p>
                    📍 {person.location}
                  </p>

                  <p>
                    🎂 {person.age} years
                  </p>

                </div>

              </div>


              {/* Languages */}
              <div className="info-block">

                <h3>🗣️ Languages</h3>

                <div className="tags">

                  {person.languages.map((language) => (
                    <span key={language}>
                      {language}
                    </span>
                  ))}

                </div>

              </div>


              {/* Skills */}
              <div className="info-block">

                <h3>🚀 Can Teach</h3>

                <div className="tags purple">

                  {person.teaches.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>


              {/* Wants */}
              <div className="info-block">

                <h3>🎯 Wants To Learn</h3>

                <div className="tags pink">

                  {person.wants.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>


              {/* Action */}
              <button
                className="connect-button"
                onClick={() =>
                  alert(`Connection request sent to ${person.name}!`)
                }
              >
                💜 Connect
              </button>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Matching;