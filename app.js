const express = require("express");
const router = new express.Router();

const app = express();

app.use(router);
router.route("/").get((req, res) => {
  res.send("ok");
});

const Room = require("./src/models/room");
app.use(router);
router.route("/create-rooms").get(async (req, res) => {
  try {
    await Room.insertMany([
      {
        room: "Chrome",
        members: [],
      },
      {
        room: "Safari",
        members: [],
      },
      {
        room: "FireFox",
        members: [],
      },
      {
        room: "Opera",
        members: [],
      },
      {
        room: "Coccoc",
        members: [],
      },
    ]);
    res.send("ok");
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/addDocuments", async function (req, res) {
  const data = [
    {
      name: "Chrome",
      members: [],
    },
    {
      name: "Safari",
      members: [],
    },
    {
      name: "FireFox",
      members: [],
    },
    {
      name: "Opera",
      members: [],
    },
    {
      name: "Coccoc",
      members: [],
    },
  ];

  await Room.insertMany(data);
  console
    .log(data)
    .then((result) => {
      console.log("result ", result);
      res.status(200).json({ success: "new documents added!", data: result });
    })
    .catch((err) => {
      console.error("error ", err);
      res.status(400).json({ err });
    });
});

module.exports = app;
