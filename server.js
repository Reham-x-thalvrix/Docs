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

// 1. Static Folder Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use("/views", express.static(path.join(__dirname, "views")));

// 2. Dynamic API Route Loader
loadScripts(app, settings.apiPrefix);

// 3. Main HTML Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// 4. 404 Handler (API এবং অকার্যকর পেজ রুটের জন্য)
app.use((req, res, next) => {
  // API Request হলে JSON format-এ Error দেওয়া
  if (req.originalUrl.startsWith(settings.apiPrefix || "/api")) {
    return res.status(404).json({
      status: false,
      error: "API Endpoint Not Found"
    });
  }
  // নরমাল পেজ হলে 404.html ফাইল পাঠানো
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// 5. Global Error Handler (একদম শেষে থাকবে)
app.use(errorHandler);

// Port setup for Render
const PORT = process.env.PORT || settings.port || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});
