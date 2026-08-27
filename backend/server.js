require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 5050;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// =====================================================
// PROFILE SCHEMA
// =====================================================

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    age: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    course: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    wants: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

// =====================================================
// CONNECTION SCHEMA
// =====================================================

const connectionSchema = new mongoose.Schema(
  {
    fromProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    toProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Connected", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Connection = mongoose.model(
  "Connection",
  connectionSchema
);

// =====================================================
// MESSAGE SCHEMA
// =====================================================

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

// =====================================================
// SESSION SCHEMA
// =====================================================

const sessionSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    title: {
      type: String,
      default: "SkillSwap Learning Session",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

// =====================================================
// NOTIFICATION SCHEMA
// =====================================================

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "info",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap Backend is Running",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap backend is healthy",
    server: "online",
    port: PORT,
  });
});

// =====================================================
// API TEST
// =====================================================

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillSwap API is working correctly",
  });
});

// =====================================================
// PROFILE
// =====================================================

// CREATE PROFILE

app.post("/api/profile", async (req, res) => {
  try {
    const profile = new Profile(req.body);

    const savedProfile = await profile.save();

    res.status(201).json({
      success: true,
      message: "Profile saved successfully",
      profile: savedProfile,
    });
  } catch (error) {
    console.error("PROFILE SAVE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save profile",
      error: error.message,
    });
  }
});

// GET ALL PROFILES

app.get("/api/profile", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error("GET PROFILES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get profiles",
      error: error.message,
    });
  }
});

// GET SINGLE PROFILE

app.get("/api/profile/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
});

// =====================================================
// CONNECTIONS
// =====================================================

// CREATE CONNECTION

app.post("/api/connections", async (req, res) => {
  try {
    const { fromProfile, toProfile } = req.body;

    if (!fromProfile || !toProfile) {
      return res.status(400).json({
        success: false,
        message: "fromProfile and toProfile are required",
      });
    }

    if (fromProfile === toProfile) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself",
      });
    }

    const existing = await Connection.findOne({
      fromProfile,
      toProfile,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Connection already exists",
        connection: existing,
      });
    }

    const connection = await Connection.create({
      fromProfile,
      toProfile,
      status: "Pending",
    });

    const sender = await Profile.findById(fromProfile);
    const receiver = await Profile.findById(toProfile);

    if (receiver && sender) {
      await Notification.create({
        recipient: toProfile,
        title: "New connection request",
        message: `${sender.name} wants to connect with you.`,
        type: "connection",
      });
    }

    res.status(201).json({
      success: true,
      message: "Connection request sent",
      connection,
    });
  } catch (error) {
    console.error("CONNECTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create connection",
      error: error.message,
    });
  }
});

// GET CONNECTIONS

app.get("/api/connections/:profileId", async (req, res) => {
  try {
    const profileId = req.params.profileId;

    const connections = await Connection.find({
      $or: [
        { fromProfile: profileId },
        { toProfile: profileId },
      ],
    })
      .populate("fromProfile")
      .populate("toProfile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      connections,
    });
  } catch (error) {
    console.error("GET CONNECTIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get connections",
      error: error.message,
    });
  }
});

// ACCEPT CONNECTION

app.patch("/api/connections/:id/accept", async (req, res) => {
  try {
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      {
        status: "Connected",
      },
      {
        new: true,
      }
    )
      .populate("fromProfile")
      .populate("toProfile");

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    await Notification.create({
      recipient: connection.fromProfile._id,
      title: "Connection accepted",
      message: `${connection.toProfile.name} accepted your connection.`,
      type: "connection",
    });

    res.status(200).json({
      success: true,
      message: "Connection accepted",
      connection,
    });
  } catch (error) {
    console.error("ACCEPT CONNECTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to accept connection",
      error: error.message,
    });
  }
});

// DELETE CONNECTION

app.delete("/api/connections/:id", async (req, res) => {
  try {
    const connection = await Connection.findByIdAndDelete(
      req.params.id
    );

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Connection removed",
    });
  } catch (error) {
    console.error("DELETE CONNECTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove connection",
      error: error.message,
    });
  }
});

// =====================================================
// CHAT / MESSAGES
// =====================================================

// SEND MESSAGE

app.post("/api/messages", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    if (!sender || !receiver || !text) {
      return res.status(400).json({
        success: false,
        message: "sender, receiver and text are required",
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      text,
    });

    const senderProfile = await Profile.findById(sender);

    await Notification.create({
      recipient: receiver,
      title: "New message",
      message: `${senderProfile?.name || "Someone"} sent you a message.`,
      type: "message",
    });

    const populatedMessage = await Message.findById(
      message._id
    )
      .populate("sender")
      .populate("receiver");

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("MESSAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// GET CHAT

app.get(
  "/api/messages/:profileId/:otherProfileId",
  async (req, res) => {
    try {
      const { profileId, otherProfileId } = req.params;

      const messages = await Message.find({
        $or: [
          {
            sender: profileId,
            receiver: otherProfileId,
          },
          {
            sender: otherProfileId,
            receiver: profileId,
          },
        ],
      })
        .populate("sender")
        .populate("receiver")
        .sort({ createdAt: 1 });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error("GET MESSAGES ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Failed to get messages",
        error: error.message,
      });
    }
  }
);

// =====================================================
// NOTIFICATIONS
// =====================================================

// GET NOTIFICATIONS

app.get("/api/notifications/:profileId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.params.profileId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
});

// MARK NOTIFICATION AS READ

app.patch("/api/notifications/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
      error: error.message,
    });
  }
});

// =====================================================
// LEARNING SESSIONS
// =====================================================

// CREATE SESSION

app.post("/api/sessions", async (req, res) => {
  try {
    const {
      host,
      participant,
      title,
      date,
      time,
    } = req.body;

    if (!host || !participant || !date || !time) {
      return res.status(400).json({
        success: false,
        message:
          "host, participant, date and time are required",
      });
    }

    const session = await Session.create({
      host,
      participant,
      title: title || "SkillSwap Learning Session",
      date,
      time,
    });

    const hostProfile = await Profile.findById(host);

    await Notification.create({
      recipient: participant,
      title: "Learning session scheduled",
      message: `${hostProfile?.name || "Your connection"} scheduled a learning session.`,
      type: "session",
    });

    res.status(201).json({
      success: true,
      message: "Learning session scheduled",
      session,
    });
  } catch (error) {
    console.error("SESSION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to schedule session",
      error: error.message,
    });
  }
});

// GET SESSIONS

app.get("/api/sessions/:profileId", async (req, res) => {
  try {
    const profileId = req.params.profileId;

    const sessions = await Session.find({
      $or: [
        { host: profileId },
        { participant: profileId },
      ],
    })
      .populate("host")
      .populate("participant")
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("GET SESSIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get sessions",
      error: error.message,
    });
  }
});

// =====================================================
// START SESSION
// =====================================================

app.patch("/api/sessions/:id/start", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Learning room ready",
      session,
      room: {
        id: session._id,
        type: "SkillSwap Learning Room",
        features: [
          "Video",
          "Live Chat",
          "Shared Coding",
          "Resources",
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to start session",
      error: error.message,
    });
  }
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log("       SKILLSWAP BACKEND");
  console.log("======================================");
  console.log(`Server running on port ${PORT}`);
  console.log("MongoDB integration enabled");
  console.log("Profiles API enabled");
  console.log("Connections API enabled");
  console.log("Messages API enabled");
  console.log("Notifications API enabled");
  console.log("Sessions API enabled");
  console.log("SERVER IS READY...");
  console.log("======================================");
});