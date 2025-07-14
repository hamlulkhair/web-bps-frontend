// src/context/PublicationContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { publicationService } from "../services/publicationService";
import { useAuth } from "../hooks/useAuth";

const PublicationContext = createContext(null);

const PublicationProvider = ({ children }) => {
  const { token } = useAuth(); // Mendapatkan token dari context Auth
  const [publications, setPublications] = useState([]); // State untuk menyimpan data publikasi
  const [loading, setLoading] = useState(true); // State untuk menampilkan loading
  const [error, setError] = useState(null); // State untuk menangani error

  // useEffect untuk mengambil data publikasi ketika token ada (user sudah login)
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return; // Jika tidak ada token, tidak perlu fetch data
      setLoading(true);
      try {
        const data = await publicationService.getPublications(); // Mengambil data publikasi dari API
        setPublications(data); // Menyimpan data publikasi
        setError(null); // Reset error jika berhasil
      } catch (err) {
        setError(err.message); // Menangani error jika gagal mengambil data
      } finally {
        setLoading(false); // Menghentikan loading
      }
    };

    fetchData(); // Panggil fetchData setiap kali token berubah
  }, [token]);

  // Fungsi untuk menambah publikasi
  const addPublication = async (newPub) => {
    try {
      const added = await publicationService.addPublication(newPub); // Menambahkan publikasi baru ke API
      setPublications((prev) => [added, ...prev]); // Menambah publikasi yang baru ditambahkan ke state
      setError(null); // Reset error jika berhasil
    } catch (err) {
      setError(err.message); // Menangani error jika gagal menambah publikasi
      throw err; // Melemparkan error agar bisa ditangani di komponen yang memanggil
    }
  };

  // Fungsi untuk mengedit publikasi
  const editPublication = async (updatedPub) => {
    try {
      // Proses edit publikasi, misalnya mengupdate publikasi ke API
      setPublications((prev) =>
        prev.map((pub) =>
          pub.id === updatedPub.id ? updatedPub : pub
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fungsi untuk menghapus publikasi
  const deletePublication = async (id) => {
    try {
      // Proses delete publikasi, misalnya menghapus publikasi di API
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Mengembalikan context dengan semua state dan fungsi yang dibutuhkan
  return (
    <PublicationContext.Provider
      value={{
        publications,
        loading,
        error,
        addPublication,
        editPublication,
        deletePublication,
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};

export { PublicationContext, PublicationProvider };
