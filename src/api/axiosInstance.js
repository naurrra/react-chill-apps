import axios from "axios";
 
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — dijalankan sebelum setiap request dikirim.
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
// Response interceptor — dijalankan sebelum response diteruskan.
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan saat menghubungi server.";
    return Promise.reject(new Error(message));
  }
);


export default axiosInstance;
