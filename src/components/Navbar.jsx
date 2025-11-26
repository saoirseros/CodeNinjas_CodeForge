import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Clubs', path: '/clubs' },
    { name: 'Events', path: '/events' },
    { name: 'Departments', path: '/departments' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Lost & Found', path: '/lost-found' },
    { name: 'Chatroom', path: '/chatroom' },
    { name: 'Suggestions', path: '/suggestions' },
  ];

  return (
    <nav
      className="
        sticky top-0 z-[50]
        bg-transparent
        shadow-[0_4px_30px_rgba(79,70,229,0.75)]
        border-b border-indigo-400/40
        backdrop-blur-xl
      "
    >
      <div
        className="
          max-w-7xl mx-auto px-4 py-3
          flex items-center justify-between gap-6
          whitespace-nowrap overflow-x-auto
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold text-white flex items-center gap-1 hover:opacity-90 transition"
        >
          Campus Connect <span className="text-yellow-300"></span>
        </Link>

        {/* Nav Links — All in One Line */}
        <div className="flex flex-row items-center gap-4 mx-auto">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== '/' && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`
                  px-3 py-1.5 rounded-full font-medium text-sm
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.35)] border border-white/30"
                      : "text-indigo-100 hover:text-white hover:bg-white/10 border border-transparent"
                  }
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            px-4 py-2 text-sm font-semibold rounded-full
            bg-red-500 hover:bg-red-600 text-white
            shadow-[0_0_15px_rgba(248,113,113,0.8)]
            transition-transform duration-150
            hover:scale-105 active:scale-95
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;