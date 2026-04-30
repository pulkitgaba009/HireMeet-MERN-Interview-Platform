import axiosInstance from "../lib/axios";

const withAuthHeaders = (token) => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

export const sessionApi = {
  createSession: async (data, token) => {
    const { data: res } = await axiosInstance.post(
      "/sessions",
      data,
      withAuthHeaders(token),
    );
    return res;
  },

  getActiveSessions: async (token) => {
    const { data } = await axiosInstance.get(
      "/sessions/active",
      withAuthHeaders(token),
    );
    return data;
  },

  getMyRecentSessions: async (token) => {
    const { data } = await axiosInstance.get(
      "/sessions/my-recent",
      withAuthHeaders(token),
    );
    return data;
  },

  getSessionById: async (id, token) => {
    const { data } = await axiosInstance.get(
      `/sessions/${id}`,
      withAuthHeaders(token),
    );
    return data;
  },

  joinSession: async (id, token) => {
    const { data } = await axiosInstance.post(
      `/sessions/${id}/join`,
      {},
      withAuthHeaders(token),
    );
    return data;
  },

  endSession: async (id, token) => {
    const { data } = await axiosInstance.post(
      `/sessions/${id}/end`,
      {},
      withAuthHeaders(token),
    );
    return data;
  },

  deleteSession: async (id, token) => {
    const { data } = await axiosInstance.delete(
      `/sessions/${id}`,
      withAuthHeaders(token),
    );
    return data;
  },

  getStreamToken: async (sessionId, token) => {
    const { data } = await axiosInstance.post(
      "/sessions/stream-token",
      { sessionId },
      withAuthHeaders(token),
    );
    return data;
  },
};
