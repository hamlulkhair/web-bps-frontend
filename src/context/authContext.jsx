// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";
import { authService } from "../services/authService";

// Membuat context untuk autentikasi
const AuthContext = createContext(null);

// Membuat AuthProvider untuk membungkus aplikasi dan menyediakan state autentikasi
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk login
  const loginAction = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password); // Panggil login dari authService
      setUser(response.user);
      setToken(response.token);
      
      // Simpan data pengguna dan token ke localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      return response; // Kembalikan response untuk penggunaan lebih lanjut
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message); // Menyimpan error jika login gagal
      throw error; // Melempar error agar bisa ditangani di komponen
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk logout
  const logoutAction = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout(); // Panggil logout dari authService

      // Hapus data pengguna dan token dari state dan localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return true;
    } catch (error) {
      console.error('Logout error:', error.message);
      setError(error.message); // Menyimpan error jika logout gagal
      throw error; // Melempar error agar bisa ditangani di komponen
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membersihkan error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginAction,
        logoutAction,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
