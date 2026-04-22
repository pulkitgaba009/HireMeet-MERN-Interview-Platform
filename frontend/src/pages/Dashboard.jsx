import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions,
} from "../hooks/useSessions";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showCreateModal, setCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
    problem: "",
    difficulty: "",
  });

  const createSessionMutation = useCreateSession();

  const {
    data: activeSessionsData,
    isLoading: loadingActiveSessions,
  } = useActiveSessions();

  const {
    data: recentSessionsData,
    isLoading: loadingRecentSessions,
  } = useMyRecentSessions();

  if (loadingActiveSessions || loadingRecentSessions) {
    return <div>Loading...</div>;
  }

  const activeSessions = activeSessionsData?.session || [];
  const recentSessions = recentSessionsData?.sessions || [];

  console.log(activeSessions);
  console.log(recentSessions);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;