import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  const sessionId = session?._id;
  const callId = session?.callId;
  const sessionStatus = session?.status;
  const problem = session?.problem;
  const difficulty = session?.difficulty;
  const userId = user?.id;
  const userName = user?.firstName || user?.username || "Anonymous";
  const userImage = user?.imageUrl || "";

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      if (loadingSession) return;

      setIsInitializingCall(true);

      if (!callId) {
        console.log("No session or callId:", { sessionId, callId });
        setIsInitializingCall(false);
        return;
      }

      if (!isHost && !isParticipant) {
        console.log("User is not host or participant:", {
          isHost,
          isParticipant,
        });
        setIsInitializingCall(false);
        return;
      }

      if (sessionStatus === "completed") {
        console.log("Session is completed");
        setIsInitializingCall(false);
        return;
      }

      if (!sessionId) {
        console.log("Session has no _id");
        setIsInitializingCall(false);
        return;
      }

      if (!userId) {
        console.log("User not authenticated");
        setIsInitializingCall(false);
        return;
      }

      console.log("Initializing call for session:", sessionId, "user:", userId);

      try {
        const authToken = await getToken();
        if (!authToken) {
          console.log("No auth token");
          toast.error("Authentication failed");
          return;
        }

        const { streamToken, userId: streamUserId, apiKey, videoToken } =
          await sessionApi.getStreamToken(sessionId, authToken);

        const client = await initializeStreamClient(
          {
            id: streamUserId,
            name: userName,
            image: userImage,
          },
          videoToken || streamToken,
        );

        setStreamClient(client);

        videoCall = client.call("default", callId);
        await videoCall.getOrCreate({
          data: {
            custom: {
              problem,
              difficulty,
            },
          },
        });
        await videoCall.join({ create: true });
        setCall(videoCall);

        chatClientInstance = StreamChat.getInstance(apiKey);
        await chatClientInstance.connectUser(
          {
            id: streamUserId,
            name: userName,
            image: userImage,
          },
          streamToken,
        );
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", callId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error initializing call:", error);
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (!loadingSession && sessionId && userId) {
      initCall();
    } else if (!loadingSession) {
      setIsInitializingCall(false);
    }

    return () => {
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [
    sessionId,
    callId,
    sessionStatus,
    problem,
    difficulty,
    loadingSession,
    isHost,
    isParticipant,
    getToken,
    userId,
    userName,
    userImage,
  ]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
