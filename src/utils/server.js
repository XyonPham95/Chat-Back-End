const User = require("../models/user");
const Room = require("../models/room");
const Chat = require("../models/chat");

class Server {
  constructor(user) {
    this.user = user;
  }

  static async login(socketId, userName) {
    let user = await User.findOne({ name: userName.trim().toLowerCase() });

    if (!user) {
      user = await User.create({
        name: userName.toLowerCase(),
        token: socketId,
        room: null,
      });
    }

    user.token = socketId;
    user.online = true;
    await user.save();
    return user;
  }

  static async checkUser(socketId) {
    const user = await User.findOne({ token: socketId });

    if (!user) throw new Error("User not found");
    return new Server(user);
  }

  async joinRoom(rId) {
    const room = await Room.findById(rId);

    if (!room.members.includes(this.user._id)) {
      room.members.push(this.user._id);
      await room.save();
    }

    this.user.room = rID;
    await this.user.save();
    this.user.room = room;
  }

  async leaveRoom() {
    let rId = this.user.room;
    const room = await Room.findById(rId);

    if (!room) throw new Error("Room not found");
    room.members.remove(this.user._id);

    await room.save();
    this.user.room = null;
    await this.user.save();
    this.user.room = rId;
  }

  async chat(text) {
    const chat = await Chat.create({
      text: text,
      user: this.user._id,
      room: this.user.room._id,
    });
    return chat;
  }
}

module.exports = Server;
