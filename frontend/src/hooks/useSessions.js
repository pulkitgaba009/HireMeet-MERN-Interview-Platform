import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

// ✅ CREATE SESSION
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-session"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => {
      toast.success("Session created successfully!");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to create session"),
  });
};

// ✅ GET ACTIVE SESSIONS
export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["active-sessions"],
    queryFn: sessionApi.getActiveSessions,
  });
};

// ✅ GET MY RECENT SESSIONS
export const useMyRecentSessions = () => {
  return useQuery({
    queryKey: ["my-recent-sessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });
};

// ✅ GET SESSION BY ID
export const useSessionById = (id) => {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
};

// ✅ JOIN SESSION
export const useJoinSession = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["join-session", id],
    mutationFn: () => sessionApi.joinSession(id),
    onSuccess: () => {
      toast.success("Successfully joined the session!");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session", id] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to join session"),
  });
};

// ✅ END SESSION
export const useEndSession = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["end-session", id],
    mutationFn: () => sessionApi.endSession(id),
    onSuccess: () => {
      toast.success("Successfully ended the session!");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session", id] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end session"),
  });
};