// src/api/axios.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // Menggunakan VITE_API_URL dari file .env
  withCredentials: true, // Menyertakan cookies dalam setiap permintaan
  headers: {
    Accept: "application/json", // Mengatur header untuk menerima JSON
    "Content-Type": "application/json", // Mengatur header untuk mengirimkan JSON
  },
});

// Interceptor untuk menambahkan Authorization header dari localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Mendapatkan token dari localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Menambahkan token ke header Authorization
    }
    return config;
  },
  (error) => Promise.reject(error) // Menangani error jika terjadi masalah
);

export default apiClient;
