import express from "express";
import path from "path";
import chatRoutes from "./routes/chatRoute.js";
import { ENV } from "./lib/env.js";
import connectDB from "./config/db.js";
import cors from "cors";
import { inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import { functions } from "./config/inngest.js";
import { clerkMiddleware } from '@clerk/express';
import sessionRoutes from "./routes/sessionRoutes.js";
import authRoute  from "./routes/authRoute.js";
import questionsRoute from "./routes/questionRoute.js"

const app = express();
const __dirname = path.resolve();

// Render / other reverse proxies terminate TLS; Clerk needs correct proto/host for auth.
app.set("trust proxy", 1);

app.use(express.json());

const allowedOrigins = [
  // local dev
  "http://localhost:5173",
  // production frontend (Render)
  "https://hiremeet-mern-interview-platform.onrender.com",
  // optional custom client url
  ENV.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

if (ENV.NODE_ENV === "production") {
  if (!ENV.CLERK_SECRET_KEY || !ENV.CLERK_PUBLISHABLE_KEY) {
    console.error(
      "Clerk: CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set in production or API auth will return 401.",
    );
  }
}

app.use(
  clerkMiddleware({
    secretKey: ENV.CLERK_SECRET_KEY,
    publishableKey: ENV.CLERK_PUBLISHABLE_KEY,
  }),
);
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions",sessionRoutes);
app.use("/api/questions", questionsRoute);

app.post("/api/execute", async (req, res) => {
  try {
    const response = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({ error: "Execution failed" });
  }
});

if (ENV.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "..", "frontend", "dist");

  app.use(express.static(frontendPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`App is running at PORT : ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("💥 Error starting the server !!! : ", error);
  }
};

startServer();
