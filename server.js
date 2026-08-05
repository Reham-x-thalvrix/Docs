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

app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/views", express.static(path.join(__dirname, "views")));

// Dynamic Route Loader
loadScripts(app, settings.apiPrefix);

// HTML Page Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Global Error Handler
app.use(errorHandler);

// Render/Heroku Dynamic Port Handling
const PORT = process.env.PORT || settings.port || 3000;

// Start Server
app.listen(PORT, () => {
  logger.info(`Server active on port :${PORT}`);
});
