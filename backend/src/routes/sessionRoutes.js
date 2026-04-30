import { protectRoute } from "../middleware/protectRoute.js";
import { createSession,getActiveSession,getMyRecentSessions,getSessionById,joinSession,endSession,getStreamToken } from "../controller/sessionController.js";
import express from "express";
import Session from "../models/SessionModel.js";

const router = express.Router();

router.post("/",protectRoute,createSession);

router.get("/active",protectRoute,getActiveSession);

router.get("/my-recent",protectRoute,getMyRecentSessions);

// Debug endpoint
router.get("/debug/all", async (req, res) => {
  try {
    const sessions = await Session.find().select("_id problem callId");
    res.json({ count: sessions.length, sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/stream-token",protectRoute,getStreamToken);

router.get("/:id",protectRoute,getSessionById);

router.post("/:id/join",protectRoute,joinSession);

router.post("/:id/end",protectRoute,endSession);

export default router;