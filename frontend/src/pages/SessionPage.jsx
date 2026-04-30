import { useParams, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { useSessionById, useJoinSession } from "../hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import { Loader2Icon } from "lucide-react";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import useStreamClient from "../hooks/useStreamClient";

function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: sessionData, isLoading: sessionLoading } = useSessionById(id);
  const joinSessionMutation = useJoinSession(id);
  const {
    mutate: joinSession,
    isPending: isJoiningMutation,
    isError: hasJoinError,
    isSuccess: hasJoinedSession,
  } = joinSessionMutation;

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;
  const isFullForCurrentUser =
    !!session?.participant && !isHost && !isParticipant;
  const joinAttemptKeyRef = useRef(null);
  const joinAttemptKey = `${id}:${user?.id || ""}`;

  useEffect(() => {
    const hasAttemptedCurrentSession =
      joinAttemptKeyRef.current === joinAttemptKey;
    const shouldJoinAsParticipant =
      session &&
      user &&
      !isHost &&
      !session.participant &&
      !hasAttemptedCurrentSession &&
      !isJoiningMutation &&
      !hasJoinError;

    if (!shouldJoinAsParticipant) return;

    joinAttemptKeyRef.current = joinAttemptKey;
    joinSession();
  }, [
    session,
    user,
    isHost,
    isJoiningMutation,
    hasJoinError,
    joinAttemptKey,
    joinSession,
  ]);

  const isJoiningSession =
    !!session &&
    !!user &&
    !isHost &&
    !isParticipant &&
    !isFullForCurrentUser &&
    !hasJoinError &&
    (isJoiningMutation || hasJoinedSession);

  const {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  } = useStreamClient(
    session,
    sessionLoading || isJoiningSession,
    isHost,
    isParticipant,
  );

  if (sessionLoading || isJoiningSession || isInitializingCall) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">
            {isJoiningSession
              ? "Joining session..."
              : "Setting up your session..."}
          </p>
        </div>
      </div>
    );
  }

  if (isFullForCurrentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <p className="text-lg text-error mb-4">This session is already full</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!session || !call) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <p className="text-lg text-error mb-4">Failed to load session</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={streamClient}>
      <StreamCall call={call}>
        <div className="h-screen w-screen bg-base-100 flex flex-col">
          {/* Header */}
          <div className="bg-base-200 border-b border-base-300 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{session.problem}</h1>
              <p className="text-sm text-base-content/60">
                Difficulty: {session.difficulty}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-sm btn-ghost"
            >
              Leave Session
            </button>
          </div>

          {/* Video and Chat */}
          <div className="flex-1 overflow-hidden">
            <VideoCallUI chatClient={chatClient} channel={channel} />
          </div>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}

export default SessionPage;
