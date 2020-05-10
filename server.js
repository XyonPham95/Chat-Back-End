require("dotenv").config({ path: ".env" });
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

const server = http.createServer(app);

const io = socketio(server);
const Filter = require("bad-words");
const filter = new Filter();
const Room = require("./src/models/room");
const Server = require("./src/utils/server");

io.on("connection", async (socket) => {
  socket.emit("rooms", await Room.find());

  socket.on("login", async (userName, cb) => {
    try {
      const user = await Server.loginUser(userName, socket.id);
      return cb({ ok: true, data: user });
    } catch (err) {
      return cb({ ok: false, err: err.message });
    }
  });

  socket.on("joinRoom", async (rId, cb) => {
    try {
      const server = await Server.checkUser(socket.id);
      await server.joinRoom(rId);
      socket.emit("selectedRoom");
      socket.join(rId);
      socket.emit("messages", {
        name: "System",
        text: `Welcome ${server.user.name} to ${server.user.room.name}`,
      });
      socket.to("rId").broadcast.emit("messages", {
        name: "System",
        text: `Welcome ${server.user.name} to has joined the sever`,
      });
      io.emit("rooms", await Room.find());
      cb();
    } catch (err) {
      return cb({ ok: false, message: err.message });
    }
  });

  socket.on("leaveRoom", async (_, cb) => {
    try {
      const server = await Server.checkUser(socket.id);
      await server.leaveRoom();

      socket.to(server.user.rId).broadcast.emit("messages", {
        name: "System",
        text: `${server.user.name} has left the room`,
      });

      socket.leave(server.user.rId);
    } catch (err) {
      return cb({ ok: false, message: err.message });
    }
  });

  socket.on("chat", (obj, cb) => {
    if (filter.isProfane(obj.text)) {
      return cb("Bad words are not allowed");
    }
    io.emit("messages", obj);
  });
});

server.listen(process.env.PORT, () => {
  console.log("server listening on port " + process.env.PORT);
});
