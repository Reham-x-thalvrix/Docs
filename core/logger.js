const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

function writeLog(type, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}]: ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(path.join(logDir, "app.log"), logMessage);
}

const logger = {
  info: (msg) => writeLog("info", msg),
  error: (msg) => writeLog("error", msg),
  warn: (msg) => writeLog("warn", msg)
};

module.exports = { logger };
