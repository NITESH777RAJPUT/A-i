// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="p-4 flex justify-between bg-black text-white">
      <div className="text-xl font-bold">📄 AI Doc Chat</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/chat">Query</Link>
        <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
