import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 🔥 ADD THIS
axiosInstance.interceptors.request.use((config) => {
  console.log("AXIOS CALL →", config.baseURL + config.url);
  return config;
});

export default axiosInstance;