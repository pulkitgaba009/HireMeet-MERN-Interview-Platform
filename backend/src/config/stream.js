import { StreamChat } from "stream-chat";
import { ENV } from "../lib/env.js";
import {StreamClient} from "@stream-io/node-sdk";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const streamClient = new StreamClient(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUsers([userData]);
    console.log("Stream user upserted successfully", userData);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId, {
      hard_delete: true,
    });
    console.log("Stream user deleted successfully", userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

export const generateStreamToken = async (userId, userName) => {
  try {
    const token = chatClient.createToken(userId);
    console.log("Stream token generated successfully for user:", userId);
    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
};

export const generateVideoToken = async (userId, callId) => {
  try {
    const token = streamClient.generateCallToken({
      user_id: userId,
      call_cids: [`default:${callId}`],
    });
    console.log("Video token generated successfully for user:", userId);
    return token;
  } catch (error) {
    console.error("Error generating Video token:", error);
    throw error;
  }
};
