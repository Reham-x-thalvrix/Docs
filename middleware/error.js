const { logger } = require("../core/logger");

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);
  res.status(500).json({
    status: false,
    error: "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}

module.exports = { errorHandler };
