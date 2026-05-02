import { useParams, useNavigate } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useEndSession, useSessionById, useJoinSession } from "../hooks/useSessions";
import { useUser } from "@clerk/clerk-react";
import { Loader2Icon } from "lucide-react";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import toast from "react-hot-toast";
import VideoCallUI from "../components/VideoCallUI";
import SessionTopNav from "../components/SessionTopNav";
import SessionProblemDetails from "../components/SessionProblemDetails";
import CodeEditor from "../components/CodeEditor";
import OutputPanel from "../components/OutputPanel";
import useStreamClient from "../hooks/useStreamClient";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";

function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: sessionData, isLoading: sessionLoading } = useSessionById(id);
  const joinSessionMutation = useJoinSession(id);
  const endSessionMutation = useEndSession(id);
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

  const [viewMode, setViewMode] = useState("both");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const problem = useMemo(
    () =>
      session?.problem
        ? Object.values(PROBLEMS).find((p) => p.title === session.problem) ?? null
        : null,
    [session?.problem],
  );

  const participantCount = session
    ? 1 + (session.participant ? 1 : 0)
    : 0;

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

  const handleEndSession = () => {
    const confirmed = window.confirm(
      "End this session and move it to past sessions?",
    );
    if (!confirmed) return;

    endSessionMutation.mutate(undefined, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[selectedLanguage] || "");
      setOutput("");
    } else {
      setCode("");
      setOutput("");
    }
  }, [problem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (problem) {
      setCode(problem.starterCode[newLang] || "");
    }
    setOutput("");
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput("");

      const result = await executeCode(selectedLanguage, code);

      if (!result.success) {
        toast.error(result.error || "Runtime error");
        setOutput(result.output || "");
        return;
      }

      setOutput(result.output || "");
    } catch (error) {
      console.error(error);
      toast.error("Execution error.");
    } finally {
      setIsRunning(false);
    }
  };

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

  const resizeHandleH =
    "w-1.5 bg-base-300 hover:bg-primary transition-colors cursor-col-resize";
  const resizeHandleV =
    "h-1.5 bg-base-300 hover:bg-primary transition-colors cursor-row-resize";

  const workspacePanels = (
    <PanelGroup direction="vertical" className="h-full">
      <Panel defaultSize={42} minSize={22}>
        <SessionProblemDetails
          problem={problem}
          session={session}
          isHost={isHost}
          participantCount={participantCount}
          onEndSession={handleEndSession}
          endSessionPending={endSessionMutation.isPending}
        />
      </Panel>
      <PanelResizeHandle className={resizeHandleV} />
      <Panel defaultSize={58} minSize={28}>
        <PanelGroup direction="vertical" className="h-full">
          <Panel defaultSize={72} minSize={35}>
            <CodeEditor
              selectedLanguage={selectedLanguage}
              code={code}
              isRunning={isRunning}
              onLanguageChange={handleLanguageChange}
              onCodeChange={setCode}
              onRunCode={handleRunCode}
            />
          </Panel>
          <PanelResizeHandle className={resizeHandleV} />
          <Panel defaultSize={28} minSize={18}>
            <OutputPanel output={output} isRunning={isRunning} />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );

  if (sessionLoading || isJoiningSession || isInitializingCall) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100 text-base-content">
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
      <div className="h-screen flex items-center justify-center bg-base-100 text-base-content">
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
      <div className="h-screen flex items-center justify-center bg-base-100 text-base-content">
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
        <div className="h-screen w-screen bg-base-100 flex flex-col text-base-content overflow-hidden">
          <SessionTopNav viewMode={viewMode} onViewModeChange={setViewMode} />

          <div className="flex-1 min-h-0 p-3 pt-2">
            {viewMode === "canvas" && (
              <div className="h-full rounded-lg overflow-hidden border border-base-300 bg-base-200 p-2">
                <VideoCallUI chatClient={chatClient} channel={channel} />
              </div>
            )}

            {viewMode === "document" && (
              <div className="h-full rounded-lg overflow-hidden border border-base-300 shadow-sm">
                {workspacePanels}
              </div>
            )}

            {viewMode === "both" && (
              <PanelGroup direction="horizontal" className="h-full">
                <Panel defaultSize={58} minSize={32}>
                  <div className="h-full rounded-lg overflow-hidden border border-base-300 shadow-sm mr-1">
                    {workspacePanels}
                  </div>
                </Panel>
                <PanelResizeHandle className={resizeHandleH} />
                <Panel defaultSize={42} minSize={28}>
                  <div className="h-full rounded-lg overflow-hidden border border-base-300 bg-base-200 p-2 ml-1 shadow-sm">
                    <VideoCallUI chatClient={chatClient} channel={channel} />
                  </div>
                </Panel>
              </PanelGroup>
            )}
          </div>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}

export default SessionPage;
