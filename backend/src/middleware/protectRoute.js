import { getAuth } from "@clerk/express";
import User from "../models/UserModels.js";

export const protectRoute = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    // Support Clerk auth object/function shapes across versions.
    const reqAuth =
      typeof req.auth === "function" ? await req.auth() : (req.auth ?? {});

    const clerkId = auth?.userId || reqAuth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - Please sign in" });
    }

    let user = await User.findOne({ clerkId });

    // Fallback: create user on first authenticated request if webhook sync is delayed.
    if (!user) {
      const claims = auth?.sessionClaims || reqAuth?.sessionClaims || {};
      const fallbackEmail = `${clerkId}@placeholder.hiremeet.local`;
      const email =
        claims?.email ||
        claims?.email_address ||
        claims?.primary_email_address ||
        fallbackEmail;
      const firstName = claims?.given_name || claims?.first_name || "";
      const lastName = claims?.family_name || claims?.last_name || "";
      const name =
        `${firstName} ${lastName}`.trim() ||
        claims?.name ||
        claims?.username ||
        "User";
      const profileImage = claims?.picture || "";

      user = await User.findOneAndUpdate(
        { clerkId },
        { clerkId, email, name, profileImage },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
