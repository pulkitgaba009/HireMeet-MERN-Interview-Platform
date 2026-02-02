import { protectRoute } from "../middleware/protectRoute.js";
import { createSession,getActiveSession,getMyRecentSessions,getSessionById,joinSession,endSession } from "../controller/sessionController.js";
import express from "express";

const router = express.Router();

router.post("/",protectRoute,createSession);

router.get("/active",protectRoute,getActiveSession);

router.get("/my-recent",protectRoute,getMyRecentSessions);

router.get("/:id",protectRoute,getSessionById);

router.post("/:id",protectRoute,joinSession);

router.post("/:id",protectRoute,endSession);

export default router;