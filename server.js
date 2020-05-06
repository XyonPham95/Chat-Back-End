require("dotenv").config({ path: ".env" });
const http = require("http");
const socketio = require("socket.io");

const app = require("./app");

const server = http.createServer(app);

const io = socketio(server);
const Filter = require("bad-words");
const filter = new Filter();

io.on("connection", (socket) => {
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
