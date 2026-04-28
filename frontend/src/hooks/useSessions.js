import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

const resolveToken = async (getToken) => {
  const token = await getToken();
  if (token) return token;
  return getToken({ skipCache: true });
};

// ✅ CREATE SESSION
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["create-session"],
    mutationFn: async (data) => {
      const token = await resolveToken(getToken);
      return sessionApi.createSession(data, token);
    },
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
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();

  return useQuery({
    queryKey: ["active-sessions", userId],
    queryFn: async () => {
      const token = await resolveToken(getToken);
      if (!token) throw new Error("Missing auth token");
      return sessionApi.getActiveSessions(token);
    },
    enabled: !!isLoaded && !!isSignedIn && !!userId,
  });
};

// ✅ GET MY RECENT SESSIONS
export const useMyRecentSessions = () => {
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();

  return useQuery({
    queryKey: ["my-recent-sessions", userId],
    queryFn: async () => {
      const token = await resolveToken(getToken);
      if (!token) throw new Error("Missing auth token");
      return sessionApi.getMyRecentSessions(token);
    },
    enabled: !!isLoaded && !!isSignedIn && !!userId,
  });
};

// ✅ GET SESSION BY ID
export const useSessionById = (id) => {
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();

  return useQuery({
    queryKey: ["session", id, userId],
    queryFn: async () => {
      const token = await resolveToken(getToken);
      if (!token) throw new Error("Missing auth token");
      return sessionApi.getSessionById(id, token);
    },
    enabled: !!id && !!isLoaded && !!isSignedIn && !!userId,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
};

// ✅ JOIN SESSION
export const useJoinSession = (id) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["join-session", id],
    mutationFn: async () => {
      const token = await resolveToken(getToken);
      return sessionApi.joinSession(id, token);
    },
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
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["end-session", id],
    mutationFn: async () => {
      const token = await resolveToken(getToken);
      return sessionApi.endSession(id, token);
    },
    onSuccess: () => {
      toast.success("Successfully ended the session!");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session", id] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end session"),
  });
};