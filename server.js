const express = require("express");
const path = require("path");
const settings = require("./settings.json");
const { corsMiddleware } = require("./middleware/cors");
const { rateLimiter } = require("./middleware/ratelimit");
const { errorHandler } = require("./middleware/error");
const { loadScripts } = require("./core/loader");
const { logger } = require("./core/logger");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(rateLimiter);

// 1. Static Folder Middleware (সবচেয়ে ওপরে থাকতে হবে)
app.use(express.static(path.join(__dirname, "public")));
app.use("/views", express.static(path.join(__dirname, "views")));

// 2. Dynamic API Route Loader
loadScripts(app, settings.apiPrefix);

// 3. Main HTML Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Global Error Handler
app.use(errorHandler);

// Port setup for Render
const PORT = process.env.PORT || settings.port || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});
