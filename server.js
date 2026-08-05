const express = require("express");
const path = require("path");
const settings = require("./settings.json");
const { corsMiddleware } = require("./middleware/cors");
const { rateLimiter } = require("./middleware/ratelimit");
const { errorHandler } = require("./middleware/error");
const { authMiddleware } = require("./middleware/auth");
const { loadScripts } = require("./core/loader");
const { logger } = require("./core/logger");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(rateLimiter);

// Static Asset Management
app.use(express.static(path.join(__dirname, "public")));
app.use("/views", express.static(path.join(__dirname, "views")));

// Dynamic Route Loader
loadScripts(app, settings.apiPrefix);

// HTML Page Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(settings.port, () => {
  logger.info(`port :${settings.port}`);
});
