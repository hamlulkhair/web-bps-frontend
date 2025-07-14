// src/components/PublicationListPage.jsx
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { PublicationContext } from '../context/PublicationContext';  // Mengimpor context
import { useAuth } from '../hooks/useAuth'; // Mengimpor hook autentikasi
import { useNavigate } from 'react-router-dom'; // Untuk navigasi setelah hapus/edit
import apiClient from '../api/axios'; // Menggunakan axios untuk request HTTP

export default function PublicationListPage() {
  const { publications, loading, error } = useContext(PublicationContext);  // Mengambil data publikasi dari context
  const { user } = useAuth();  // Mendapatkan informasi user dari context (untuk memastikan login)
  const navigate = useNavigate(); // Untuk navigasi ke halaman edit
  const [updatedPublications, setUpdatedPublications] = useState(publications); // Menyimpan publikasi yang sudah diperbarui

  // Jika user belum login, kita bisa arahkan ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    setUpdatedPublications(publications);
  }, [publications]);

  // Fungsi untuk mengedit publikasi
  const handleEdit = (id) => {
    navigate(`/publications/edit/${id}`);
  };

const handleDelete = async (id) => {
  try {
    // Gunakan apiClient untuk mengirimkan permintaan DELETE
    const response = await apiClient.delete(`/publikasi/${id}`);
    alert(response.data.message); // Menampilkan pesan sukses jika publikasi berhasil dihapus

    // Menghapus publikasi dari daftar setelah berhasil
    const updatedList = updatedPublications.filter(pub => pub.id !== id);
    setUpdatedPublications(updatedList);
  } catch (err) {
    console.error("Gagal menghapus publikasi:", err);
    alert("Gagal menghapus publikasi"); // Menampilkan pesan error jika gagal
  }
};


  if (loading) {
    return <div>Loading...</div>; // Menampilkan loading ketika data sedang dimuat
  }

  if (error) {
    return <div>{error}</div>; // Menampilkan error jika terjadi masalah saat mengambil data
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Daftar Publikasi BPS Provinsi Aceh</h1>
        <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
      </header>

      <div className="relative overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-center w-16">No</th>
              <th scope="col" className="px-6 py-3">Judul</th>
              <th scope="col" className="px-6 py-3">Tanggal Rilis</th>
              <th scope="col" className="px-6 py-3 text-center">Sampul</th>
              <th scope="col" className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {updatedPublications.map((pub, idx) => (
              <tr key={pub.id} className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 font-medium text-gray-900 text-center">{idx + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{pub.title}</td>
                <td className="px-6 py-4 text-gray-600">{pub.releaseDate}</td>
                <td className="px-6 py-4 flex justify-center items-center">
                  <img
                    src={pub.coverUrl}
                    alt={`Sampul ${pub.title}`}
                    className="h-24 w-auto object-cover rounded shadow-md"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/100x140/cccccc/ffffff?text=Error';
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEdit(pub.id)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
