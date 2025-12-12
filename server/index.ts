import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import fs from "fs";
import path from "path";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// #region agent log
function debugLog(location: string, message: string, data: any, hypothesisId: string) {
  const logPath = path.resolve(process.cwd(), ".cursor", "debug.log");
  const logEntry = JSON.stringify({
    location,
    message,
    data,
    timestamp: Date.now(),
    sessionId: "debug-session",
    runId: "run1",
    hypothesisId,
  }) + "\n";
  try {
    fs.appendFileSync(logPath, logEntry, "utf8");
  } catch (e) {
    // Ignore errors
  }
}
// #endregion

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // #region agent log
  debugLog("server/index.ts:36", "Request received", { method: req.method, path: req.path, url: req.originalUrl, statusCode: res.statusCode }, "A,B,C,D,E");
  // #endregion

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    // #region agent log
    debugLog("server/index.ts:47", "Response finished", { method: req.method, path: req.path, statusCode: res.statusCode, duration }, "A,B,C,D,E");
    // #endregion
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // #region agent log
    debugLog("server/index.ts:65", "Error handler invoked", { status, message, errorName: err.name, errorStack: err.stack }, "B,C");
    // #endregion

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 3000 if not specified (5000 is often used by AirPlay).
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "3000", 10);
  const host = process.env.HOST || "localhost";
  httpServer.listen(
    port,
    host,
    () => {
      log(`serving on ${host}:${port}`);
      // #region agent log
      debugLog("server/index.ts:104", "Server started", { host, port, nodeEnv: process.env.NODE_ENV }, "A,B,C,D,E");
      // #endregion
    },
  );
})();
