const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const api = require("./public/javascript/api");
const bodyParser = require("body-parser");
const logger = require("./public/javascript/logger");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/javascript", express.static(__dirname + "public/javascript"));
app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

app.post("/api/v1/add", async (req, res) => {
  let data = await api.getTikTokInfo(req.body.username).catch(() => {});
  if (data) {
    let dbData = {
      username: req.body.username,
      webhook: req.body.webhook,
      avatar: data.owner.avatar_thumb.url_list[0],
      roomId: data.living_room_attrs.room_id,
      status: "Offline",
      enabled: true,
    };
    let db = await api.saveToDb(data.living_room_attrs?.room_id, dbData);
    if (!db) return res.json({ status: 400, data: "User already exists" });
    if (db) return res.json({ status: 200, data: dbData });
  } else return res.json({ status: 404, data: null });
});

app.post("/api/v1/remove", async (req, res) => {
  let db = await api.removeFromDb(req.body.username);
  if (!db) return res.json({ status: 400, data: "User does not exist" });
  if (db) return res.json({ status: 200, data: db });
});

app.get("/api/v1/clear", async (req, res) => {
  let db = api.deleteAll();
  return res.json({ status: 200, data: db });
});

app.get("/api/v1/getAll", async (req, res) => {
  let db = await api.getAllDB(req.query.username);
  if (!db) return res.json({ status: 400, data: "User does not exist" });
  if (db) return res.json({ status: 200, data: db });
});

app.post("/api/v1/get", async (req, res) => {
  let db = await api.getDb(req.body.username);
  if (!db) return res.json({ status: 400, data: "User does not exist" });
  if (db) return res.json({ status: 200, data: db });
});

app.post("/api/v1/save", async (req, res) => {
  let db = await api.save(req.body.roomId, req.body.data);
  return res.json({ status: 200, data: db });
});

app.post("/api/v1/stop", async (req, res) => {
  return res.json({ status: 200, data: db });
});

app.listen(port, () => {
  logger.log(
    `Website is listening on port: ${port}, url: http://localhost:${port}`
  );
  require("./jobs/checkLive")();
});
