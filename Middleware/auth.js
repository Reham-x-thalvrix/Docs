const settings = require("../settings.json");

function authMiddleware(req, res, next) {
  if (!settings.enableAuth) return next();
  const apiKey = req.headers["x-api-key"] || req.query.apikey;
  if (apiKey && apiKey === settings.apiKey) {
    return next();
  }
  return res.status(401).json({ status: false, error: "Unauthorized access" });
}

module.exports = { authMiddleware };
