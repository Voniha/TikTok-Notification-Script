const chalk = require("chalk");

module.exports = class Logger {
  static live(message, type = "INFO") {
    return console.log(
      `[${chalk.blueBright("TikTok Live")}] ${chalk.greenBright(
        `[${type.toUpperCase()}]`
      )} ${message}`
    );
  }

  static error(message) {
    return console.log(
      `[${chalk.blueBright("TikTok Live")}] ${chalk.redBright(
        "[ERROR]"
      )} ${message}`
    );
  }

  static log(message) {
    return console.log(
      `[${chalk.blueBright("TikTok Script")}] ${chalk.yellowBright(
        "[LOG]"
      )} ${message}`
    );
  }
};
