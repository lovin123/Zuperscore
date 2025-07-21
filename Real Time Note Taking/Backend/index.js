const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://your-vercel-project.vercel.app"],
    methods: ["GET", "POST"],
  },
});

const sessions = {};

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("join-session", ({ sessionId, user }) => {
    if (!sessionId || !user) {
      return;
    }

    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.user = user;

    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        users: new Set(),
        content: "",
        chat: [],
        typingUsers: new Set(),
      };
    }

    sessions[sessionId].users.add(user);

    socket.emit("session-joined", {
      content: sessions[sessionId].content,
      chat: sessions[sessionId].chat,
    });

    socket.to(sessionId).emit("user-joined", user);
  });

  socket.on("text-change", ({ sessionId, content }) => {
    if (sessions[sessionId]) {
      sessions[sessionId].content = content;
      socket.to(sessionId).emit("text-change", content);
    }
  });

  socket.on("chat-message", ({ sessionId, user, message, timestamp }) => {
    if (sessions[sessionId]) {
      const chatMessage = { user, message, timestamp };
      sessions[sessionId].chat.push(chatMessage);
      io.to(sessionId).emit("chat-message", chatMessage);
    }
  });

  socket.on("typing", ({ sessionId, user }) => {
    if (sessions[sessionId]) {
      sessions[sessionId].typingUsers.add(user);
      socket.to(sessionId).emit("typing", user);
    }
  });

  socket.on("stop-typing", ({ sessionId, user }) => {
    if (sessions[sessionId]) {
      sessions[sessionId].typingUsers.delete(user);
      socket.to(sessionId).emit("stop-typing", user);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
    const { sessionId, user } = socket;
    if (sessions[sessionId] && sessions[sessionId].users) {
      sessions[sessionId].users.delete(user);
      sessions[sessionId].typingUsers.delete(user);
      io.to(sessionId).emit("user-left", user);

      if (sessions[sessionId].users.size === 0) {
        delete sessions[sessionId];
        console.log(`Session ${sessionId} closed.`);
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
