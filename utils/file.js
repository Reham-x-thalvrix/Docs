const fs = require("fs");

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

module.exports = { checkFileExists };
