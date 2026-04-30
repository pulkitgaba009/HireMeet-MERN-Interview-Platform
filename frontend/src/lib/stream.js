import { StreamVideoClient } from "@stream-io/video-react-sdk";

let streamClient = null;

export const initializeStreamClient = async (user, token) => {
  try {
    const apiKey = import.meta.env.VITE_STREAM_API_KEY;

    if (!apiKey) {
      throw new Error("VITE_STREAM_API_KEY is not set");
    }

    const client = new StreamVideoClient({
      apiKey,
      token,
      user,
      options: {
        logLevel: "info",
      },
    });

    streamClient = client;
    return client;
  } catch (error) {
    console.error("Error initializing Stream client:", error);
    throw error;
  }
};

export const disconnectStreamClient = async () => {
  try {
    if (streamClient) {
      await streamClient.disconnectUser();
      streamClient = null;
    }
  } catch (error) {
    console.error("Error disconnecting Stream client:", error);
    throw error;
  }
};
