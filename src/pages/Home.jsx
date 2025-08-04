// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 animate-fade-in">
      <div className="max-w-3xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 transform transition-all duration-500 hover:scale-105 border border-blue-200">
        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight tracking-tight animate-slide-down">
          Welcome to <span className="text-blue-600">CogniDoc AI</span> 🧠
        </h1>
        <p className="mt-8 text-xl text-gray-700 leading-relaxed">
          Seamlessly upload your documents—PDFs, DOCX, or EMLs. Dive into intelligent conversations and get instant, accurate answers powered by advanced AI.
        </p>
        <button
          onClick={() => navigate('/chat')}
          className="mt-12 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-bounce-once"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default Home;