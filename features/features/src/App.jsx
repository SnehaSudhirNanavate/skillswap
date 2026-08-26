import React, { useEffect, useMemo, useState } from "react";
const API_URL = "https://skillswap-lwpn.onrender.com";

const initialProfile = {
  name: "Sneha",
  age: "20",
  location: "Bangalore",
  language: "English",
  college: "ACS College of Engineering",
  course: "Computer Science",
  bio: "Student interested in learning and sharing technical skills.",
  knownSkills: ["React", "HTML", "CSS"],
  wantedSkills: ["Python", "UI/UX"],
};

const students = [
  {
    id: 1,
    name: "Ananya Sharma",
    age: 21,
    location: "Bangalore",
    language: "English",
    college: "Bangalore University",
    skills: ["Python", "Machine Learning", "SQL"],
    wants: ["React", "Web Development"],
    rating: 4.8,
    verified: true,
    match: 96,
    avatar: "AS",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    age: 20,
    location: "Bangalore",
    language: "English",
    college: "VTU",
    skills: ["UI/UX", "Figma", "Graphic Design"],
    wants: ["React", "JavaScript"],
    rating: 4.7,
    verified: true,
    match: 91,
    avatar: "RK",
  },
  {
    id: 3,
    name: "Priya Patil",
    age: 21,
    location: "Mysore",
    language: "Kannada",
    college: "Mysore University",
    skills: ["Java", "DSA", "C++"],
    wants: ["Python", "Machine Learning"],
    rating: 4.6,
    verified: true,
    match: 87,
    avatar: "PP",
  },
];

const preTest = [
  {
    q: "Which language is commonly used for data science?",
    options: ["HTML", "Python", "CSS", "XML"],
    answer: 1,
  },
  {
    q: "Which library is commonly used for Python data analysis?",
    options: ["React", "Pandas", "Express", "Bootstrap"],
    answer: 1,
  },
  {
    q: "What does AI stand for?",
    options: [
      "Automatic Internet",
      "Artificial Intelligence",
      "Advanced Interface",
      "Application Integration",
    ],
    answer: 1,
  },
];

