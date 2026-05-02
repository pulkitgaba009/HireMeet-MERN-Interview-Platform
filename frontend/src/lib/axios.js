import axios from "axios";

const axiosInstance = axios.create({
  // Use relative API in production (same-origin) unless explicitly overridden.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// 🔥 ADD THIS
axiosInstance.interceptors.request.use((config) => {
  // Helpful during debugging; safe to keep in prod.
  console.log("AXIOS CALL →", `${config.baseURL || ""}${config.url || ""}`);
  return config;
});

export default axiosInstance;