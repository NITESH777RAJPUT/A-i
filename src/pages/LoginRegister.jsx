// src/pages/LoginRegister.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.92C34.553 6.173 29.623 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691c-1.326 2.583-2.081 5.58-2.081 8.809c0 3.229.755 6.226 2.081 8.809l-5.011 3.882C.254 31.832 0 28.024 0 24s.254-7.832 1.295-12.191l5.011 2.882z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-4.781-3.776C30.078 37.234 27.225 38 24 38c-4.473 0-8.283-2.958-9.68-6.958L4.57 34.898C7.548 40.563 15.183 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.143-4.17 5.574l4.781 3.776C39.991 34.019 44 27.616 44 20c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

const LoginRegister = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle Google OAuth token if present in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      onLogin(token);
      localStorage.setItem('token', token); // Save token
      window.history.replaceState({}, document.title, '/chat'); // Clean URL
      navigate('/chat');
    }
  }, [location.search, onLogin, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please enter email and password.');
    try {
      const res = await axios.post(`https://ai-ja3l.onrender.com/api/auth/${authMode}`, { email, password });
      if (res.data.token) {
        onLogin(res.data.token);
        navigate('/chat');
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed. Please try again.');
    }
  };

  // src/pages/LoginRegister.jsx
const handleGoogleLogin = () => {
  const redirectUri = encodeURIComponent('https://a-i-kappa.vercel.app/auth-redirect'); // ✅ Fixed here
  window.location.href = `https://ai-ja3l.onrender.com/api/auth/google?redirect_uri=${redirectUri}`;
};


  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {authMode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-2 text-center text-sm text-gray-600">
          {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleAuthMode} className="font-medium text-blue-600 hover:text-blue-500">
            {authMode === 'login' ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
