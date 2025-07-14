import React, { useState } from 'react';  // Tambahkan useState untuk email dan password
import logo from '../assets/bps-logo.png';
import { useAuth } from '../hooks/useAuth';  // Mengimpor useAuth untuk menangani login
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { loginAction, error } = useAuth();
  const navigate = useNavigate();
  
  // Menambahkan state untuk email dan password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle submit form login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!email || !password) {
      alert('Email dan password harus diisi!');
      return;
    }

    try {
      // Panggil loginAction dengan email dan password
      await loginAction(email, password);
      navigate('/publications');  // Navigasi ke halaman publikasi setelah login berhasil
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <img src={logo} alt="Logo" className="h-16 w-16" />
          <h2 className="text-2xl font-semibold text-sky-800">Login</h2>
        </div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit}  // Pastikan handleSubmit dipanggil saat submit
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Menangani input email
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Menangani input password
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
