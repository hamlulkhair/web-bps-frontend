// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

// Custom hook untuk mengakses nilai dari AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Memastikan bahwa hook hanya digunakan di dalam AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context; // Mengembalikan context yang berisi user, token, loginAction, logoutAction, dll.
};
