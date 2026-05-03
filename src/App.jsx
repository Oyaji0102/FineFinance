import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Placeholders for Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />
      } />

      {/* User Routes */}
      <Route path="/user/*" element={
        user?.role === 'user' ? <UserLayout /> : <Navigate to="/login" />
      } />

      {/* Default Redirect */}
      <Route path="*" element={
        <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'user' ? '/user' : '/login'} />
      } />
    </Routes>
  );
}

export default App;
