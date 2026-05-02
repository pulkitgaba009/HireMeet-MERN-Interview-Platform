import {
  chatClient,
  streamClient,
  upsertStreamUser,
  generateStreamToken,
  generateVideoToken,
} from "../config/stream.js";
import Session from "../models/SessionModel.js";

const ensureStreamUser = async (user) => {
  await upsertStreamUser({
    id: user.clerkId,
    name: user.name || "User",
    image: user.profileImage || "",
  });
};

const ensureSessionChatChannel = async (session, user) => {
  const channel = chatClient.channel("messaging", session.callId, {
    name: `${session.problem} Session`,
    created_by_id: user.clerkId,
    members: [user.clerkId],
  });

  const state = await channel.create({
    messages: { limit: 30 },
    members: { limit: 30 },
    presence: false,
    state: true,
    watch: false,
  });

  const isMember = state.members?.some(
    (member) => member.user_id === user.clerkId || member.user?.id === user.clerkId,
  );

  if (!isMember) {
    await channel.addMembers([user.clerkId]);
  }

  return channel;
};

const isSessionMember = (session, userId) =>
  session.host?.toString() === userId.toString() ||
  session.participant?.toString() === userId.toString();

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

    await ensureStreamUser(req.user);

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

    await ensureSessionChatChannel(session, req.user);

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
      deletedFor: { $not: { $in: [userId] } },
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

    await ensureStreamUser(req.user);

    // Assign participant
    session.participant = userId;
    await session.save();

    await ensureSessionChatChannel(session, req.user);

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

    // Best-effort cleanup; the DB status should still move to past sessions.
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (streamError) {
      console.warn("Stream call cleanup failed:", streamError.message);
    }

    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (chatError) {
      console.warn("Stream chat cleanup failed:", chatError.message);
    }

    // Update session status after successful cleanup
    session.status = "completed";
    await session.save();

    res.status(200).json({ message: "Session Ended Successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) {
      // Session already deleted, treat as success
      return res.status(200).json({ message: "Session removed from your past sessions" });
    }

    if (!isSessionMember(session, userId)) {
      return res
        .status(403)
        .json({ message: "You can only delete sessions you joined" });
    }

    if (session.status !== "completed") {
      return res
        .status(400)
        .json({ message: "End the session before deleting it from history" });
    }

    const currentUserId = userId.toString();
    session.deletedFor = session.deletedFor || [];
    const deletedForIds = session.deletedFor.map((deletedUserId) =>
      deletedUserId.toString(),
    );

    if (!deletedForIds.includes(currentUserId)) {
      session.deletedFor.push(userId);
      deletedForIds.push(currentUserId);
    }

    const sessionMemberIds = [session.host, session.participant]
      .filter(Boolean)
      .map((memberId) => memberId.toString());
    const isDeletedForEveryMember = sessionMemberIds.every((memberId) =>
      deletedForIds.includes(memberId),
    );

    if (isDeletedForEveryMember) {
      await Session.findByIdAndDelete(id);
    } else {
      await session.save();
    }

    res.status(200).json({ message: "Session removed from your past sessions" });
  } catch (error) {
    console.log("Error in deleteSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GENERATE STREAM TOKEN
 * - Generate token for user to join Stream Chat/Video
 */
const getStreamToken = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log("=== getStreamToken called ===");
    console.log("Request body:", req.body);
    console.log("sessionId:", sessionId);
    console.log("User:", req.user ? { _id: req.user._id, clerkId: req.user.clerkId } : "No user");

    if (!sessionId) {
      console.log("ERROR: sessionId is missing");
      return res.status(400).json({ message: "sessionId is required" });
    }

    // Verify session exists
    console.log("Looking for session with ID:", sessionId);
    const session = await Session.findById(sessionId);
    console.log("Session found:", session ? "YES" : "NO");
    if (session) {
      console.log("Session details:", { _id: session._id, callId: session.callId, status: session.status });
    }

    if (!session) {
      console.log("ERROR: Session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    const isMemberOfSession =
      session.host?.toString() === req.user._id.toString() ||
      session.participant?.toString() === req.user._id.toString();

    if (!isMemberOfSession) {
      return res
        .status(403)
        .json({ message: "Join this session before requesting chat/video tokens" });
    }

    const clerkId = req.user.clerkId;
    const callId = session.callId;
    console.log("Generating tokens for clerkId:", clerkId, "callId:", callId);

    await ensureStreamUser(req.user);
    await ensureSessionChatChannel(session, req.user);

    // Generate Stream Chat token (same as chatController)
    let streamToken;
    try {
      streamToken = await generateStreamToken(clerkId);
      console.log("✅ Chat token generated successfully");
    } catch (tokenError) {
      console.error("❌ Chat token generation failed:", tokenError);
      return res.status(500).json({ message: "Failed to generate chat token" });
    }

    // Generate Stream Video token
    let videoToken;
    try {
      videoToken = await generateVideoToken(clerkId, callId);
      console.log("✅ Video token generated successfully");
    } catch (videoError) {
      console.error("❌ Video token generation failed:", videoError);
      return res.status(500).json({ message: "Failed to generate video token" });
    }

    console.log("=== Tokens generated successfully ===");
    res.status(200).json({
      streamToken,
      videoToken,
      userId: clerkId,
      apiKey: process.env.STREAM_API_KEY,
    });
  } catch (error) {
    console.error("❌ Error in getStreamToken:", error);
    console.error("Error stack:", error.stack);
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
  deleteSession,
  getStreamToken,
};
