import axios from "axios";

const trimmedApi = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ?? "";
const baseURL = trimmedApi.length > 0 ? trimmedApi : "/api";

const axiosInstance = axios.create({
  // Use relative API in production (same-origin) unless explicitly overridden.
  // Avoid trailing slash on VITE_API_URL or requests become /api//sessions.
  baseURL,
  withCredentials: true,
});

// 🔥 ADD THIS
axiosInstance.interceptors.request.use((config) => {
  // Helpful during debugging; safe to keep in prod.
  console.log("AXIOS CALL →", `${config.baseURL || ""}${config.url || ""}`);
  return config;
});

export default axiosInstance;