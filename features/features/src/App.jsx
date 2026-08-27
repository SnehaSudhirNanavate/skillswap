import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Edit3,
  FileCode2,
  Flame,
  GraduationCap,
  Heart,
  Home,
  LayoutDashboard,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

/* =========================================================
   API
========================================================= */

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5050"
    : "https://skillswap-lwpn.onrender.com";

/* =========================================================
   DEMO DATA
========================================================= */

const DEMO_STUDENTS = [
  {
    id: 1,
    name: "Ananya Sharma",
    initials: "AS",
    age: 21,
    location: "Bangalore",
    language: "English",
    college: "Bangalore University",
    skills: ["Python", "Machine Learning", "SQL"],
    wants: ["React", "Web Development"],
    match: 98,
    status: "Online",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    initials: "RK",
    age: 22,
    location: "Bangalore",
    language: "English",
    college: "PES University",
    skills: ["UI/UX", "Figma", "Design"],
    wants: ["JavaScript", "Python"],
    match: 94,
    status: "Online",
  },
  {
    id: 3,
    name: "Priya Patil",
    initials: "PP",
    age: 20,
    location: "Mysore",
    language: "English",
    college: "Mysore University",
    skills: ["DSA", "Java", "C++"],
    wants: ["React", "UI/UX"],
    match: 91,
    status: "Away",
  },
  {
    id: 4,
    name: "Arjun Rao",
    initials: "AR",
    age: 21,
    location: "Bangalore",
    language: "English",
    college: "RV College",
    skills: ["Java", "Spring Boot", "SQL"],
    wants: ["Python", "Machine Learning"],
    match: 88,
    status: "Online",
  },
  {
    id: 5,
    name: "Meera Nair",
    initials: "MN",
    age: 22,
    location: "Chennai",
    language: "English",
    college: "Anna University",
    skills: ["React", "JavaScript", "CSS"],
    wants: ["Python", "Data Science"],
    match: 86,
    status: "Online",
  },
  {
    id: 6,
    name: "Karan Shah",
    initials: "KS",
    age: 21,
    location: "Mumbai",
    language: "English",
    college: "Mumbai University",
    skills: ["Data Science", "Python", "Excel"],
    wants: ["UI/UX", "Figma"],
    match: 83,
    status: "Away",
  },
];

const NAVIGATION = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile Setup", icon: User },
  { id: "verification", label: "Skill Verification", icon: ShieldCheck },
  { id: "matches", label: "Find Matches", icon: Sparkles },
  { id: "connections", label: "Connections", icon: Users },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "sessions", label: "Sessions", icon: Video },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
];

