// src/components/AddPublicationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublications } from '../hooks/usePublications'; // Mengimpor custom hook
import { uploadImageToCloudinary } from '../services/publicationService'; // Mengimpor fungsi upload gambar

export default function AddPublicationPage() {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const { addPublication } = usePublications(); // Mengakses fungsi addPublication dari context
  const navigate = useNavigate();

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!title || !releaseDate) {
      alert('Judul dan Tanggal Rilis harus diisi!');
      return;
    }

    let coverUrl = '';
    if (coverFile) {
      try {
        // Upload gambar ke Cloudinary jika ada file
        coverUrl = await uploadImageToCloudinary(coverFile);
      } catch (err) {
        alert('Gagal upload gambar: ' + err.message);
        return;
      }
    } else {
      // Gunakan gambar placeholder jika tidak ada file
      coverUrl = `https://placehold.co/200x280/7f8c8d/ffffff?text=${encodeURIComponent(title)}`;
    }

    const newPublication = {
      title,
      releaseDate,
      description,
      coverUrl,
    };

    try {
      // Menambahkan publikasi baru
      await addPublication(newPublication);
      navigate('/publications'); // Redirect ke halaman publikasi setelah berhasil menambah
      setTitle('');
      setReleaseDate('');
      setDescription('');
      setCoverFile(null); // Reset form setelah publikasi berhasil ditambahkan
    } catch (err) {
      alert('Gagal menambah publikasi: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Publikasi Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="coverFile" className="block text-sm font-medium text-gray-700 mb-1">Sampul</label>
          <input
            type="file"
            id="coverFile"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Tambah Publikasi
        </button>
      </form>
    </div>
  );
}