const postTest = [
  {
    q: "After this learning session, which concept did you understand?",
    options: [
      "Basic concepts",
      "Advanced concepts",
      "Practical implementation",
      "All of the above",
    ],
    answer: 3,
  },
  {
    q: "How confident are you about applying the learned skill?",
    options: ["Not confident", "Slightly confident", "Confident", "Very confident"],
    answer: 3,
  },
  {
    q: "Would you recommend this learning partner?",
    options: ["No", "Maybe", "Yes", "Definitely"],
    answer: 3,
  },
];

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("skillswap_page") || "dashboard"
  );

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillswap_profile")) || initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [connections, setConnections] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillswap_connections")) || [];
    } catch {
      return [];
    }
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatStudent, setChatStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillswap_messages")) || [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState("");
  const [testType, setTestType] = useState(null);
  const [testIndex, setTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);

  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    localStorage.setItem("skillswap_page", page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("skillswap_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      "skillswap_connections",
      JSON.stringify(connections)
    );
  }, [connections]);

  useEffect(() => {
    localStorage.setItem("skillswap_messages", JSON.stringify(messages));
  }, [messages]);

  function notify(text) {
    setNotification(text);
    setTimeout(() => setNotification(""), 2500);
  }

  async function saveProfile(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      localStorage.setItem("skillswap_profile", JSON.stringify(profile));
      localStorage.setItem("skillswap_backend_profile", JSON.stringify(data.profile || profile));

      notify("Profile saved to backend successfully! ✓");
      setTimeout(() => setPage("matches"), 600);
    } catch (error) {
      console.error("Profile save error:", error);
      notify("Backend connection failed. Check that port 5050 is running.");
    }
  }

  function connect(student) {
    if (!connections.some((c) => c.id === student.id)) {
      setConnections([
        ...connections,
        {
          ...student,
          status: "Pending",
          connected: false,
        },
      ]);
      notify(`Connection request sent to ${student.name}`);
    } else {
      notify("Connection request already sent");
    }
  }

  function acceptConnection(student) {
    setConnections(
      connections.map((c) =>
        c.id === student.id
          ? { ...c, status: "Connected", connected: true }
          : c
      )
    );
    notify(`${student.name} is now connected`);
  }

  function startTest(type) {
    setTestType(type);
    setTestIndex(0);
    setTestScore(0);
    setTestFinished(false);
    setPage("test");
  }

  function answerTest(option) {
    const questions = testType === "pre" ? preTest : postTest;
    const current = questions[testIndex];

    const newScore =
      option === current.answer ? testScore + 1 : testScore;

    if (testIndex + 1 < questions.length) {
      setTestScore(newScore);
      setTestIndex(testIndex + 1);
    } else {
      setTestScore(newScore);
      setTestFinished(true);
    }
  }

  function openChat(student) {
    setChatStudent(student);
    setPage("chat");
  }

  function sendMessage() {
    if (!message.trim() || !chatStudent) return;

    const newMessage = {
      id: Date.now(),
      studentId: chatStudent.id,
      text: message,
      from: "me",
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  }

  function scheduleSession(e) {
    e.preventDefault();

    if (!schedule.date || !schedule.time) {
      notify("Please select date and time");
      return;
    }

    notify("Learning session scheduled!");
  }

  function disconnect(studentId) {
    setConnections(connections.filter((c) => c.id !== studentId));
    setChatStudent(null);
    notify("Connection removed");
    setPage("connections");
  }

  const connectedStudents = connections.filter((c) => c.connected);

  const stats = useMemo(
    () => ({
      matches: students.length,
      connections: connections.length,
      sessions: connectedStudents.length,
      points: 720 + connectedStudents.length * 50,
    }),
    [connections, connectedStudents.length]
  );

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          background: #f6f7fb;
          color: #182230;
        }

        button, input, textarea, select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app {
          min-height: 100vh;
          display: flex;
        }

        .sidebar {
          width: 250px;
          min-height: 100vh;
          background: #111827;
          color: white;
          padding: 25px 16px;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 10;
        }

        .logo {
          font-size: 25px;
          font-weight: 800;
          padding: 5px 12px 30px;
        }

        .logo span {
          color: #8b5cf6;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .nav button {
          border: 0;
          background: transparent;
          color: #cbd5e1;
          text-align: left;
          padding: 13px 14px;
          border-radius: 12px;
          transition: .2s;
        }

        .nav button:hover,
        .nav button.active {
          background: #7c3aed;
          color: white;
        }

        .main {
          margin-left: 250px;
          width: calc(100% - 250px);
          min-height: 100vh;
        }

        .topbar {
          height: 72px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: sticky;
          top: 0;
          z-index: 5;
        }

        .search {
          background: #f3f4f6;
          border: 0;
          padding: 11px 16px;
          border-radius: 12px;
          width: 280px;
          outline: none;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg,#8b5cf6,#ec4899);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
        }

        .content {
          padding: 30px;
          max-width: 1400px;
          margin: auto;
        }

        .welcome {
          margin-bottom: 25px;
        }

        .welcome h1 {
          font-size: 30px;
          margin-bottom: 7px;
        }

        .muted {
          color: #64748b;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .stat {
          background: white;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid #e5e7eb;
        }

        .stat h2 {
          font-size: 28px;
          margin-top: 10px;
        }

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #ede9fe;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 28px 0 16px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 22px;
          transition: .25s;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,.07);
        }

        .student-head {
          display: flex;
          gap: 14px;
          align-items: center;
          margin-bottom: 15px;
        }

        .student-avatar {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg,#8b5cf6,#ec4899);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .verified {
          color: #16a34a;
          font-size: 12px;
          font-weight: 700;
        }

        .match {
          background: #ecfdf5;
          color: #059669;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 700;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin: 12px 0;
        }

        .chip {
          background: #f1f5f9;
          color: #475569;
          padding: 6px 9px;
          border-radius: 8px;
          font-size: 12px;
        }

        .btn {
          border: 0;
          border-radius: 11px;
          padding: 11px 15px;
          font-weight: 700;
          transition: .2s;
        }

        .primary {
          background: #7c3aed;
          color: white;
        }

        .primary:hover {
          background: #6d28d9;
        }

        .secondary {
          background: #f1f5f9;
          color: #334155;
        }

        .danger {
          background: #fee2e2;
          color: #b91c1c;
        }

        .actions {
          display: flex;
          gap: 9px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        .profile-form {
          max-width: 850px;
          background: white;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field.full {
          grid-column: 1/-1;
        }

        .field input,
        .field textarea,
        .field select {
          border: 1px solid #dbe1e8;
          border-radius: 10px;
          padding: 12px;
          outline: none;
        }

        .field textarea {
          min-height: 100px;
          resize: vertical;
        }

        .profile-box {
          display: flex;
          gap: 25px;
          align-items: center;
          background: white;
          padding: 25px;
          border-radius: 20px;
          margin-bottom: 20px;
        }

        .big-avatar {
          width: 90px;
          height: 90px;
          border-radius: 25px;
          background: linear-gradient(135deg,#7c3aed,#ec4899);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: 800;
        }

        .test {
          max-width: 700px;
          margin: 30px auto;
        }

        .question-card {
          background: white;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid #e5e7eb;
        }

        .option {
          width: 100%;
          text-align: left;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          margin-top: 12px;
          padding: 15px;
          border-radius: 12px;
        }

        .option:hover {
          border-color: #8b5cf6;
          background: #f5f3ff;
        }

        .score {
          text-align: center;
          padding: 30px;
        }

        .chat {
          display: grid;
          grid-template-columns: 300px 1fr;
          height: calc(100vh - 132px);
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .chat-list {
          border-right: 1px solid #e5e7eb;
          padding: 15px;
        }

        .chat-person {
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
        }

        .chat-person:hover {
          background: #f3f4f6;
        }

        .chat-window {
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 18px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .bubble {
          max-width: 65%;
          padding: 11px 14px;
          border-radius: 15px;
          margin-bottom: 10px;
          background: #f1f5f9;
        }

        .bubble.me {
          margin-left: auto;
          background: #7c3aed;
          color: white;
        }

        .chat-input {
          display: flex;
          gap: 10px;
          padding: 15px;
          border-top: 1px solid #e5e7eb;
        }

        .chat-input input {
          flex: 1;
          border: 1px solid #dbe1e8;
          padding: 12px;
          border-radius: 11px;
        }

        .schedule {
          margin-top: 20px;
          background: #faf5ff;
          padding: 20px;
          border-radius: 16px;
        }

        .leaderboard {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .leader {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 22px;
          border-bottom: 1px solid #eef2f7;
        }

        .rank {
          width: 35px;
          font-weight: 800;
          color: #7c3aed;
        }

        .leader-info {
          flex: 1;
        }

        .points {
          font-weight: 800;
        }

        .notification {
          position: fixed;
          top: 85px;
          right: 25px;
          background: #111827;
          color: white;
          padding: 14px 20px;
          border-radius: 12px;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0,0,0,.2);
        }

        .empty {
          text-align: center;
          background: white;
          padding: 45px;
          border-radius: 18px;
          color: #64748b;
        }

        @media(max-width: 1000px) {
          .cards {
            grid-template-columns: repeat(2,1fr);
          }

          .stats {
            grid-template-columns: repeat(2,1fr);
          }
        }

        @media(max-width: 750px) {
          .sidebar {
            width: 70px;
            padding: 15px 8px;
          }

          .logo {
            font-size: 0;
            padding: 10px 8px 25px;
          }

          .logo span {
            font-size: 22px;
          }

          .nav button {
            font-size: 0;
            text-align: center;
          }

          .nav button::first-letter {
            font-size: 20px;
          }

          .main {
            margin-left: 70px;
            width: calc(100% - 70px);
          }

          .content {
            padding: 18px;
          }

          .topbar {
            padding: 0 15px;
          }

          .search {
            width: 150px;
          }

          .cards {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .chat {
            grid-template-columns: 1fr;
          }

          .chat-list {
            display: none;
          }
        }
      `}</style>

      {notification && <div className="notification">{notification}</div>}

      <aside className="sidebar">
        <div className="logo">
          Skill<span>Swap</span>
        </div>

        <div className="nav">
          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            className={page === "profile" ? "active" : ""}
            onClick={() => setPage("profile")}
          >
            👤 Profile Setup
          </button>

          <button
            className={page === "verification" ? "active" : ""}
            onClick={() => setPage("verification")}
          >
            ✓ Skill Verification
          </button>

          <button
            className={page === "matches" ? "active" : ""}
            onClick={() => setPage("matches")}
          >
            ✨ Find Matches
          </button>

          <button
            className={page === "connections" ? "active" : ""}
            onClick={() => setPage("connections")}
          >
            🤝 Connections
          </button>

          <button
            className={page === "chat" ? "active" : ""}
            onClick={() => setPage("chat")}
          >
            💬 Chat
          </button>

          <button
            className={page === "schedule" ? "active" : ""}
            onClick={() => setPage("schedule")}
          >
            📅 Schedule
          </button>

          <button
            className={page === "leaderboard" ? "active" : ""}
            onClick={() => setPage("leaderboard")}
          >
            🏆 Leaderboard
          </button>

          <button
            className={page === "notifications" ? "active" : ""}
            onClick={() => setPage("notifications")}
          >
            🔔 Notifications
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <input
            className="search"
            placeholder="Search students, skills..."
          />

          <div className="avatar">
            {profile.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
        </header>

        <div className="content">

          {page === "dashboard" && (
            <>
              <div className="welcome">
                <h1>Welcome back, {profile.name}! 👋</h1>
                <p className="muted">
                  Learn something new. Share what you know.
                </p>
              </div>

              <div className="stats">
                <div className="stat">
                  <div className="icon">👥</div>
                  <p className="muted">Potential Matches</p>
                  <h2>{stats.matches}</h2>
                </div>

                <div className="stat">
                  <div className="icon">🤝</div>
                  <p className="muted">Connections</p>
                  <h2>{stats.connections}</h2>
                </div>

                <div className="stat">
                  <div className="icon">📚</div>
                  <p className="muted">Sessions</p>
                  <h2>{stats.sessions}</h2>
                </div>

                <div className="stat">
                  <div className="icon">⭐</div>
                  <p className="muted">SkillSwap Points</p>
                  <h2>{stats.points}</h2>
                </div>
              </div>

              <div className="section-title">
                <h2>Top Matches</h2>
                <button
                  className="btn secondary"
                  onClick={() => setPage("matches")}
                >
                  View all
                </button>
              </div>

              <div className="cards">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    connect={connect}
                    openChat={openChat}
                  />
                ))}
              </div>
            </>
          )}

          {page === "profile" && (
            <>
              <div className="section-title">
                <div>
                  <h1>Complete Your Profile</h1>
                  <p className="muted">
                    Your profile helps us find better skill-exchange partners.
                  </p>
                </div>
              </div>

              <form className="profile-form" onSubmit={saveProfile}>
                <div className="profile-box">
                  <div className="big-avatar">
                    {profile.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>

                  <div>
                    <h2>{profile.name || "Your Name"}</h2>
                    <p className="muted">
                      Profile completion helps improve your matches.
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <Field
                    label="Full Name"
                    value={profile.name}
                    onChange={(v) => setProfile({ ...profile, name: v })}
                  />

                  <Field
                    label="Age"
                    value={profile.age}
                    onChange={(v) => setProfile({ ...profile, age: v })}
                  />

                  <Field
                    label="Location"
                    value={profile.location}
                    onChange={(v) =>
                      setProfile({ ...profile, location: v })
                    }
                  />

                  <Field
                    label="Language"
                    value={profile.language}
                    onChange={(v) =>
                      setProfile({ ...profile, language: v })
                    }
                  />

                  <Field
                    label="College / University"
                    value={profile.college}
                    onChange={(v) =>
                      setProfile({ ...profile, college: v })
                    }
                  />

                  <Field
                    label="Course / Major"
                    value={profile.course}
                    onChange={(v) =>
                      setProfile({ ...profile, course: v })
                    }
                  />

                  <div className="field full">
                    <label>Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Skills I Know</label>
                    <input
                      value={profile.knownSkills.join(", ")}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          knownSkills: e.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Skills I Want To Learn</label>
                    <input
                      value={profile.wantedSkills.join(", ")}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          wantedSkills: e.target.value
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="actions">
                  <button className="btn primary" type="submit">
                    Save Profile & Find Matches →
                  </button>
                </div>
              </form>
            </>
          )}

          {page === "verification" && (
            <>
              <div className="welcome">
                <h1>Skill Verification ✓</h1>
                <p className="muted">
                  Prove your knowledge before connecting with other students.
                </p>
              </div>

              <div className="card" style={{ maxWidth: 700 }}>
                <h2>Python Skill Test</h2>
                <p className="muted" style={{ marginTop: 8 }}>
                  Complete the MCQ assessment to receive your verified badge.
                </p>

                <div className="chips">
                  <span className="chip">10 Questions</span>
                  <span className="chip">MCQ</span>
                  <span className="chip">Verification Badge</span>
                </div>

                <button
                  className="btn primary"
                  onClick={() => startTest("pre")}
                >
                  Start Verification Test
                </button>
              </div>
            </>
          )}

          {page === "matches" && (
            <>
              <div className="welcome">
                <h1>Find Your Skill Match ✨</h1>
                <p className="muted">
                  AI-style matching based on skill fit, location and language.
                </p>
              </div>

              <div className="cards">
                {students.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    connect={connect}
                    openChat={openChat}
                    detailed
                  />
                ))}
              </div>
            </>
          )}

          {page === "connections" && (
            <>
              <div className="section-title">
                <div>
                  <h1>Your Connections</h1>
                  <p className="muted">
                    Manage your skill-exchange partners.
                  </p>
                </div>
              </div>

              {connections.length === 0 ? (
                <div className="empty">
                  <h2>No connections yet</h2>
                  <p>Find a student and send your first connection request.</p>
                  <button
                    className="btn primary"
                    onClick={() => setPage("matches")}
                    style={{ marginTop: 15 }}
                  >
                    Find Matches
                  </button>
                </div>
              ) : (
                <div className="cards">
                  {connections.map((student) => (
                    <div className="card" key={student.id}>
                      <div className="student-head">
                        <div className="student-avatar">{student.avatar}</div>
                        <div>
                          <h3>{student.name}</h3>
                          <p className="muted">
                            {student.location} • {student.language}
                          </p>
                        </div>
                      </div>

                      <p>
                        Status:{" "}
                        <strong
                          style={{
                            color:
                              student.status === "Connected"
                                ? "#16a34a"
                                : "#d97706",
                          }}
                        >
                          {student.status}
                        </strong>
                      </p>

                      <div className="actions">
                        {student.status === "Pending" ? (
                          <button
                            className="btn primary"
                            onClick={() => acceptConnection(student)}
                          >
                            Accept Request
                          </button>
                        ) : (
                          <>
                            <button
                              className="btn primary"
                              onClick={() => {
                                setChatStudent(student);
                                setPage("schedule");
                              }}
                            >
                              Schedule
                            </button>

                            <button
                              className="btn secondary"
                              onClick={() => openChat(student)}
                            >
                              Chat
                            </button>

                            <button
                              className="btn danger"
                              onClick={() => disconnect(student.id)}
                            >
                              Quit Connection
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {page === "chat" && (
            <>
              <div className="section-title">
                <div>
                  <h1>Messages 💬</h1>
                  <p className="muted">
                    Communicate with your learning partner.
                  </p>
                </div>
              </div>

              <div className="chat">
                <div className="chat-list">
                  <h3 style={{ marginBottom: 12 }}>Connections</h3>

                  {connectedStudents.length === 0 ? (
                    <p className="muted">
                      No connected students yet.
                    </p>
                  ) : (
                    connectedStudents.map((student) => (
                      <div
                        className="chat-person"
                        key={student.id}
                        onClick={() => setChatStudent(student)}
                      >
                        <strong>{student.name}</strong>
                        <p className="muted">{student.skills[0]}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="chat-window">
                  {chatStudent ? (
                    <>
                      <div className="chat-header">
                        <div>
                          <strong>{chatStudent.name}</strong>
                          <p className="muted">
                            ● Online • Skill Exchange
                          </p>
                        </div>

                        <button
                          className="btn secondary"
                          onClick={() => setPage("schedule")}
                        >
                          📅 Schedule
                        </button>
                      </div>

                      <div className="messages">
                        {messages.filter(
                          (m) => m.studentId === chatStudent.id
                        ).length === 0 && (
                          <p className="muted">
                            Start your conversation with {chatStudent.name}.
                          </p>
                        )}

                        {messages
                          .filter(
                            (m) => m.studentId === chatStudent.id
                          )
                          .map((m) => (
                            <div
                              key={m.id}
                              className={`bubble ${
                                m.from === "me" ? "me" : ""
                              }`}
                            >
                              {m.text}
                            </div>
                          ))}
                      </div>

                      <div className="chat-input">
                        <input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                          }}
                          placeholder="Type your message..."
                        />
                        <button
                          className="btn primary"
                          onClick={sendMessage}
                        >
                          Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="empty">
                      <h2>Select a connection</h2>
                      <p>Choose a connected student to start chatting.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {page === "schedule" && (
            <>
              <div className="welcome">
                <h1>Schedule Learning Session 📅</h1>
                <p className="muted">
                  Choose when you want to exchange your skills.
                </p>
              </div>

              {chatStudent && (
                <div className="card" style={{ maxWidth: 750 }}>
                  <div className="student-head">
                    <div className="student-avatar">
                      {chatStudent.avatar}
                    </div>

                    <div>
                      <h2>{chatStudent.name}</h2>
                      <p className="muted">
                        Learning partner • {chatStudent.location}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={scheduleSession}>
                    <div className="form-grid">
                      <div className="field">
                        <label>Date</label>
                        <input
                          type="date"
                          value={schedule.date}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="field">
                        <label>Time</label>
                        <input
                          type="time"
                          value={schedule.time}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              time: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="schedule">
                      <strong>Before joining the session:</strong>
                      <p className="muted">
                        You must complete the pre-session knowledge test.
                      </p>
                    </div>

                    <div className="actions">
                      <button className="btn primary" type="submit">
                        Confirm Schedule
                      </button>

                      <button
                        type="button"
                        className="btn secondary"
                        onClick={() => startTest("pre")}
                      >
                        Take Pre-Session Test
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}

          {page === "test" && (
            <div className="test">
              {!testFinished ? (
                <div className="question-card">
                  <p className="muted">
                    {testType === "pre"
                      ? "Pre-Session Knowledge Test"
                      : "Post-Session Learning Test"}
                  </p>

                  <h2 style={{ marginTop: 12 }}>
                    Question {testIndex + 1} /{" "}
                    {testType === "pre"
                      ? preTest.length
                      : postTest.length}
                  </h2>

                  <h2 style={{ marginTop: 25 }}>
                    {(testType === "pre"
                      ? preTest
                      : postTest)[testIndex].q}
                  </h2>

                  {(testType === "pre"
                    ? preTest
                    : postTest)[testIndex].options.map(
                    (option, index) => (
                      <button
                        className="option"
                        key={option}
                        onClick={() => answerTest(index)}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <div className="question-card score">
                  <div style={{ fontSize: 55 }}>🎉</div>

                  <h1>Test Completed!</h1>

                  <h2 style={{ marginTop: 15 }}>
                    Score: {testScore}/
                    {testType === "pre"
                      ? preTest.length
                      : postTest.length}
                  </h2>

                  {testType === "pre" && (
                    <p className="muted" style={{ marginTop: 10 }}>
                      Your skill verification result has been recorded.
                    </p>
                  )}

                  {testType === "post" && (
                    <p className="muted" style={{ marginTop: 10 }}>
                      Your learning progress has been recorded.
                    </p>
                  )}

                  <div className="actions" style={{ justifyContent: "center" }}>
                    <button
                      className="btn primary"
                      onClick={() =>
                        setPage(
                          testType === "pre"
                            ? "learning"
                            : "leaderboard"
                        )
                      }
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {page === "learning" && (
            <>
              <div className="welcome">
                <h1>Learning Session 📚</h1>
                <p className="muted">
                  Your skill-exchange session with your learning partner.
                </p>
              </div>

              <div className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    className="student-avatar"
                    style={{
                      margin: "0 auto 15px",
                      width: 70,
                      height: 70,
                      fontSize: 24,
                    }}
                  >
                    RK
                  </div>

                  <h2>Rahul Kumar</h2>

                  <p className="muted" style={{ marginTop: 8 }}>
                    UI/UX • Learning Partner
                  </p>

                  <div
                    style={{
                      marginTop: 25,
                      padding: 20,
                      borderRadius: 15,
                      background: "#f7f3ff",
                    }}
                  >
                    <h3>🎓 Skill Exchange Session</h3>
                    <p className="muted" style={{ marginTop: 10 }}>
                      Exchange your skills, discuss concepts, and learn together.
                    </p>
                  </div>

                  <div
                    className="cards"
                    style={{
                      marginTop: 25,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 15,
                    }}
                  >
                    <div className="card">
                      <h3>💡 Teaching</h3>
                      <p className="muted">
                        Share your knowledge and help your partner learn.
                      </p>
                    </div>

                    <div className="card">
                      <h3>📖 Learning</h3>
                      <p className="muted">
                        Learn new skills from your learning partner.
                      </p>
                    </div>
                  </div>

                  <div
                    className="actions"
                    style={{
                      justifyContent: "center",
                      marginTop: 25,
                    }}
                  >
                    <button
                      className="btn primary"
                      onClick={() => {
                        setTestType("post");
                        setTestIndex(0);
                        setTestScore(0);
                        setTestFinished(false);
                        setPage("test");
                      }}
                    >
                      Complete Session & Take Post-Test →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {page === "leaderboard" && (
            <>
              <div className="welcome">
                <h1>SkillSwap Leaderboard 🏆</h1>
                <p className="muted">
                  Earn points by learning, teaching and completing sessions.
                </p>
              </div>

              <div className="leaderboard">
                {[
                  ["1", "Ananya Sharma", "1,240", "Python"],
                  ["2", "Rahul Kumar", "1,080", "UI/UX"],
                  ["3", "Sneha", String(stats.points), "React"],
                  ["4", "Priya Patil", "650", "DSA"],
                  ["5", "Arjun Rao", "590", "Java"],
                ].map((item) => (
                  <div className="leader" key={item[1]}>
                    <div className="rank">#{item[0]}</div>

                    <div className="student-avatar">
                      {item[1]
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </div>

                    <div className="leader-info">
                      <strong>{item[1]}</strong>
                      <p className="muted">{item[3]} Specialist</p>
                    </div>

                    <div className="points">
                      ⭐ {item[2]}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {page === "notifications" && (
            <>
              <div className="welcome">
                <h1>Notifications 🔔</h1>
                <p className="muted">
                  Stay updated with your SkillSwap activity.
                </p>
              </div>

              <div className="cards">
                <div className="card">
                  <h3>🤝 New Connection Activity</h3>
                  <p className="muted">
                    Check your connection requests.
                  </p>
                </div>

                <div className="card">
                  <h3>📅 Session Reminder</h3>
                  <p className="muted">
                    Your upcoming skill-exchange session will appear here.
                  </p>
                </div>

                <div className="card">
                  <h3>🏆 Leaderboard Update</h3>
                  <p className="muted">
                    Complete more sessions to earn points.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StudentCard({
  student,
  connect,
  openChat,
  detailed = false,
}) {
  return (
    <div className="card">
      <div className="student-head">
        <div className="student-avatar">{student.avatar}</div>

        <div style={{ flex: 1 }}>
          <h3>{student.name}</h3>
          <p className="muted">
            {student.age} yrs • {student.location}
          </p>
        </div>

        <span className="match">{student.match}% Match</span>
      </div>

      {student.verified && (
        <div className="verified">✓ Skill Verified</div>
      )}

      <p className="muted" style={{ marginTop: 10 }}>
        🎓 {student.college}
      </p>

      <p className="muted" style={{ marginTop: 6 }}>
        🌐 {student.language}
      </p>

      <p style={{ marginTop: 14 }}>
        <strong>Can teach</strong>
      </p>

      <div className="chips">
        {student.skills.map((skill) => (
          <span className="chip" key={skill}>
            {skill}
          </span>
        ))}
      </div>

      <p>
        <strong>Wants to learn</strong>
      </p>

      <div className="chips">
        {student.wants.map((skill) => (
          <span className="chip" key={skill}>
            {skill}
          </span>
        ))}
      </div>

      <p style={{ marginTop: 10 }}>
        ⭐ {student.rating}
      </p>

      <div className="actions">
        <button
          className="btn primary"
          onClick={() => connect(student)}
        >
          🤝 Connect
        </button>

        {detailed && (
          <button
            className="btn secondary"
            onClick={() => openChat(student)}
          >
            View Profile
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default App;