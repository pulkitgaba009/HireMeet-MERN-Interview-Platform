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

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(
  cors({
    origin: ENV.CLIENT_URL || "https://hiremeet-mern-interview-platform.onrender.com",
    credentials: true,
  }),
);
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/chat", chatRoutes);

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
