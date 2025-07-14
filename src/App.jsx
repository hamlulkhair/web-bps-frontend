import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PublicationListPage from './components/PublicationListPage';
import AddPublicationPage from './components/AddPublicationPage';
import EditPublicationPage from './components/EditPublicationPage';
import Footer from './components/Footer';
import Login from './components/Login';
import ProtectedRoute from './components/protectedroute';  // Import ProtectedRoute
import { PublicationContext } from './context/PublicationContext';  // Import PublicationContext

export default function App() {
  const { publications, loading, error, addPublication, editPublication } = useContext(PublicationContext);

  const handleAddPublication = (newPub) => {
    addPublication(newPub);
  };

  const handleEditPublication = (updatedPub) => {
    editPublication(updatedPub);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/publications"
            element={
              <ProtectedRoute>
                <PublicationListPage publications={publications} loading={loading} error={error} onEdit={handleEditPublication} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publications/add"
            element={
              <ProtectedRoute>
                <AddPublicationPage onAddPublication={handleAddPublication} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publications/edit/:id"
            element={
              <ProtectedRoute>
                <EditPublicationPage onSave={handleEditPublication} />
              </ProtectedRoute>
            }
          />

          {/* Redirect Routes */}
          <Route path="/" element={<Navigate to="/publications" replace />} />
          <Route path="*" element={<Navigate to="/publications" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
