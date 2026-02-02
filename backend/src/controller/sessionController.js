import { chatClient, streamClient } from "../config/stream.js";
import Session from "../models/SessionModel.js";

/**
 * CREATE A NEW SESSION
 * - Creates DB session
 * - Creates Stream Video call
 * - Creates Stream Chat channel
 */
const createSession = async (req, res) => {
  try {
    // Extract request data
    const { problem, difficulty } = req.body;

    // Logged-in user info (from protectRoute middleware)
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    // Validate input
    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and Difficulty are required" });
    }

    // Generate unique session/call ID
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Create session in MongoDB
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // Create Stream Video call
    const call = streamClient.video.call("default", callId);
    await call.getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    // Create Stream Chat channel for session
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    // Send response
    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET ALL ACTIVE SESSIONS
 */
const getActiveSession = async (req, res) => {
  try {
    const session = await Session.find({ status: "active" })
      // Populate host details
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getActiveSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET RECENT SESSIONS OF CURRENT USER
 * - User can be host or participant
 */
const getMyRecentSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed", // ✅ fixed typo
      $or: [{ host: userId }, { participant: userId }], // ✅ fixed typo syntax
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET SESSION BY ID
 */
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId"); // ✅ fixed typo

    if (!session)
      return res.status(404).json({
        message: "Session Not Found",
      });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * JOIN A SESSION AS PARTICIPANT
 */
const joinSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session)
      return res.status(404).json({
        message: "Session Not Found",
      });

    // Check if participant slot already filled
    if (session.participant)
      return res.status(409).json({ message: "Session is full" });

    if (session.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Host cannot join their own session as participant" });
    }

    // Assign participant
    session.participant = userId;
    await session.save();

    // Add participant to Stream Chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ message: "Joined session successfully" });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * END A SESSION
 * - Only host can end
 * - Deletes Stream Video call & Chat channel
 */
const endSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session)
      return res.status(404).json({
        message: "Session Not Found",
      });

    // Only host can end the session
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the host can end the session",
      });
    }

    // Prevent double ending
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // Update session status
    session.status = "completed";
    await session.save();

    // Delete Stream Video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // Delete Stream Chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    res.status(200).json({ message: "Session Ended Successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createSession,
  getActiveSession,
  getMyRecentSessions,
  getSessionById,
  joinSession,
  endSession,
};
