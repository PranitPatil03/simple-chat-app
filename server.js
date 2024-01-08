const express = require("express");

const path = require("path");

const app = express();

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

const socketConnected = new Set();

const onConnected = (socket) => {
  console.log(socket.id);
  socketConnected.add(socket.id);

  io.emit("clients-total", socketConnected.size);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected ", socket.id);
    socketConnected.delete(socket.id);
    io.emit("clients-total", socketConnected.size);
  });

  socket.on("send-message", (messageData) => {
    socket.broadcast.emit("chat-message", messageData);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
};

io.on("connection", onConnected);
