// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import QueryPage from './pages/QueryPage';
import AuthRedirect from './pages/AuthRedirect'; // ✅ Import

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg text-gray-800 dark:text-gray-200 hover:scale-110 transition-transform duration-200"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {token && (
        <button
          onClick={handleLogout}
          className="fixed top-4 right-20 z-50 px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
        >
          Logout
        </button>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
        <Route path="/auth-redirect" element={<AuthRedirect onLogin={handleLogin} />} /> {/* ✅ Added */}
        {token ? (
          <Route path="/chat" element={<QueryPage token={token} onLogout={handleLogout} />} />
        ) : (
          <Route path="/chat" element={<LoginRegister onLogin={handleLogin} />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
