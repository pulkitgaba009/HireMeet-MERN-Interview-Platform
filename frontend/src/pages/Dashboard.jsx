import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions,
} from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
    problem: "",
    difficulty: "",
  });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } =
    useActiveSessions();

  const { data: recentSessionsData, isLoading: loadingRecentSessions } =
    useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.session || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user?.id) return false;

    return (
      session.host?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    );
  };

  return (
    <>
      <div className="min-h-screen bg-black text-base-content">
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* ================= WELCOME ================= */}
          <div className="bg-black/70 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  Welcome back, {user?.firstName || "User"} 👋
                </h1>
                <p className="text-base-content/60 mt-2">
                  Ready to level up your coding skills?
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create Session →
              </button>

            </div>
          </div>

          {/* ================= STATS + ACTIVE ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Stats */}
            <div className="bg-black/70 backdrop-blur-xl border border-base-300 rounded-2xl p-4">
              <div className="bg-base-100/80 border border-base-300 rounded-xl p-4">
                <StatsCards
                  activeSessionsCount={activeSessions.length}
                  recentSessionsCount={recentSessions.length}
                />
              </div>
            </div>

            {/* Active Sessions */}
            <div className="lg:col-span-2 bg-black/70 backdrop-blur-xl border border-base-300 rounded-2xl p-4">
              <div className="bg-base-100/80 border border-base-300 rounded-xl p-4">
                <ActiveSessions
                  sessions={activeSessions}
                  isLoading={loadingActiveSessions}
                  isUserInSession={isUserInSession}
                />
              </div>
            </div>

          </div>

          {/* ================= RECENT ================= */}
          <div className="bg-black/70 backdrop-blur-xl border border-base-300 rounded-2xl p-4">
            <div className="bg-base-100/80 border border-base-300 rounded-xl p-4">
              <RecentSessions
                sessions={recentSessions}
                isLoading={loadingRecentSessions}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ================= MODAL ================= */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;