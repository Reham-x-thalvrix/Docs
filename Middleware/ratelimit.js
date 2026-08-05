const rateLimit = require("express-rate-limit");
const settings = require("../settings.json");

const rateLimiter = rateLimit({
  windowMs: settings.rateLimit.windowMs,
  max: settings.rateLimit.max,
  message: { status: false, error: "Too many requests from this IP." }
});

module.exports = { rateLimiter };
