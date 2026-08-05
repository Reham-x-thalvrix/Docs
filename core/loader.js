const fs = require("fs");
const path = require("path");
const { logger } = require("./logger");

const apiRegistry = [];

function loadScripts(app, apiPrefix) {
  const scriptsDir = path.join(__dirname, "../scripts");

  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
  }

  const files = fs.readdirSync(scriptsDir);

  files.forEach((file) => {
    if (file.endsWith(".js")) {
      try {
        const script = require(path.join(scriptsDir, file));
        if (script.meta && script.meta.path && script.onStart) {
          const method = (script.meta.method || "get").toLowerCase();
          const routePath = `${apiPrefix}${script.meta.path}`;

          app[method](routePath, (req, res, next) => {
            Promise.resolve(script.onStart({ req, res })).catch(next);
          });

          apiRegistry.push(script.meta);
          logger.info(`Loaded Route: [${method.toUpperCase()}] ${routePath}`);
        }
      } catch (err) {
        logger.error(`Failed to load ${file}: ${err.message}`);
      }
    }
  });

  app.get(`${apiPrefix}/list`, (req, res) => {
    res.json({ status: true, total: apiRegistry.length, apis: apiRegistry });
  });
}

module.exports = { loadScripts, apiRegistry };
