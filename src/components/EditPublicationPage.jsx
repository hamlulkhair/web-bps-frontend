// src/components/EditPublicationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/axios'; // Menggunakan apiClient untuk request HTTP
import { uploadImageToCloudinary } from '../services/publicationService';

export default function EditPublicationPage({ onSave, onCancel }) {
  const [publication, setPublication] = useState(null); // Inisialisasi state publikasi
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Mengambil id dari URL
  const navigate = useNavigate();

  // Mengambil data publikasi berdasarkan id
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await apiClient.get(`/publikasi/${id}`);
        setPublication(response.data); // Set data publikasi
        setTitle(response.data.title);
        setReleaseDate(response.data.releaseDate);
      } catch (err) {
        setError('Gagal mengambil data publikasi');
      }
    };

    fetchPublication();
  }, [id]);

  if (!publication) {
    return <div>Loading...</div>; // Tampilkan loading jika data publikasi belum tersedia
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Jika ada file gambar baru, unggah ke Cloudinary
    let coverUrl = publication.coverUrl;
    if (coverFile) {
      try {
        coverUrl = await uploadImageToCloudinary(coverFile);  // Upload gambar baru
      } catch (err) {
        setError('Gagal mengupload gambar: ' + err.message);
        return;
      }
    }

    // Membuat objek untuk memperbarui publikasi
    const updatedPub = {
      ...publication,
      title,
      releaseDate,
      coverUrl,  // Menggunakan URL gambar baru jika ada
    };

    try {
      // Mengirimkan permintaan PUT untuk memperbarui publikasi
      await apiClient.put(`/publikasi/${publication.id}`, updatedPub);  // Menggunakan apiClient untuk mengirim permintaan PUT
      onSave(updatedPub); // Memanggil onSave untuk memperbarui publikasi di parent
      navigate('/publications'); // Redirect ke halaman daftar publikasi setelah berhasil
    } catch (err) {
      setError('Gagal memperbarui publikasi: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
          <input
            type="date"
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sampul (Gambar)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {!coverFile && (
            <div className="mt-2">
              <img
                src={publication.coverUrl}
                alt="Cover sebelumnya"
                className="h-24 w-auto object-cover rounded shadow-md"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-6 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Simpan
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
}
