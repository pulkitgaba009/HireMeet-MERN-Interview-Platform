import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const { data: res } = await axiosInstance.post("/sessions", data);
    return res;
  },

  getActiveSessions: async () => {
    const { data } = await axiosInstance.get("/sessions/active");
    return data;
  },

  getMyRecentSessions: async () => {
    const { data } = await axiosInstance.get("/sessions/my-recent");
    return data;
  },

  getSessionById: async (id) => {
    const { data } = await axiosInstance.get(`/sessions/${id}`);
    return data;
  },

  joinSession: async (id) => {
    const { data } = await axiosInstance.post(`/sessions/${id}/join`);
    return data;
  },

  endSession: async (id) => {
    const { data } = await axiosInstance.delete(`/sessions/${id}`);
    return data;
  },

  getStreamToken: async () => {
    const { data } = await axiosInstance.get(`/chat/token`);
    return data;
  },
};