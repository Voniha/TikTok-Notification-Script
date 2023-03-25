const fetch = require("node-fetch");
const fs = require("fs");
const { WebcastPushConnection } = require("tiktok-live-connector");
const Logger = require("./logger");

module.exports = class API {
  static async getTikTokInfo(username) {
    let data = new WebcastPushConnection(username);
    let roomInfo = await data.getRoomInfo().catch((e) => Logger.log(e));
    if (roomInfo) return roomInfo;
    else return false;
  }

  static async saveToDb(roomId, data) {
    if (!fs.existsSync(`./src/json/${roomId}`)) {
      fs.mkdirSync(`./src/json/${roomId}`);
      if (!fs.existsSync(`./src/json/${roomId}/database.json`))
        fs.writeFileSync(
          `./src/json/${roomId}/database.json`,
          JSON.stringify(data)
        );
      return true;
    } else return false;
  }

  static async getDb(username) {
    let info = await this.getTikTokInfo(username);
    let exist;
    if (info)
      exist = fs.existsSync(
        `./src/json/${info.living_room_attrs.room_id}/database.json`
      );
    if (exist)
      return JSON.parse(
        fs.readFileSync(
          `./src/json/${info.living_room_attrs.room_id}/database.json`
        )
      );
    else return false;
  }

  static async removeFromDb(username) {
    let info = await this.getTikTokInfo(username);
    if (info) {
      if (fs.existsSync(`./src/json/${info.living_room_attrs.room_id}`)) {
        fs.rmSync(`./src/json/${info.living_room_attrs.room_id}`, {
          recursive: true,
        });
        if (
          fs.existsSync(
            `./src/json/${info.living_room_attrs.room_id}}/database.json`
          )
        )
          fs.unlinkSync(
            `./src/json/${info.living_room_attrs.room_id}/database.json`
          );
        return true;
      } else return false;
    }
  }

  static getAllDB() {
    let data = fs.readdirSync("./src/json").map((file) => {
      let db = fs.readFileSync(`./src/json/${file}/database.json`);
      return JSON.parse(db);
    });
    return data;
  }

  static getAllChecks(roomId) {
    let data = fs.readdirSync(`./src/json/${roomId}/database.json`);
    return data;
  }

  static async sendWebhook(webhook, username, data) {
    let response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `@everyone ${username} is now live!`,
        username: "TikTok Live Checker",
        embeds: [
          {
            author: {
              name: username,
            },
            color: 0x00ff00,
            description: `${data.title}`,
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Click me!",
                style: 1,
                custom_id: "click_one",
              },
            ],
          },
        ],
      }),
    });

    if (response.status === 204) return true;
    else return false;
  }

  static async save(roomId, data) {
    fs.writeFileSync(
      `./src/json/${roomId}/database.json`,
      JSON.stringify(data, null, 3)
    );
  }

  static getBotSettings() {
    let db = fs.readFileSync("./src/public/json/script.json");
    return JSON.parse(db);
  }

  static deleteAll() {
    fs.rmSync("./src/json", { recursive: true });
    fs.mkdirSync("./src/json");
  }
};
