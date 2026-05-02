import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Channel,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLeaveCall = async () => {
    try {
      if (call) {
        await call.leave();
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error leaving call:", error);
      navigate("/dashboard");
    }
  };

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center text-base-content">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-3 relative str-video min-h-0">
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="flex items-center justify-between gap-2 bg-base-100 p-3 rounded-lg shadow border border-base-300">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-base-content">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-sm gap-2 ${isChatOpen ? "btn-primary" : "btn-ghost"}`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="size-4" />
              Chat
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 bg-base-300 rounded-lg overflow-hidden relative border border-base-300">
          <SpeakerLayout />
        </div>

        <div className="bg-base-100 p-3 rounded-lg shadow border border-base-300 flex justify-center gap-3">
          <CallControls onLeave={handleLeaveCall} />
        </div>
      </div>

      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-lg shadow overflow-hidden bg-base-200 border border-base-300 transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-base-300 p-3 border-b border-base-300 flex items-center justify-between">
                <h3 className="font-semibold text-base-content">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-base-content/50 hover:text-base-content transition-colors"
                  title="Close chat"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageComposer focus />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;
