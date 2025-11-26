import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

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

  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <nav
      className="
        sticky top-0 z-[50]
        bg-transparent
        shadow-[0_4px_30px_rgba(79,70,229,0.75)]
        border-b border-indigo-400/40
        backdrop-blur-xl
        overflow-x-hidden
      "
    >
      <div
        className="
          max-w-7xl mx-auto px-4 py-3
          flex items-center justify-between gap-6
          whitespace-nowrap
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold text-white flex items-center gap-1 hover:opacity-90 transition"
        >
          Campus Connect <span className="text-yellow-300"></span>
        </Link>

        {/* Nav Links */}
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
                      ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.35)] border border-white/30'
                      : 'text-indigo-100 hover:text-white hover:bg-white/10 border border-transparent'
                  }
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right side: Profile + Logout */}
        <div className="flex items-center gap-3">
          {/* Profile badge */}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="
              w-9 h-9 rounded-full
              flex items-center justify-center
              bg-white/15 text-white text-sm font-bold
              shadow-[0_0_18px_rgba(255,255,255,0.35)]
              hover:bg-white/25 hover:scale-105
              transition-all duration-150
              overflow-hidden
            "
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              getInitial()
            )}
          </button>

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
      </div>
    </nav>
  );
};

export default Navbar;
