// src/services/authService.js
import apiClient from '../api/axios'; // Mengimpor instance axios yang sudah dikonfigurasi

export const authService = {
  // Fungsi untuk login
  async login(email, password) {
    try {
      const response = await apiClient.post('/login', { email, password });
      return response.data; // Mengembalikan data dari response (misalnya, token)
    } catch (error) {
      throw new Error(
        'Gagal login: ' +
          (error.response?.data?.message || 'Terjadi kesalahan')
      );
    }
  },

  // Fungsi untuk logout
  async logout() {
    try {
      const response = await apiClient.post('/logout');

      return response.data; // Mengembalikan response logout (biasanya berupa pesan sukses)
    } catch (error) {
      throw new Error(
        'Gagal logout: ' +
          (error.response?.data?.message || 'Terjadi kesalahan')
      );
    }
  },
};
