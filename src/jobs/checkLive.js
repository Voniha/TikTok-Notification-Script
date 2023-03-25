const cron = require("node-cron");
const api = require("../public/javascript/api");
const logger = require("../public/javascript/logger");

module.exports = () => {
  let job = cron.schedule("*/5 * * * *", async () => {
    let database = await api.getAllDB();
    if (!database.length) return;
    for (let db of database) {
      if (!db.enabled) {
        logger.live(
          `Skipping ${db.username} (${db.roomId}) because it is disabled.`
        );
        continue;
      }
      let titkok = await api
        .getTikTokInfo(db.username)
        .catch((e) =>
          logger.error(
            `Failed to get TikTok info for ${db.username} (${db.roomId}).`
          )
        );
      if (titkok.status === 2 && db.status === "Offline") {
        let webhook = await api
          .sendWebhook(db.webhook, db.username, titkok)
          .catch((e) =>
            logger.error(
              `Failed to send webhook for ${db.username} (${db.roomId}).`
            )
          );
        if (webhook) {
          db.status = "Live";
          await api.save(db.roomId, db);
          logger.live(
            `Live check passed for ${db.username} (${db.roomId}) and webhook has been sent.`
          );
        }
      }

      if (titkok.status === 4 && db.status === "Live") {
        db.status = "Offline";
        await api.save(db.roomId, db);
        logger.live(`${db.username} (${db.roomId}) is now offline.`);
      }
    }
  });
  job.start();
};
