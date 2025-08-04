// ✅ frontend/src/pages/LoginRegister.jsx (Google handler only)
const handleGoogleLogin = () => {
  const redirectUri = encodeURIComponent('http://localhost:5173');
  window.location.href = `https://ai-ja3l.onrender.com/api/auth/google?redirect_uri=${redirectUri}`;
};


// ✅ frontend/src/pages/AuthRedirect.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthRedirect = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        localStorage.setItem('token', token);
        onLogin(token);
        navigate('/chat');
      } catch (err) {
        setError('Failed to process authentication token');
        navigate('/login');
      }
    } else {
      setError('No authentication token found');
      navigate('/login');
    }
  }, [searchParams, onLogin, navigate]);

  return (
    <div className="text-center text-white mt-20">
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Logging in with Google...</p>
      )}
    </div>
  );
};

export default AuthRedirect;