const ACCOUNT_NAV = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState({
    name: "Sneha",
    email: "sneha@example.com",
    skills: ["React", "HTML", "CSS"],
    interests: ["Technology", "Design", "Business"],
    bio: "Student interested in learning and sharing technical skills.",
  });

  const [students] = useState(DEMO_STUDENTS);
  const [connections, setConnections] = useState([
    DEMO_STUDENTS[0],
    DEMO_STUDENTS[1],
  ]);

  const [activeChat, setActiveChat] = useState(DEMO_STUDENTS[0]);
  const [messages, setMessages] = useState([
    {
      from: "them",
      text: "Hey Sneha! I saw that you're learning React.",
    },
    {
      from: "me",
      text: "Yes! I would love to learn more about frontend development.",
    },
    {
      from: "them",
      text: "Perfect. I can help you with React and you can help me with Python.",
    },
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [profileSaving, setProfileSaving] = useState(false);

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return students;

    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(query) ||
        student.location.toLowerCase().includes(query) ||
        student.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        ) ||
        student.wants.some((skill) =>
          skill.toLowerCase().includes(query)
        )
      );
    });
  }, [search, students]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const navigate = (target) => {
    setPage(target);
  };

  const addConnection = (student) => {
    const exists = connections.some((item) => item.id === student.id);

    if (!exists) {
      setConnections((prev) => [...prev, student]);
      showToast(`${student.name} added to your connections`);
    } else {
      showToast("You are already connected");
    }
  };

  const sendMessage = () => {
    const clean = messageInput.trim();

    if (!clean) return;

    setMessages((prev) => [
      ...prev,
      {
        from: "me",
        text: clean,
      },
    ]);

    setMessageInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "them",
          text: "Sounds good! Let's work on it together.",
        },
      ]);
    }, 900);
  };

  const saveProfile = async () => {
    setProfileSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Profile saved successfully");
      } else {
        showToast(data.message || "Could not save profile", "error");
      }
    } catch (error) {
      showToast(
        "Backend unavailable. Check that your server is running.",
        "error"
      );
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="app">
      <style>{GLOBAL_STYLES}</style>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>

          <div>
            <div className="brand-name">
              Skill<span>Swap</span>
            </div>

            <div className="brand-tagline">
              LEARN. TEACH. CONNECT.
            </div>
          </div>
        </div>

        <div className="sidebar-section-title">WORKSPACE</div>

        <nav className="nav-list">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;

            return (
              <button
                key={item.id}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.id === "chat" && (
                  <span className="nav-badge">2</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-section-title account-title">
          ACCOUNT
        </div>

        <nav className="nav-list">
          {ACCOUNT_NAV.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;

            return (
              <button
                key={item.id}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.id === "notifications" && notifications > 0 && (
                  <span className="nav-badge">
                    {notifications}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar small-avatar">S</div>

          <div className="sidebar-user-info">
            <strong>{profile.name}</strong>
            <span>Student account</span>
          </div>

          <ChevronRight size={18} />
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="main">
        <header className="topbar">
          <div className="page-title">
            {getPageTitle(page)}
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students, skills..."
              />
            </div>

            <button
              className="icon-button notification-button"
              onClick={() => navigate("notifications")}
            >
              <Bell size={20} />

              {notifications > 0 && (
                <span className="notification-dot" />
              )}
            </button>

            <button
              className="profile-chip"
              onClick={() => navigate("profile")}
            >
              <div className="avatar tiny-avatar">S</div>
              <strong>{profile.name}</strong>
              <ChevronRight size={17} />
            </button>
          </div>
        </header>

        <div className="page-content">
          {page === "dashboard" && (
            <Dashboard
              profile={profile}
              students={students}
              connections={connections}
              navigate={navigate}
              showToast={showToast}
            />
          )}

          {page === "profile" && (
            <ProfilePage
              profile={profile}
              setProfile={setProfile}
              saveProfile={saveProfile}
              profileSaving={profileSaving}
              navigate={navigate}
            />
          )}

          {page === "verification" && (
            <VerificationPage showToast={showToast} />
          )}

          {page === "matches" && (
            <MatchesPage
              students={filteredStudents}
              addConnection={addConnection}
              navigate={navigate}
            />
          )}

          {page === "connections" && (
            <ConnectionsPage
              connections={connections}
              setActiveChat={setActiveChat}
              navigate={navigate}
              addConnection={addConnection}
            />
          )}

          {page === "chat" && (
            <ChatPage
              connections={connections}
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              messages={messages}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              sendMessage={sendMessage}
            />
          )}

          {page === "resources" && (
            <ResourcesPage
              navigate={navigate}
              showToast={showToast}
            />
          )}

          {page === "sessions" && (
            <SessionsPage showToast={showToast} />
          )}

          {page === "schedule" && (
            <SchedulePage showToast={showToast} />
          )}

          {page === "leaderboard" && <LeaderboardPage />}

          {page === "notifications" && (
            <NotificationsPage
              setNotifications={setNotifications}
              navigate={navigate}
            />
          )}

          {page === "settings" && (
            <SettingsPage profile={profile} setProfile={setProfile} />
          )}
        </div>
      </main>

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "error" ? (
            <X size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}

          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  profile,
  students,
  connections,
  navigate,
  showToast,
}) {
  return (
    <div className="dashboard">
      <section className="hero-card">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            SKILLS, NOT SCROLLING
          </div>

          <h1>
            Find someone
            <br />
            who <span>gets your goals.</span>
          </h1>

          <p>
            SkillSwap pairs students by what they can teach,
            what they want to learn, and how they actually fit.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => navigate("matches")}
            >
              Discover matches
              <ChevronRight size={20} />
            </button>

            <button
              className="secondary-button dark"
              onClick={() => navigate("profile")}
            >
              Complete profile
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="floating-note note-top">
            <CheckCircle2 size={17} />
            <span>Skill overlap found</span>
          </div>

          <div className="match-preview">
            <div className="match-percent">98% match</div>

            <div className="preview-avatar">
              AS
            </div>

            <h3>Ananya Sharma</h3>

            <p>Python · Machine Learning</p>

            <div className="preview-divider" />

            <div className="preview-location">
              <span>Location</span>
              <strong>Bangalore</strong>
            </div>

            <div className="preview-bottom">
              <Heart size={18} />
              <span>Strong skill overlap</span>
              <Zap size={17} />
            </div>
          </div>

          <div className="floating-note note-bottom">
            <Heart size={17} />
            <strong>3 connections</strong>
          </div>
        </div>
      </section>

      <section className="section-header">
        <div>
          <div className="eyebrow purple-text">
            YOUR SPACE
          </div>

          <h2>Keep your momentum.</h2>
        </div>

        <button
          className="text-button"
          onClick={() => navigate("profile")}
        >
          View profile
          <ChevronRight size={17} />
        </button>
      </section>

      <div className="stats-grid">
        <StatCard
          icon={<Sparkles />}
          number="98%"
          label="Best match"
          detail="Skill compatibility"
        />

        <StatCard
          icon={<Users />}
          number={connections.length}
          label="Connections"
          detail="Students in your network"
        />

        <StatCard
          icon={<Flame />}
          number="12"
          label="Learning streak"
          detail="Days this month"
        />

        <StatCard
          icon={<Trophy />}
          number="740"
          label="Skill points"
          detail="Keep climbing"
        />
      </div>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Recommended for you</h3>
              <p>Based on your skills and learning goals.</p>
            </div>

            <button
              className="icon-button"
              onClick={() => navigate("matches")}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mini-student-list">
            {students.slice(0, 3).map((student) => (
              <MiniStudent
                key={student.id}
                student={student}
                onConnect={() => {
                  showToast(`${student.name} looks like a great fit`);
                  navigate("matches");
                }}
              />
            ))}
          </div>
        </div>

        <div className="panel progress-panel">
          <div className="panel-header">
            <div>
              <h3>Profile strength</h3>
              <p>Make your profile easier to match.</p>
            </div>

            <span className="progress-number">82%</span>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: "82%" }} />
          </div>

          <div className="check-list">
            <div>
              <CheckCircle2 size={17} />
              <span>Basic information</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Skills added</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Interests added</span>
            </div>

            <div className="unfinished">
              <div className="empty-check" />
              <span>Add a short introduction</span>
            </div>
          </div>

          <button
            className="outline-button full"
            onClick={() => navigate("profile")}
          >
            Improve profile
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage({
  profile,
  setProfile,
  saveProfile,
  profileSaving,
  navigate,
}) {
  const update = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="content-narrow">
      <PageIntro
        eyebrow="YOUR PROFILE"
        title="Build your learning identity."
        description="Tell people what you can teach, what you want to learn, and what makes you curious."
      />

      <div className="profile-layout">
        <div className="panel profile-main">
          <div className="profile-heading">
            <div className="large-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{profile.name}</h2>
              <p>Student · SkillSwap member</p>
            </div>

            <span className="online-pill">
              <span />
              Active
            </span>
          </div>

          <div className="form-grid">
            <label>
              Full name
              <input
                value={profile.name}
                onChange={(e) =>
                  update("name", e.target.value)
                }
              />
            </label>

            <label>
              Email
              <input
                value={profile.email}
                onChange={(e) =>
                  update("email", e.target.value)
                }
              />
            </label>
          </div>

          <label className="form-label">
            About you
            <textarea
              value={profile.bio}
              onChange={(e) =>
                update("bio", e.target.value)
              }
              rows="5"
            />
          </label>

          <div className="profile-section">
            <div className="section-mini-heading">
              <div>
                <h3>Skills I can teach</h3>
                <p>What can you help another student with?</p>
              </div>

              <Code2 size={21} />
            </div>

            <div className="tag-editor">
              {profile.skills.map((skill) => (
                <span className="skill-tag purple" key={skill}>
                  {skill}

                  <button
                    onClick={() =>
                      update(
                        "skills",
                        profile.skills.filter(
                          (item) => item !== skill
                        )
                      )
                    }
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            <input
              className="tag-input"
              placeholder="Type a skill and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = e.target.value.trim();

                  if (
                    value &&
                    !profile.skills.includes(value)
                  ) {
                    update("skills", [
                      ...profile.skills,
                      value,
                    ]);
                    e.target.value = "";
                  }
                }
              }}
            />
          </div>

          <div className="profile-section">
            <div className="section-mini-heading">
              <div>
                <h3>Interests</h3>
                <p>Topics you enjoy exploring.</p>
              </div>

              <Sparkles size={21} />
            </div>

            <div className="tag-editor">
              {profile.interests.map((interest) => (
                <span className="skill-tag lime" key={interest}>
                  {interest}

                  <button
                    onClick={() =>
                      update(
                        "interests",
                        profile.interests.filter(
                          (item) => item !== interest
                        )
                      )
                    }
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              className="outline-button"
              onClick={() => navigate("dashboard")}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              onClick={saveProfile}
              disabled={profileSaving}
            >
              {profileSaving ? "Saving..." : "Save profile"}
              <Check size={18} />
            </button>
          </div>
        </div>

        <div className="panel profile-side">
          <div className="eyebrow purple-text">
            PROFILE PREVIEW
          </div>

          <div className="preview-user">
            <div className="large-avatar purple-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <h3>{profile.name}</h3>

            <p>Bangalore · Student</p>
          </div>

          <div className="preview-line" />

          <div className="preview-label">
            CAN TEACH
          </div>

          <div className="tag-editor">
            {profile.skills.map((skill) => (
              <span className="small-tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>

          <div className="preview-label">
            INTERESTED IN
          </div>

          <div className="tag-editor">
            {profile.interests.map((interest) => (
              <span className="small-tag light" key={interest}>
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VERIFICATION
========================================================= */

function VerificationPage({ showToast }) {
  const [verified, setVerified] = useState([
    true,
    true,
    false,
  ]);

  const verify = (index) => {
    setVerified((prev) =>
      prev.map((item, i) =>
        i === index ? true : item
      )
    );

    showToast("Skill verification completed");
  };

  const skills = [
    {
      title: "React Development",
      level: "Intermediate",
      icon: Code2,
    },
    {
      title: "HTML & CSS",
      level: "Advanced",
      icon: FileCode2,
    },
    {
      title: "Python",
      level: "Beginner",
      icon: Code2,
    },
  ];

  return (
    <div className="content-medium">
      <PageIntro
        eyebrow="TRUST LAYER"
        title="Show what you know."
        description="Verified skills help other students choose reliable learning partners."
      />

      <div className="verification-banner">
        <div className="verification-icon">
          <ShieldCheck size={30} />
        </div>

        <div>
          <h3>Build trust through verification.</h3>
          <p>
            Complete quick skill checks and display your
            verified abilities on your profile.
          </p>
        </div>

        <div className="verification-score">
          <strong>
            {verified.filter(Boolean).length}/3
          </strong>
          <span>verified</span>
        </div>
      </div>

      <div className="verification-grid">
        {skills.map((skill, index) => {
          const Icon = skill.icon;

          return (
            <div className="panel verification-card" key={skill.title}>
              <div className="verification-card-top">
                <div className="feature-icon">
                  <Icon size={22} />
                </div>

                {verified[index] && (
                  <span className="verified-badge">
                    <CheckCircle2 size={15} />
                    Verified
                  </span>
                )}
              </div>

              <h3>{skill.title}</h3>
              <p>{skill.level} skill level</p>

              <button
                className={
                  verified[index]
                    ? "outline-button full"
                    : "primary-button full"
                }
                onClick={() => verify(index)}
              >
                {verified[index]
                  ? "Verified"
                  : "Start verification"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   MATCHES
========================================================= */

function MatchesPage({
  students,
  addConnection,
  navigate,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState([]);

  const current = students[currentIndex % Math.max(students.length, 1)];

  const nextCard = (action) => {
    if (!current) return;

    if (action === "like") {
      addConnection(current);
      setLiked((prev) => [...prev, current.id]);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="matches-page">
      <div className="matches-intro">
        <div>
          <div className="eyebrow purple-text">
            DISCOVERY
          </div>

          <h1>
            Find your <span>skill match.</span>
          </h1>

          <p>
            Like a learning partner when your goals line up.
            No endless scrolling — just useful connections.
          </p>
        </div>

        <div className="match-counter">
          <strong>{students.length}</strong>
          <span>potential matches</span>
        </div>
      </div>

      {current ? (
        <div className="tinder-area">
          <div className="stack-card back-card">
            <div className="back-shape" />
          </div>

          <div className="stack-card middle-card">
            <div className="back-shape" />
          </div>

          <div className="match-card-main">
            <div className="match-card-header">
              <span className="match-label">
                <Sparkles size={15} />
                STRONG MATCH
              </span>

              <div className="match-score">
                {current.match}%
              </div>
            </div>

            <div className="big-match-avatar">
              {current.initials}
            </div>

            <h2>{current.name}</h2>

            <p className="match-subtitle">
              {current.age} · {current.location}
            </p>

            <div className="match-status">
              <span
                className={
                  current.status === "Online"
                    ? "status-online"
                    : "status-away"
                }
              />
              {current.status}
            </div>

            <div className="match-divider" />

            <div className="match-info-grid">
              <div>
                <span>CAN TEACH</span>

                <div className="tag-editor">
                  {current.skills.map((skill) => (
                    <span className="small-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span>WANTS TO LEARN</span>

                <div className="tag-editor">
                  {current.wants.map((skill) => (
                    <span
                      className="small-tag light"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="match-reason">
              <Zap size={16} />
              <span>
                Your learning goals have strong overlap.
              </span>
            </div>

            <div className="swipe-actions">
              <button
                className="swipe-button reject"
                onClick={() => nextCard("pass")}
              >
                <X size={25} />
              </button>

              <button
                className="swipe-button super"
                onClick={() => navigate("chat")}
              >
                <MessageCircle size={21} />
              </button>

              <button
                className="swipe-button like"
                onClick={() => nextCard("like")}
              >
                <Heart size={25} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <Sparkles size={40} />
          <h2>No more matches</h2>
          <p>Try another search or come back later.</p>
        </div>
      )}

      <div className="match-tip">
        <Sparkles size={16} />
        <span>
          Tip: A high match means your teach/learn goals
          complement each other.
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   CONNECTIONS
========================================================= */

function ConnectionsPage({
  connections,
  setActiveChat,
  navigate,
}) {
  return (
    <div className="content-medium">
      <PageIntro
        eyebrow="YOUR NETWORK"
        title="Connections that matter."
        description="Turn good matches into actual learning partnerships."
      />

      <div className="connection-stats">
        <div>
          <strong>{connections.length}</strong>
          <span>Total connections</span>
        </div>

        <div>
          <strong>3</strong>
          <span>Active today</span>
        </div>

        <div>
          <strong>7</strong>
          <span>Skills exchanged</span>
        </div>
      </div>

      <div className="connections-grid">
        {connections.map((student) => (
          <div className="panel connection-card" key={student.id}>
            <div className="connection-top">
              <div className="large-avatar purple-avatar">
                {student.initials}
              </div>

              <div className="connection-score">
                {student.match}%
              </div>
            </div>

            <h3>{student.name}</h3>

            <p>
              {student.location} · {student.college}
            </p>

            <div className="tag-editor">
              {student.skills.slice(0, 3).map((skill) => (
                <span className="small-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="connection-actions">
              <button
                className="outline-button"
                onClick={() => {
                  setActiveChat(student);
                  navigate("chat");
                }}
              >
                <MessageCircle size={17} />
                Message
              </button>

              <button
                className="primary-button"
                onClick={() => navigate("sessions")}
              >
                <Video size={17} />
                Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   CHAT
========================================================= */

function ChatPage({
  connections,
  activeChat,
  setActiveChat,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
}) {
  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div>
            <h2>Messages</h2>
            <p>{connections.length} connections</p>
          </div>

          <button className="icon-button">
            <Edit3 size={18} />
          </button>
        </div>

        <div className="chat-search">
          <Search size={17} />
          <input placeholder="Search conversations..." />
        </div>

        {connections.map((student) => (
          <button
            key={student.id}
            className={`chat-contact ${
              activeChat?.id === student.id ? "selected" : ""
            }`}
            onClick={() => setActiveChat(student)}
          >
            <div className="avatar contact-avatar">
              {student.initials}
            </div>

            <div className="contact-info">
              <strong>{student.name}</strong>
              <span>Let's exchange skills...</span>
            </div>

            <span className="contact-status" />
          </button>
        ))}
      </div>

      <div className="chat-window">
        {activeChat && (
          <>
            <div className="chat-header">
              <div className="chat-person">
                <div className="avatar contact-avatar">
                  {activeChat.initials}
                </div>

                <div>
                  <strong>{activeChat.name}</strong>
                  <span>
                    <i /> Online now
                  </span>
                </div>
              </div>

              <div className="chat-header-actions">
                <button className="icon-button">
                  <Video size={19} />
                </button>

                <button className="icon-button">
                  <MoreHorizontal size={19} />
                </button>
              </div>
            </div>

            <div className="messages">
              <div className="chat-date">
                TODAY
              </div>

              {messages.map((message, index) => (
                <div
                  className={`message-row ${
                    message.from === "me" ? "mine" : ""
                  }`}
                  key={index}
                >
                  <div className="message-bubble">
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-composer">
              <button className="composer-icon">
                <Plus size={19} />
              </button>

              <input
                value={messageInput}
                onChange={(e) =>
                  setMessageInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Write a message..."
              />

              <button
                className="send-button"
                onClick={sendMessage}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   RESOURCES
========================================================= */

function ResourcesPage({ navigate, showToast }) {
  return (
    <div className="content-medium">
      <div className="resources-heading">
        <PageIntro
          eyebrow="LEARNING HUB"
          title="Resources."
          description="Learn together with code, guides and useful project material."
        />

        <button
          className="primary-button"
          onClick={() =>
            showToast("Resource sharing opened")
          }
        >
          <Plus size={19} />
          Share resource
        </button>
      </div>

      <div className="coding-hero">
        <div className="coding-copy">
          <div className="eyebrow lime-text">
            <Code2 size={17} />
            COLLABORATIVE CODING
          </div>

          <h2>
            Build together,
            <br />
            <span>not alone.</span>
          </h2>

          <p>
            Open coding resources, discuss solutions with
            your connections and turn learning into a
            practical project.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("sessions")}
          >
            Open coding room
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="code-window">
          <div className="code-window-top">
            <div className="window-dots">
              <span />
              <span />
              <span />
            </div>

            <span>skill-exchange.jsx</span>

            <button
              className="code-copy"
              onClick={() => showToast("Code copied")}
            >
              <Copy size={15} />
            </button>
          </div>

          <div className="code-content">
            <div>
              <span className="line-number">01</span>
              <span className="keyword">function</span>{" "}
              <span className="function-name">
                SkillExchange
              </span>
              <span>() {"{"}</span>
            </div>

            <div>
              <span className="line-number">02</span>
              <span> return (</span>
            </div>

            <div>
              <span className="line-number">03</span>
              <span className="code-green">
                &lt;LearningRoom /&gt;
              </span>
            </div>

            <div>
              <span className="line-number">04</span>
              <span> )</span>
            </div>

            <div>
              <span className="line-number">05</span>
              <span>{"}"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="resource-grid">
        <ResourceCard
          icon={<Code2 />}
          title="Coding rooms"
          text="Solve problems together in focused learning spaces."
          action="Open room"
          onClick={() => navigate("sessions")}
        />

        <ResourceCard
          icon={<FileCode2 />}
          title="Project templates"
          text="Start projects faster with practical starter material."
          action="Explore"
          onClick={() => showToast("Project templates opened")}
        />

        <ResourceCard
          icon={<Sparkles />}
          title="Learning guides"
          text="Short guides built around real student goals."
          action="Browse"
          onClick={() => showToast("Learning guides opened")}
        />

        <ResourceCard
          icon={<BookOpen />}
          title="Shared notes"
          text="Exchange notes and useful study resources."
          action="Browse"
          onClick={() => showToast("Shared notes opened")}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SESSIONS
========================================================= */

function SessionsPage({ showToast }) {
  const [inSession, setInSession] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);

  if (inSession) {
    return (
      <div className="session-room">
        <div className="session-room-header">
          <div>
            <div className="eyebrow lime-text">
              LIVE LEARNING ROOM
            </div>
            <h2>React study session</h2>
          </div>

          <span className="live-pill">
            <span />
            LIVE
          </span>
        </div>

        <div className="video-grid">
          <div className="video-tile main-video">
            <div className="video-avatar">S</div>
            <span className="video-name">You</span>

            {!camera && (
              <div className="camera-off">
                Camera off
              </div>
            )}
          </div>

          <div className="video-tile">
            <div className="video-avatar purple">
              AS
            </div>
            <span className="video-name">
              Ananya Sharma
            </span>
          </div>
        </div>

        <div className="session-toolbar">
          <button
            className={`session-control ${
              muted ? "danger" : ""
            }`}
            onClick={() => setMuted((prev) => !prev)}
          >
            {muted ? <X size={20} /> : <MessageCircle size={20} />}
          </button>

          <button
            className={`session-control ${
              !camera ? "danger" : ""
            }`}
            onClick={() => setCamera((prev) => !prev)}
          >
            <Video size={20} />
          </button>

          <button
            className="leave-button"
            onClick={() => {
              setInSession(false);
              showToast("Session ended");
            }}
          >
            Leave session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-medium">
      <PageIntro
        eyebrow="SKILL EXCHANGE"
        title="Learning sessions."
        description="Meet your connections and turn matches into actual learning sessions."
      />

      <div className="session-hero">
        <div className="session-copy">
          <div className="eyebrow lime-text">
            <Video size={17} />
            VIDEO SESSION
          </div>

          <h2>
            Ready to
            <br />
            <span>exchange skills?</span>
          </h2>

          <p>
            Join a focused learning room with video, chat,
            shared resources and collaborative coding.
          </p>

          <button
            className="primary-button"
            onClick={() => setInSession(true)}
          >
            Start demo session
            <Video size={19} />
          </button>
        </div>

        <div className="video-preview">
          <div className="preview-video-tile">
            <span>AS</span>
            <small>Ananya</small>
          </div>

          <div className="preview-video-tile">
            <span>SN</span>
            <small>Sneha</small>
          </div>

          <div className="video-controls-preview">
            <MessageCircle size={16} />
            <Video size={16} />
            <div />
            <X size={16} />
          </div>
        </div>
      </div>

      <div className="session-features">
        <div>
          <Video size={21} />
          <strong>Video rooms</strong>
          <span>Learn face-to-face.</span>
        </div>

        <div>
          <MessageCircle size={21} />
          <strong>Live chat</strong>
          <span>Discuss while learning.</span>
        </div>

        <div>
          <Code2 size={21} />
          <strong>Shared coding</strong>
          <span>Build together.</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SCHEDULE
========================================================= */

function SchedulePage({ showToast }) {
  const sessions = [
    {
      time: "10:30 AM",
      title: "React fundamentals",
      person: "Ananya Sharma",
      type: "Video session",
    },
    {
      time: "02:00 PM",
      title: "UI/UX feedback",
      person: "Rahul Kumar",
      type: "Design review",
    },
    {
      time: "05:30 PM",
      title: "Python practice",
      person: "Karan Shah",
      type: "Coding room",
    },
  ];

  return (
    <div className="content-medium">
      <PageIntro
        eyebrow="YOUR CALENDAR"
        title="Make time to learn."
        description="Keep your skill exchanges organised and turn connections into consistent progress."
      />

      <div className="schedule-layout">
        <div className="panel calendar-card">
          <div className="calendar-header">
            <button className="icon-button">
              <ChevronRight
                size={18}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>

            <strong>August 2026</strong>

            <button className="icon-button">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="calendar-days">
            {["M", "T", "W", "T", "F", "S", "S"].map(
              (day, i) => (
                <span key={i}>{day}</span>
              )
            )}
          </div>

          <div className="calendar-numbers">
            {Array.from({ length: 31 }, (_, i) => (
              <button
                key={i}
                className={i + 1 === 27 ? "today" : ""}
                onClick={() =>
                  showToast(`August ${i + 1} selected`)
                }
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="panel upcoming-panel">
          <div className="panel-header">
            <div>
              <h3>Upcoming sessions</h3>
              <p>Your next learning blocks.</p>
            </div>

            <button
              className="primary-small"
              onClick={() =>
                showToast("New session creation opened")
              }
            >
              <Plus size={16} />
              New
            </button>
          </div>

          <div className="session-list">
            {sessions.map((session) => (
              <div className="scheduled-session" key={session.time}>
                <div className="session-time">
                  {session.time}
                </div>

                <div className="session-details">
                  <strong>{session.title}</strong>
                  <span>
                    {session.person} · {session.type}
                  </span>
                </div>

                <button className="icon-button">
                  <ChevronRight size={17} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LEADERBOARD
========================================================= */

function LeaderboardPage() {
  const board = [
    ["01", "Ananya Sharma", "1,240", "Python"],
    ["02", "Rahul Kumar", "1,080", "UI/UX"],
    ["03", "Sneha", "740", "React"],
    ["04", "Priya Patil", "650", "DSA"],
    ["05", "Arjun Rao", "590", "Java"],
  ];

  return (
    <div className="content-medium">
      <PageIntro
        eyebrow="COMMUNITY"
        title="SkillSwap leaderboard."
        description="Earn points by learning, teaching and completing sessions."
      />

      <div className="leaderboard-hero">
        <div className="leaderboard-rank">
          <Trophy size={34} />
          <span>YOUR RANK</span>
          <strong>#03</strong>
        </div>

        <div className="leaderboard-progress">
          <span>740 skill points</span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: "68%" }}
            />
          </div>
          <small>260 points to reach #02</small>
        </div>
      </div>

      <div className="panel leaderboard-table">
        <div className="leaderboard-head">
          <span>RANK</span>
          <span>STUDENT</span>
          <span>POINTS</span>
          <span>TOP SKILL</span>
        </div>

        {board.map((row) => (
          <div
            className={`leaderboard-row ${
              row[1] === "Sneha" ? "current-user" : ""
            }`}
            key={row[0]}
          >
            <strong>{row[0]}</strong>

            <div className="leader-person">
              <div className="avatar tiny-avatar">
                {row[1].charAt(0)}
              </div>

              <span>{row[1]}</span>
            </div>

            <strong>{row[2]}</strong>
            <span>{row[3]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationsPage({
  setNotifications,
  navigate,
}) {
  const notificationsList = [
    {
      icon: Link2,
      title: "New connection activity",
      text: "Ananya accepted your learning connection.",
      time: "8 min ago",
    },
    {
      icon: CalendarDays,
      title: "Session reminder",
      text: "Your React session starts today at 10:30 AM.",
      time: "32 min ago",
    },
    {
      icon: Trophy,
      title: "Leaderboard update",
      text: "You moved up to #3 this week.",
      time: "2 hrs ago",
    },
    {
      icon: MessageCircle,
      title: "New message",
      text: "Rahul sent you a message.",
      time: "Yesterday",
    },
  ];

  return (
    <div className="content-medium">
      <PageIntro
        eyebrow="ACTIVITY"
        title="Notifications."
        description="Stay updated with your SkillSwap activity."
      />

      <div className="notification-actions">
        <span>{notificationsList.length} updates</span>

        <button
          className="outline-button"
          onClick={() => setNotifications(0)}
        >
          <Check size={17} />
          Mark all read
        </button>
      </div>

      <div className="notifications-list">
        {notificationsList.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="panel notification-card" key={index}>
              <div className="notification-icon">
                <Icon size={21} />
              </div>

              <div className="notification-copy">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>

              <span>{item.time}</span>
            </div>
          );
        })}
      </div>

      <div className="notification-cta">
        <div>
          <h3>Want fewer distractions?</h3>
          <p>Control which updates SkillSwap sends you.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("settings")}
        >
          Notification settings
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({ profile, setProfile }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    profileVisible: true,
    matching: true,
  });

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="content-medium">
      <PageIntro
        eyebrow="PREFERENCES"
        title="Settings."
        description="Manage your SkillSwap experience."
      />

      <div className="settings-grid">
        <div className="panel settings-card">
          <div className="settings-heading">
            <Bell size={21} />
            <div>
              <h3>Notifications</h3>
              <p>Choose what you want to hear about.</p>
            </div>
          </div>

          <SettingRow
            title="Connection activity"
            description="Get notified when someone connects with you."
            value={settings.notifications}
            onChange={() => toggle("notifications")}
          />

          <SettingRow
            title="Email updates"
            description="Receive occasional learning updates."
            value={settings.emailUpdates}
            onChange={() => toggle("emailUpdates")}
          />
        </div>

        <div className="panel settings-card">
          <div className="settings-heading">
            <ShieldCheck size={21} />
            <div>
              <h3>Privacy</h3>
              <p>Control how other students discover you.</p>
            </div>
          </div>

          <SettingRow
            title="Profile visibility"
            description="Allow students to see your profile."
            value={settings.profileVisible}
            onChange={() => toggle("profileVisible")}
          />

          <SettingRow
            title="Smart matching"
            description="Use your skills and interests for matching."
            value={settings.matching}
            onChange={() => toggle("matching")}
          />
        </div>
      </div>

      <div className="panel account-settings">
        <div>
          <h3>Account</h3>
          <p>{profile.email}</p>
        </div>

        <button className="outline-button">
          <Edit3 size={17} />
          Edit account
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="page-intro">
      <div className="eyebrow purple-text">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function StatCard({ icon, number, label, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <strong>{number}</strong>
        <span>{label}</span>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function MiniStudent({ student, onConnect }) {
  return (
    <div className="mini-student">
      <div className="avatar mini-avatar">
        {student.initials}
      </div>

      <div className="mini-student-info">
        <strong>{student.name}</strong>
        <span>
          {student.skills.slice(0, 2).join(" · ")}
        </span>
      </div>

      <div className="mini-match">
        {student.match}%
      </div>

      <button
        className="icon-button"
        onClick={onConnect}
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

function ResourceCard({
  icon,
  title,
  text,
  action,
  onClick,
}) {
  return (
    <div className="resource-card">
      <div className="feature-icon">{icon}</div>

      <h3>{title}</h3>
      <p>{text}</p>

      <button
        className="text-button"
        onClick={onClick}
      >
        {action}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function SettingRow({
  title,
  description,
  value,
  onChange,
}) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        className={`switch ${value ? "on" : ""}`}
        onClick={onChange}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}

function getPageTitle(page) {
  const all = [...NAVIGATION, ...ACCOUNT_NAV];
  const found = all.find((item) => item.id === page);

  return found ? found.label : "Dashboard";
}

/* =========================================================
   PROFESSIONAL UI STYLES
========================================================= */

const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
  --bg: #f5f5f8;
  --surface: #ffffff;
  --surface-2: #f8f8fb;
  --ink: #111019;
  --muted: #777583;
  --line: #e6e4eb;

  --navy: #11111b;
  --navy-2: #181722;

  --purple: #7447ff;
  --purple-2: #9b6cff;

  --lime: #b7ff38;
  --lime-2: #d0ff70;

  --danger: #ef476f;

  --shadow:
    0 18px 55px rgba(22, 19, 35, 0.08);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: "DM Sans", Arial, sans-serif;
  background: var(--bg);
  color: var(--ink);
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* =====================================================
   APP
===================================================== */

.app {
  min-height: 100vh;
  display: flex;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(116, 71, 255, 0.055),
      transparent 28%
    ),
    var(--bg);
}

/* =====================================================
   SIDEBAR
===================================================== */

.sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--navy);
  color: white;
  padding: 28px 18px 18px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 30;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 12px 30px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: var(--purple);
  color: white;
  box-shadow: 0 8px 24px rgba(116, 71, 255, 0.3);
}

.brand-name {
  font-family: "Space Grotesk", sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.8px;
}

.brand-name span {
  color: var(--purple-2);
}

.brand-tagline {
  margin-top: 4px;
  font-size: 8px;
  letter-spacing: 1.8px;
  color: #9a98a7;
}

.sidebar-section-title {
  padding: 14px 12px 9px;
  color: #777586;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}

.account-title {
  margin-top: 16px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  width: 100%;
  border: 0;
  background: transparent;
  color: #b6b3c0;
  min-height: 44px;
  border-radius: 12px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 13px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-item:hover {
  color: white;
  background: rgba(255,255,255,0.06);
  transform: translateX(2px);
}

.nav-item.active {
  color: #11111b;
  background: var(--lime);
  box-shadow: 0 8px 25px rgba(183,255,56,0.16);
}

.nav-badge {
  margin-left: auto;
  min-width: 21px;
  height: 21px;
  padding: 0 6px;
  display: grid;
  place-items: center;
  border-radius: 99px;
  background: var(--purple);
  color: white;
  font-size: 10px;
  font-weight: 800;
}

.nav-item.active .nav-badge {
  background: #11111b;
  color: white;
}

.sidebar-user {
  margin-top: auto;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 17px 8px 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-user-info {
  flex: 1;
  min-width: 0;
}

.sidebar-user-info strong {
  display: block;
  font-size: 13px;
}

.sidebar-user-info span {
  display: block;
  color: #7e7b89;
  font-size: 10px;
  margin-top: 3px;
}

/* =====================================================
   MAIN
===================================================== */

.main {
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
}

.topbar {
  height: 84px;
  background: rgba(255,255,255,0.93);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px;
  position: sticky;
  top: 0;
  z-index: 20;
}

.page-title {
  color: #7b7886;
  font-size: 14px;
  font-weight: 700;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  width: 270px;
  height: 44px;
  background: #f3f3f7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  color: #888592;
}

.search-box input {
  border: 0;
  outline: 0;
  background: transparent;
  width: 100%;
  color: var(--ink);
}

.search-box input::placeholder {
  color: #9b98a5;
}

.icon-button {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: white;
  display: grid;
  place-items: center;
  color: #555260;
  transition: 0.2s ease;
}

.icon-button:hover {
  border-color: #cbc7d8;
  transform: translateY(-2px);
  color: var(--purple);
}

.notification-button {
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff587d;
  border: 1px solid white;
}

.profile-chip {
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--ink);
  padding: 3px 0 3px 4px;
}

.profile-chip strong {
  font-size: 13px;
}

.avatar {
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--purple);
  color: white;
  font-weight: 700;
}

.tiny-avatar {
  width: 37px;
  height: 37px;
  font-size: 13px;
}

.small-avatar {
  background: #24232d;
  border: 1px solid #3b3945;
}

.page-content {
  max-width: 1380px;
  margin: 0 auto;
  padding: 38px 42px 70px;
}

/* =====================================================
   GENERAL
===================================================== */

.page-intro {
  margin-bottom: 30px;
}

.page-intro h1 {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(36px, 4vw, 58px);
  line-height: 1;
  letter-spacing: -2.5px;
  margin: 10px 0 12px;
}

.page-intro p {
  color: var(--muted);
  max-width: 650px;
  line-height: 1.65;
  font-size: 16px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #aaa7b4;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2.5px;
}

.purple-text {
  color: #9479c6;
}

.lime-text {
  color: var(--lime);
}

.primary-button,
.secondary-button,
.outline-button {
  min-height: 48px;
  padding: 0 20px;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 800;
  border: 0;
  transition: 0.2s ease;
}

.primary-button {
  background: var(--lime);
  color: #101015;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(183,255,56,0.22);
}

.secondary-button {
  background: rgba(255,255,255,0.04);
  color: white;
}

.secondary-button.dark {
  border: 1px solid rgba(255,255,255,0.2);
}

.outline-button {
  background: white;
  color: #25232e;
  border: 1px solid var(--line);
}

.outline-button:hover {
  border-color: #bdb7ce;
  transform: translateY(-2px);
}

.outline-button.full,
.primary-button.full {
  width: 100%;
}

.text-button {
  background: transparent;
  border: 0;
  color: var(--purple);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 800;
  padding: 5px 0;
}

.panel {
  background: white;
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.panel-header h3 {
  margin: 0 0 5px;
  font-family: "Space Grotesk", sans-serif;
  font-size: 18px;
}

.panel-header p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

/* =====================================================
   HERO
===================================================== */

.hero-card {
  min-height: 500px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;

  background:
    radial-gradient(
      circle at 80% 40%,
      rgba(116, 71, 255, 0.32),
      transparent 32%
    ),
    #111019;

  color: #ffffff;

  display: grid;
  grid-template-columns: 1.05fr 0.95fr;

  padding: 62px;

  box-shadow: 0 28px 70px rgba(15, 13, 25, 0.2);

  animation: rise 0.65s ease;
}

.hero-content {
  align-self: center;
  position: relative;
  z-index: 2;

  color: #ffffff;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;

  background: var(--lime);

  box-shadow:
    0 0 0 5px rgba(183, 255, 56, 0.1);
}

.hero-card h1 {
  font-family: "Space Grotesk", sans-serif;

  font-size: clamp(48px, 5vw, 76px);

  line-height: 0.94;

  letter-spacing: -4px;

  margin: 18px 0;

  max-width: 700px;

  /* FIXED TEXT COLOR */
  color: #ffffff !important;
}

.hero-card h1 span {
  color: var(--lime) !important;
}

.hero-card p {
  color: #d0ccd8 !important;

  line-height: 1.65;

  font-size: 16px;

  max-width: 550px;
}

.hero-actions {
  display: flex;

  gap: 12px;

  margin-top: 28px;
}

.hero-visual {
  position: relative;

  min-height: 370px;
}

.orbit {
  position: absolute;

  border: 1px solid rgba(255, 255, 255, 0.09);

  border-radius: 50%;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);
}

.orbit-one {
  width: 440px;
  height: 440px;
}

.orbit-two {
  width: 330px;
  height: 330px;
}

.match-preview {
  position: absolute;

  width: 285px;

  background: #ffffff;

  color: #14121b;

  border-radius: 23px;

  padding: 25px;

  left: 50%;
  top: 50%;

  transform:
    translate(-40%, -48%)
    rotate(5deg);

  box-shadow:
    0 35px 70px rgba(0, 0, 0, 0.3);
}

.match-percent {
  display: inline-flex;

  background: #eee9ff;

  color: var(--purple);

  padding: 8px 11px;

  border-radius: 99px;

  font-size: 10px;

  font-weight: 800;
}

.preview-avatar,
.big-match-avatar {
  display: grid;

  place-items: center;

  background:
    linear-gradient(
      135deg,
      #7142ff,
      #a274ff
    );

  color: #ffffff;

  font-family: "Space Grotesk", sans-serif;

  font-weight: 700;
}

.preview-avatar {
  width: 70px;
  height: 70px;

  border-radius: 18px;

  margin: 22px auto 14px;

  font-size: 25px;
}

.match-preview h3 {
  text-align: center;

  margin: 0;

  font-family: "Space Grotesk", sans-serif;

  font-size: 20px;

  color: #14121b;
}

.match-preview > p {
  color: #77727f !important;

  text-align: center;

  margin: 7px 0 20px;

  font-size: 12px;
}

.preview-divider {
  height: 1px;

  background: #ebe9ef;
}

.preview-location {
  display: flex;

  justify-content: space-between;

  padding: 15px 0;

  font-size: 11px;

  color: #292630;
}

.preview-location span {
  color: #77727f;
}

.preview-bottom {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #77727f;

  font-size: 10px;
}

.preview-bottom svg:first-child {
  color: var(--purple);
}

.preview-bottom svg:last-child {
  margin-left: auto;
}

.floating-note {
  position: absolute;

  background: #ffffff;

  color: #292630;

  border-radius: 13px;

  padding: 14px 16px;

  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 10px;

  box-shadow:
    0 18px 35px rgba(0, 0, 0, 0.2);

  z-index: 3;
}

.floating-note svg {
  color: var(--purple);
}

.note-top {
  right: 3%;
  top: 4%;
}

.note-bottom {
  left: 7%;
  bottom: 6%;
}


/* =====================================================
   RESOURCES
===================================================== */

.resources-heading {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;
}

.resources-heading .page-intro {
  margin-bottom: 25px;
}

.coding-hero,
.session-hero {
  min-height: 400px;

  background:
    radial-gradient(
      circle at 90% 100%,
      rgba(116, 71, 255, 0.33),
      transparent 30%
    ),
    #111019;

  color: #ffffff;

  border-radius: 28px;

  padding: 48px;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 45px;

  align-items: center;

  box-shadow:
    0 28px 65px rgba(20, 18, 30, 0.25);
}

.coding-copy,
.session-copy {
  color: #ffffff;
}

.coding-copy h2,
.session-copy h2 {
  font-family: "Space Grotesk", sans-serif;

  font-size: clamp(38px, 4vw, 58px);

  line-height: 0.98;

  letter-spacing: -3px;

  margin: 25px 0;

  /* FIXED */
  color: #ffffff !important;
}

.coding-copy h2 span,
.session-copy h2 span {
  color: var(--lime) !important;
}

.coding-copy p,
.session-copy p {
  color: #d0ccd8 !important;

  line-height: 1.65;

  font-size: 14px;

  max-width: 500px;

  margin-bottom: 25px;
}

.code-window {
  border: 1px solid #3c3848;

  background: #1b1923;

  border-radius: 20px;

  overflow: hidden;

  box-shadow:
    0 30px 55px rgba(0, 0, 0, 0.25);
}

.code-window-top {
  height: 50px;

  border-bottom: 1px solid #35313e;

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 0 14px;

  color: #aaa5b5;

  font-size: 9px;
}

.window-dots {
  display: flex;

  gap: 5px;
}

.window-dots span {
  width: 9px;

  height: 9px;

  border-radius: 50%;

  background: #5d5868;
}

.code-copy {
  margin-left: auto;

  border: 0;

  background: transparent;

  color: #aaa5b5;

  cursor: pointer;
}

.code-content {
  padding: 28px 22px;

  color: #c8c4d0;

  font-family: monospace;

  font-size: 11px;

  line-height: 2.8;
}

.line-number {
  display: inline-block;

  width: 38px;

  color: #716b7d;
}

.keyword {
  color: var(--lime);
}

.function-name {
  color: #a57bff;
}

.code-green {
  color: var(--lime);
}


/* =====================================================
   RESOURCE CARDS
===================================================== */

.resource-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 14px;

  margin-top: 15px;
}

.resource-card {
  background: #ffffff;

  border: 1px solid var(--line);

  border-radius: 18px;

  padding: 21px;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.resource-card:hover {
  transform: translateY(-5px);

  box-shadow:
    0 18px 35px rgba(25, 20, 40, 0.10);
}

.resource-card h3 {
  font-family: "Space Grotesk", sans-serif;

  margin: 18px 0 7px;

  font-size: 16px;

  color: #17141f !important;
}

.resource-card p {
  color: #686272 !important;

  font-size: 11px;

  line-height: 1.55;

  min-height: 48px;
}


/* =====================================================
   BUTTON CONTRAST
===================================================== */

.hero-actions button,
.coding-hero button,
.session-hero button {
  font-weight: 800;
}

.hero-actions .primary-btn,
.coding-hero .primary-btn,
.session-hero .primary-btn {
  background: var(--lime);

  color: #111019 !important;

  border: none;
}

.hero-actions .secondary-btn,
.coding-hero .secondary-btn,
.session-hero .secondary-btn {
  background: transparent;

  color: #ffffff !important;

  border: 1px solid rgba(255, 255, 255, 0.28);
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 900px) {

  .hero-card,
  .coding-hero,
  .session-hero {
    grid-template-columns: 1fr;

    padding: 40px;

    min-height: auto;
  }

  .hero-visual {
    min-height: 400px;
  }

  .resource-grid {
    grid-template-columns: 1fr 1fr;
  }

}

@media (max-width: 600px) {

  .hero-card,
  .coding-hero,
  .session-hero {
    padding: 28px;

    border-radius: 22px;
  }

  .hero-card h1 {
    font-size: 48px;

    letter-spacing: -2px;
  }

  .coding-copy h2,
  .session-copy h2 {
    font-size: 42px;

    letter-spacing: -2px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .match-preview {
    width: 250px;
  }

}

/* =====================================================
   DASHBOARD
===================================================== */

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 44px 0 18px;
}

.section-header h2 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 30px;
  margin: 8px 0 0;
  letter-spacing: -1px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.stat-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon,
.feature-icon,
.notification-icon {
  width: 45px;
  height: 45px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: #eee9ff;
  color: var(--purple);
  flex-shrink: 0;
}

.stat-card strong {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 25px;
}

.stat-card span {
  display: block;
  font-weight: 700;
  font-size: 12px;
}

.stat-card small {
  display: block;
  color: #9895a0;
  margin-top: 3px;
  font-size: 10px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.dashboard-grid .panel {
  padding: 25px;
}

.mini-student-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.mini-student {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-top: 1px solid #efedf2;
}

.mini-avatar {
  width: 42px;
  height: 42px;
  font-size: 12px;
  flex-shrink: 0;
}

.mini-student-info {
  flex: 1;
}

.mini-student-info strong {
  display: block;
  font-size: 13px;
}

.mini-student-info span {
  display: block;
  color: #8d8995;
  font-size: 11px;
  margin-top: 4px;
}

.mini-match {
  color: var(--purple);
  font-size: 12px;
  font-weight: 800;
}

.progress-number {
  color: var(--purple);
  font-weight: 800;
}

.progress-track {
  height: 8px;
  background: #eceaf1;
  border-radius: 99px;
  overflow: hidden;
  margin: 23px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--purple),
    #a676ff
  );
  border-radius: inherit;
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-bottom: 22px;
}

.check-list div {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #46434f;
  font-size: 12px;
}

.check-list svg {
  color: #61bb55;
}

.check-list .unfinished {
  color: #9995a1;
}

.empty-check {
  width: 17px;
  height: 17px;
  border: 1px solid #cbc8d2;
  border-radius: 50%;
}

/* =====================================================
   PROFILE
===================================================== */

.content-narrow,
.content-medium {
  max-width: 1160px;
  margin: 0 auto;
}

.profile-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.7fr;
  gap: 18px;
}

.profile-main,
.profile-side {
  padding: 30px;
}

.profile-heading {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 25px;
}

.large-avatar {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: #181722;
  color: white;
  font-family: "Space Grotesk", sans-serif;
  font-size: 25px;
  font-weight: 700;
}

.profile-heading h2 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
}

.profile-heading p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 12px;
}

.online-pill {
  margin-left: auto;
  background: #eaf9e8;
  color: #39853b;
  padding: 7px 10px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
}

.online-pill span {
  width: 6px;
  height: 6px;
  background: #4bb94d;
  border-radius: 50%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-grid label,
.form-label {
  color: #56525e;
  font-size: 11px;
  font-weight: 700;
}

.form-grid input,
.form-label textarea,
.tag-input {
  width: 100%;
  margin-top: 7px;
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 13px 14px;
  outline: none;
  color: var(--ink);
  background: #fbfbfd;
}

.form-grid input:focus,
.form-label textarea:focus,
.tag-input:focus {
  border-color: var(--purple);
  box-shadow: 0 0 0 3px rgba(116,71,255,0.08);
}

.form-label {
  display: block;
  margin-top: 17px;
}

.form-label textarea {
  resize: vertical;
}

.profile-section {
  border-top: 1px solid var(--line);
  margin-top: 25px;
  padding-top: 25px;
}

.section-mini-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-mini-heading h3 {
  margin: 0 0 4px;
  font-size: 15px;
}

.section-mini-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

.section-mini-heading > svg {
  color: var(--purple);
}

.tag-editor {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 15px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
}

.skill-tag.purple {
  background: #eee9ff;
  color: #6840da;
}

.skill-tag.lime {
  background: #eefbdc;
  color: #4e7312;
}

.skill-tag button {
  border: 0;
  background: transparent;
  padding: 0;
  color: inherit;
  display: grid;
  place-items: center;
}

.tag-input {
  margin-top: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 28px;
}

.profile-side {
  height: fit-content;
  position: sticky;
  top: 110px;
}

.preview-user {
  text-align: center;
  padding: 28px 0;
}

.purple-avatar {
  background: linear-gradient(
    135deg,
    var(--purple),
    #9d72ff
  );
}

.preview-user .large-avatar {
  margin: auto;
}

.preview-user h3 {
  margin: 13px 0 4px;
  font-family: "Space Grotesk", sans-serif;
}

.preview-user p {
  color: var(--muted);
  font-size: 11px;
}

.preview-line {
  height: 1px;
  background: var(--line);
  margin: 4px 0 24px;
}

.preview-label {
  color: #aaa6b2;
  font-size: 9px;
  letter-spacing: 1.8px;
  font-weight: 800;
  margin-top: 20px;
}

.small-tag {
  padding: 7px 9px;
  border-radius: 8px;
  background: #eee9ff;
  color: #6540d4;
  font-size: 10px;
  font-weight: 700;
}

.small-tag.light {
  background: #f3f3f6;
  color: #686570;
}

/* =====================================================
   VERIFICATION
===================================================== */

.verification-banner {
  background: #111019;
  color: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 17px;
  margin-bottom: 18px;
}

.verification-icon {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: rgba(183,255,56,0.1);
  color: var(--lime);
  display: grid;
  place-items: center;
}

.verification-banner h3 {
  margin: 0 0 5px;
  font-family: "Space Grotesk", sans-serif;
}

.verification-banner p {
  margin: 0;
  color: #aaa7b4;
  font-size: 12px;
}

.verification-score {
  margin-left: auto;
  text-align: right;
}

.verification-score strong {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 30px;
  color: var(--lime);
}

.verification-score span {
  color: #888591;
  font-size: 10px;
}

.verification-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.verification-card {
  padding: 24px;
}

.verification-card-top {
  display: flex;
  justify-content: space-between;
}

.verification-card h3 {
  font-family: "Space Grotesk", sans-serif;
  margin: 20px 0 5px;
}

.verification-card p {
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 24px;
}

.verified-badge {
  color: #438f43;
  background: #ebf8e9;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* =====================================================
   MATCHES
===================================================== */

.matches-page {
  max-width: 1050px;
  margin: auto;
}

.matches-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 22px;
}

.matches-intro h1 {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(40px, 5vw, 62px);
  letter-spacing: -3px;
  margin: 10px 0;
}

.matches-intro h1 span {
  color: var(--purple);
}

.matches-intro p {
  color: var(--muted);
  max-width: 580px;
  line-height: 1.6;
}

.match-counter {
  background: white;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 24px;
  text-align: center;
}

.match-counter strong {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 27px;
  color: var(--purple);
}

.match-counter span {
  color: var(--muted);
  font-size: 10px;
}

.tinder-area {
  min-height: 670px;
  position: relative;
  display: grid;
  place-items: center;
}

.stack-card {
  position: absolute;
  width: min(470px, 90%);
  height: 590px;
  background: white;
  border-radius: 28px;
  border: 1px solid var(--line);
}

.back-card {
  transform: translate(18px, 18px) rotate(3deg);
  opacity: 0.55;
}

.middle-card {
  transform: translate(9px, 9px) rotate(1.5deg);
  opacity: 0.8;
}

.match-card-main {
  position: relative;
  z-index: 5;
  width: min(470px, 90%);
  min-height: 590px;
  border-radius: 28px;
  padding: 28px;
  background: white;
  border: 1px solid var(--line);
  box-shadow: 0 30px 80px rgba(30,25,45,0.13);
  animation: cardPop 0.45s ease;
}

.match-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--purple);
  font-size: 9px;
  letter-spacing: 1.5px;
  font-weight: 800;
}

.match-score {
  color: #4c7c10;
  background: #effbd9;
  border-radius: 99px;
  padding: 7px 10px;
  font-size: 10px;
  font-weight: 800;
}

.big-match-avatar {
  width: 100px;
  height: 100px;
  border-radius: 26px;
  font-size: 29px;
  margin: 25px auto 16px;
}

.match-card-main > h2 {
  text-align: center;
  font-family: "Space Grotesk", sans-serif;
  font-size: 28px;
  margin: 0;
}

.match-subtitle {
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  margin: 7px 0;
}

.match-status {
  width: fit-content;
  margin: 10px auto 0;
  color: #4c9a50;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-online,
.status-away {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-online {
  background: #54b957;
}

.status-away {
  background: #d0b24a;
}

.match-divider {
  height: 1px;
  background: var(--line);
  margin: 20px 0;
}

.match-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.match-info-grid > div > span {
  font-size: 8px;
  color: #aaa6b1;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.match-info-grid .tag-editor {
  margin-top: 8px;
}

.match-reason {
  background: #f6f4ff;
  color: #6541d5;
  border-radius: 11px;
  padding: 10px 12px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 700;
}

.swipe-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.swipe-button {
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: white;
  transition: 0.2s;
}

.swipe-button:hover {
  transform: translateY(-4px) scale(1.04);
}

.swipe-button.reject,
.swipe-button.like {
  width: 57px;
  height: 57px;
}

.swipe-button.super {
  width: 48px;
  height: 48px;
}

.swipe-button.reject {
  border: 1px solid #f1d8df;
  color: var(--danger);
}

.swipe-button.super {
  border: 1px solid #ded6ff;
  color: var(--purple);
}

.swipe-button.like {
  border: 0;
  background: var(--lime);
  color: #111019;
}

.match-tip {
  width: fit-content;
  margin: -4px auto 0;
  color: #85818d;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
}

/* =====================================================
   CONNECTIONS
===================================================== */

.connection-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.connection-stats > div {
  background: #111019;
  color: white;
  border-radius: 16px;
  padding: 20px;
}

.connection-stats strong {
  display: block;
  color: var(--lime);
  font-family: "Space Grotesk", sans-serif;
  font-size: 27px;
}

.connection-stats span {
  color: #a29fab;
  font-size: 10px;
}

.connections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.connection-card {
  padding: 24px;
}

.connection-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.connection-score {
  background: #effbd9;
  color: #537d17;
  padding: 7px 10px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 800;
}

.connection-card h3 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 19px;
  margin: 16px 0 4px;
}

.connection-card > p {
  color: var(--muted);
  font-size: 11px;
  margin: 0;
}

.connection-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 20px;
}

.connection-actions button {
  min-height: 42px;
}

/* =====================================================
   CHAT
===================================================== */

.chat-page {
  height: calc(100vh - 160px);
  min-height: 600px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 300px 1fr;
  box-shadow: var(--shadow);
}

.chat-sidebar {
  border-right: 1px solid var(--line);
  padding: 22px 15px;
}

.chat-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 15px;
}

.chat-sidebar-header h2 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
}

.chat-sidebar-header p {
  color: var(--muted);
  margin: 4px 0 0;
  font-size: 10px;
}

.chat-search {
  height: 40px;
  background: #f6f5f8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  color: #98949f;
  margin-bottom: 12px;
}

.chat-search input {
  border: 0;
  outline: 0;
  background: transparent;
  width: 100%;
  font-size: 11px;
}

.chat-contact {
  width: 100%;
  background: transparent;
  border: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 8px;
  text-align: left;
}

.chat-contact:hover,
.chat-contact.selected {
  background: #f5f2ff;
}

.contact-avatar {
  width: 42px;
  height: 42px;
  font-size: 11px;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
}

.contact-info strong {
  display: block;
  font-size: 12px;
}

.contact-info span {
  display: block;
  color: #96929d;
  font-size: 9px;
  margin-top: 4px;
}

.contact-status {
  width: 7px;
  height: 7px;
  background: #58b85b;
  border-radius: 50%;
}

.chat-window {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  min-height: 73px;
  border-bottom: 1px solid var(--line);
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-person {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-person strong {
  display: block;
  font-size: 13px;
}

.chat-person span {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #57a957;
  font-size: 9px;
  margin-top: 3px;
}

.chat-person span i {
  width: 5px;
  height: 5px;
  background: #57b457;
  border-radius: 50%;
}

.chat-header-actions {
  display: flex;
  gap: 7px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
}

.chat-date {
  text-align: center;
  color: #aaa6b1;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 25px;
}

.message-row {
  display: flex;
  margin-bottom: 11px;
}

.message-row.mine {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 62%;
  padding: 12px 14px;
  border-radius: 14px 14px 14px 3px;
  background: #f1eff5;
  color: #393641;
  font-size: 12px;
  line-height: 1.5;
}

.message-row.mine .message-bubble {
  color: white;
  background: var(--purple);
  border-radius: 14px 14px 3px 14px;
}

.chat-composer {
  border-top: 1px solid var(--line);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.chat-composer input {
  flex: 1;
  border: 0;
  outline: 0;
  padding: 12px;
}

.composer-icon,
.send-button {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  border: 0;
  display: grid;
  place-items: center;
}

.composer-icon {
  background: #f4f3f7;
  color: #7e7a86;
}

.send-button {
  background: var(--purple);
  color: white;
}

/* =====================================================
   RESOURCES
===================================================== */

.resources-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.resources-heading .page-intro {
  margin-bottom: 25px;
}

.coding-hero,
.session-hero {
  min-height: 400px;
  background:
    radial-gradient(
      circle at 90% 100%,
      rgba(116,71,255,0.33),
      transparent 30%
    ),
    #111019;
  color: white;
  border-radius: 28px;
  padding: 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 45px;
  align-items: center;
  box-shadow: 0 28px 65px rgba(233, 232, 236, 0.18);
}

.coding-copy h2,
.session-copy h2 {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(38px, 4vw, 58px);
  line-height: 0.98;
  letter-spacing: -3px;
  margin: 25px 0;
}

.coding-copy h2 span,
.session-copy h2 span {
  color: var(--lime);
}

.coding-copy p,
.session-copy p {
  color: #aaa7b4;
  line-height: 1.65;
  font-size: 14px;
  max-width: 500px;
  margin-bottom: 25px;
}

.code-window {
  border: 1px solid #3c3848;
  background: #1b1923;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 55px rgba(0,0,0,0.25);
}

.code-window-top {
  height: 50px;
  border-bottom: 1px solid #35313e;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  color: #777380;
  font-size: 9px;
}

.window-dots {
  display: flex;
  gap: 5px;
}

.window-dots span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #5d5868;
}

.code-copy {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #85818e;
}

.code-content {
  padding: 28px 22px;
  color: #aaa6b3;
  font-family: monospace;
  font-size: 11px;
  line-height: 2.8;
}

.line-number {
  display: inline-block;
  width: 38px;
  color: #55515f;
}

.keyword {
  color: var(--lime);
}

.function-name {
  color: #a57bff;
}

.code-green {
  color: var(--lime);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 15px;
}

.resource-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 21px;
}

.resource-card h3 {
  font-family: "Space Grotesk", sans-serif;
  margin: 18px 0 7px;
  font-size: 16px;
}

.resource-card p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.55;
  min-height: 48px;
}

/* =====================================================
   SESSIONS
===================================================== */

.session-hero {
  min-height: 450px;
}

.video-preview {
  height: 310px;
  border-radius: 22px;
  background: #201d29;
  border: 1px solid #332f3d;
  padding: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  position: relative;
}

.preview-video-tile {
  background:
    linear-gradient(
      145deg,
      #3d304d,
      #24202d
    );
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
}

.preview-video-tile span {
  font-family: "Space Grotesk", sans-serif;
  font-size: 31px;
}

.preview-video-tile small {
  color: #aaa6b3;
  margin-top: 7px;
}

.video-controls-preview {
  position: absolute;
  bottom: 17px;
  left: 50%;
  transform: translateX(-50%);
  background: #100f15;
  border-radius: 99px;
  padding: 9px 15px;
  display: flex;
  gap: 14px;
  align-items: center;
}

.video-controls-preview div {
  width: 22px;
  height: 4px;
  background: #ef476f;
  border-radius: 99px;
}

.session-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 15px;
}

.session-features > div {
  background: white;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
}

.session-features svg {
  color: var(--purple);
}

.session-features strong,
.session-features span {
  display: block;
}

.session-features strong {
  margin-top: 12px;
  font-size: 13px;
}

.session-features span {
  margin-top: 4px;
  color: var(--muted);
  font-size: 10px;
}

.session-room {
  background: #111019;
  border-radius: 25px;
  padding: 25px;
  color: white;
  min-height: 700px;
}

.session-room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.session-room-header h2 {
  font-family: "Space Grotesk", sans-serif;
  margin: 8px 0 0;
}

.live-pill {
  background: rgba(183,255,56,0.1);
  color: var(--lime);
  padding: 8px 12px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  gap: 6px;
  align-items: center;
}

.live-pill span {
  width: 6px;
  height: 6px;
  background: var(--lime);
  border-radius: 50%;
}

.video-grid {
  height: 500px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.video-tile {
  background:
    radial-gradient(
      circle at 50% 40%,
      #43364f,
      #211d29
    );
  border-radius: 20px;
  position: relative;
  display: grid;
  place-items: center;
}

.video-avatar {
  width: 100px;
  height: 100px;
  border-radius: 30px;
  display: grid;
  place-items: center;
  background: #7447ff;
  color: white;
  font-family: "Space Grotesk", sans-serif;
  font-size: 30px;
}

.video-avatar.purple {
  background: linear-gradient(
    135deg,
    #7547ff,
    #a06eff
  );
}

.video-name {
  position: absolute;
  left: 18px;
  bottom: 18px;
  background: rgba(0,0,0,0.45);
  padding: 8px 10px;
  border-radius: 9px;
  font-size: 10px;
}

.camera-off {
  position: absolute;
  color: #aaa7b4;
  bottom: 55px;
}

.session-toolbar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
}

.session-control {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #3a3645;
  background: #24212d;
  color: white;
  display: grid;
  place-items: center;
}

.session-control.danger {
  background: #ef476f;
  border-color: #ef476f;
}

.leave-button {
  min-height: 48px;
  border: 0;
  background: #ef476f;
  color: white;
  border-radius: 99px;
  padding: 0 20px;
  font-weight: 800;
}

/* =====================================================
   SCHEDULE
===================================================== */

.schedule-layout {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 15px;
}

.calendar-card,
.upcoming-panel {
  padding: 24px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.calendar-header strong {
  font-family: "Space Grotesk", sans-serif;
}

.calendar-days,
.calendar-numbers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
}

.calendar-days span {
  color: #aaa6b1;
  font-size: 9px;
  font-weight: 800;
  padding-bottom: 10px;
}

.calendar-numbers button {
  height: 38px;
  border: 0;
  background: transparent;
  border-radius: 10px;
  color: #4d4a54;
  font-size: 11px;
}

.calendar-numbers button:hover {
  background: #f0edff;
}

.calendar-numbers button.today {
  background: var(--purple);
  color: white;
  font-weight: 800;
}

.primary-small {
  border: 0;
  background: var(--lime);
  color: #111019;
  padding: 8px 11px;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 4px;
}

.session-list {
  margin-top: 20px;
}

.scheduled-session {
  display: flex;
  align-items: center;
  gap: 15px;
  border-top: 1px solid var(--line);
  padding: 17px 0;
}

.session-time {
  width: 75px;
  color: var(--purple);
  font-weight: 800;
  font-size: 11px;
}

.session-details {
  flex: 1;
}

.session-details strong {
  display: block;
  font-size: 13px;
}

.session-details span {
  display: block;
  color: var(--muted);
  font-size: 10px;
  margin-top: 4px;
}

/* =====================================================
   LEADERBOARD
===================================================== */

.leaderboard-hero {
  background: #111019;
  color: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 15px;
}

.leaderboard-rank {
  min-width: 150px;
  display: flex;
  flex-direction: column;
}

.leaderboard-rank svg {
  color: var(--lime);
  margin-bottom: 10px;
}

.leaderboard-rank span {
  color: #8f8b98;
  font-size: 9px;
  letter-spacing: 1px;
}

.leaderboard-rank strong {
  font-family: "Space Grotesk", sans-serif;
  font-size: 30px;
  color: white;
}

.leaderboard-progress {
  flex: 1;
}

.leaderboard-progress > span {
  font-weight: 700;
  font-size: 13px;
}

.leaderboard-progress small {
  color: #888591;
  font-size: 9px;
}

.leaderboard-table {
  overflow: hidden;
}

.leaderboard-head,
.leaderboard-row {
  display: grid;
  grid-template-columns: 80px 1.6fr 1fr 1fr;
  align-items: center;
  padding: 17px 22px;
}

.leaderboard-head {
  color: #aaa6b1;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  background: #fafafd;
}

.leaderboard-row {
  border-top: 1px solid var(--line);
  font-size: 12px;
}

.leaderboard-row.current-user {
  background: #f3efff;
}

.leader-person {
  display: flex;
  align-items: center;
  gap: 9px;
}

.leaderboard-row > span {
  color: var(--muted);
}

/* =====================================================
   NOTIFICATIONS
===================================================== */

.notification-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.notification-actions > span {
  color: var(--muted);
  font-size: 11px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-card {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.notification-copy {
  flex: 1;
}

.notification-copy strong {
  font-size: 13px;
}

.notification-copy p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.notification-card > span {
  color: #aaa6b1;
  font-size: 9px;
}

.notification-cta {
  margin-top: 18px;
  background: #111019;
  color: white;
  padding: 22px;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-cta h3 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
}

.notification-cta p {
  margin: 5px 0 0;
  color: #9995a2;
  font-size: 10px;
}

/* =====================================================
   SETTINGS
===================================================== */

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.settings-card {
  padding: 24px;
}

.settings-heading {
  display: flex;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.settings-heading > svg {
  color: var(--purple);
}

.settings-heading h3 {
  margin: 0 0 4px;
  font-family: "Space Grotesk", sans-serif;
}

.settings-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 10px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 17px 0;
  border-bottom: 1px solid var(--line);
}

.setting-row:last-child {
  border-bottom: 0;
}

.setting-row strong,
.setting-row span {
  display: block;
}

.setting-row strong {
  font-size: 12px;
}

.setting-row span {
  color: var(--muted);
  font-size: 9px;
  margin-top: 4px;
}

.switch {
  width: 43px;
  height: 24px;
  border: 0;
  background: #dcd9e1;
  border-radius: 99px;
  padding: 3px;
  flex-shrink: 0;
}

.switch span {
  display: block;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  transition: 0.2s;
}

.switch.on {
  background: var(--purple);
}

.switch.on span {
  transform: translateX(19px);
}

.account-settings {
  margin-top: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.account-settings h3 {
  margin: 0 0 5px;
}

.account-settings p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

/* =====================================================
   TOAST
===================================================== */

.toast {
  position: fixed;
  right: 25px;
  bottom: 25px;
  z-index: 100;
  background: #111019;
  color: white;
  padding: 13px 17px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 20px 50px rgba(219, 218, 218, 0.25);
  animation: toastIn 0.3s ease;
}

.toast svg {
  color: var(--lime);
}

.toast.error svg {
  color: #ff5d82;
}

/* =====================================================
   EMPTY
===================================================== */

.empty-state {
  text-align: center;
  padding: 90px 20px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 24px;
}

.empty-state svg {
  color: var(--purple);
}

.empty-state h2 {
  font-family: "Space Grotesk", sans-serif;
}

/* =====================================================
   ANIMATIONS
===================================================== */

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardPop {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1100px) {
  .sidebar {
    width: 220px;
  }

  .main {
    margin-left: 220px;
    width: calc(100% - 220px);
  }

  .hero-card {
    padding: 42px;
    grid-template-columns: 1fr;
  }

  .hero-visual {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .resource-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 800px) {
  .sidebar {
    position: static;
    width: 76px;
    padding: 20px 10px;
  }

  .brand {
    justify-content: center;
    padding: 0 0 20px;
  }

  .brand > div:last-child,
  .sidebar-section-title,
  .nav-item span,
  .sidebar-user-info,
  .sidebar-user > svg {
    display: none;
  }

  .nav-item {
    justify-content: center;
    padding: 0;
  }

  .sidebar-user {
    justify-content: center;
  }

  .main {
    margin-left: 0;
    width: calc(100% - 76px);
  }

  .topbar {
    padding: 0 18px;
  }

  .search-box {
    width: 190px;
  }

  .page-content {
    padding: 25px 18px 50px;
  }

  .dashboard-grid,
  .profile-layout,
  .schedule-layout,
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .profile-side {
    position: static;
  }

  .verification-grid,
  .connections-grid {
    grid-template-columns: 1fr;
  }

  .coding-hero,
  .session-hero {
    grid-template-columns: 1fr;
    padding: 32px;
  }

  .resource-grid {
    grid-template-columns: 1fr 1fr;
  }

  .chat-page {
    grid-template-columns: 230px 1fr;
  }
}

@media (max-width: 600px) {
  .topbar {
    height: auto;
    min-height: 70px;
    gap: 10px;
  }

  .page-title {
    display: none;
  }

  .topbar-actions {
    width: 100%;
  }

  .search-box {
    flex: 1;
    width: auto;
  }

  .profile-chip strong,
  .profile-chip > svg {
    display: none;
  }

  .hero-card {
    padding: 32px 25px;
  }

  .hero-card h1 {
    font-size: 45px;
    letter-spacing: -2.5px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions button {
    width: 100%;
  }

  .stats-grid,
  .connection-stats,
  .resource-grid,
  .session-features {
    grid-template-columns: 1fr;
  }

  .matches-intro,
  .resources-heading,
  .notification-cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .match-card-main {
    width: 95%;
    padding: 22px;
  }

  .match-info-grid {
    grid-template-columns: 1fr;
  }

  .tinder-area {
    min-height: 680px;
  }

  .stack-card {
    width: 95%;
  }

  .chat-page {
    grid-template-columns: 1fr;
  }

  .chat-sidebar {
    display: none;
  }

  .video-grid {
    grid-template-columns: 1fr;
    height: auto;
  }

  .video-tile {
    min-height: 240px;
  }

  .leaderboard-head,
  .leaderboard-row {
    grid-template-columns: 45px 1.5fr 70px;
  }

  .leaderboard-head span:last-child,
  .leaderboard-row > span:last-child {
    display: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
`;