import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

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

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        // Don't exit on error in development
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Use Vite's middleware ONLY for specific asset paths
  app.use((req, res, next) => {
    const url = req.originalUrl;
    
    // #region agent log
    debugLog("server/vite.ts:33", "Vite middleware check", { url, isApi: url.startsWith("/api"), statusCode: res.statusCode }, "A,D");
    // #endregion
    
    // Skip API routes
    if (url.startsWith("/api")) {
      // #region agent log
      debugLog("server/vite.ts:38", "Skipping API route", { url }, "A,D");
      // #endregion
      return next();
    }
    
    // Only use Vite middleware for source files, Vite internal routes, and HMR
    if (url.startsWith("/src/") || 
        url.startsWith("/@") || 
        url.startsWith("/node_modules/") || 
        url.startsWith("/vite-hmr") ||
        url.startsWith("/@vite") ||
        url.startsWith("/@fs") ||
        url.startsWith("/@id")) {
      // #region agent log
      debugLog("server/vite.ts:56", "Using Vite middleware", { url, statusCodeBefore: res.statusCode }, "A");
      // #endregion
      const originalEnd = res.end;
      res.end = function(...args: any[]) {
        // #region agent log
        debugLog("server/vite.ts:60", "Vite middleware response", { url, statusCode: res.statusCode }, "A");
        // #endregion
        return originalEnd.apply(res, args);
      };
      return vite.middlewares(req, res, next);
    }
    
    // For everything else (HTML routes), skip Vite and go to our catch-all
    // #region agent log
    debugLog("server/vite.ts:53", "Skipping Vite, going to catch-all", { url }, "D");
    // #endregion
    next();
  });

  // Catch-all route for SPA - handles all HTML routes
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    // #region agent log
    debugLog("server/vite.ts:70", "Catch-all route entered", { url, method: req.method, statusCode: res.statusCode }, "B,C,D");
    // #endregion

    // Skip API routes
    if (url.startsWith("/api")) {
      // #region agent log
      debugLog("server/vite.ts:62", "Skipping API in catch-all", { url }, "D");
      // #endregion
      return next();
    }

    // Serve the SPA for all routes
    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      // #region agent log
      debugLog("server/vite.ts:93", "Before file check", { clientTemplate, exists: fs.existsSync(clientTemplate) }, "B");
      // #endregion

      // Check if file exists
      if (!fs.existsSync(clientTemplate)) {
        // #region agent log
        debugLog("server/vite.ts:98", "File not found, returning 404", { clientTemplate }, "B");
        // #endregion
        return res.status(404).send("index.html not found");
      }

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      // #region agent log
      debugLog("server/vite.ts:115", "Sending HTML response", { url, statusCode: 200 }, "B");
      // #endregion
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      // #region agent log
      debugLog("server/vite.ts:117", "Error in catch-all", { url, error: (e as Error).message, stack: (e as Error).stack }, "B,C");
      // #endregion
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
