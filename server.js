const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
    socket.on('chat message', (msg) => {
        io.emit("messages",msg)
    });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
server.listen(8080, () => {
  console.log("app is running on port 8080 ");
});

