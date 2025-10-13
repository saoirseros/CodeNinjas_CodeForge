import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Import auth from your firebase config

const Navbar = () => {
  const navigate = useNavigate();

  // Function to handle Firebase logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Firebase onAuthStateChanged listener in App.jsx will handle redirect to /login
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
      // Using simple console error instead of alert
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Clubs', path: '/clubs' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Lost & Found', path: '/lost-found' },
    { name: 'Chatroom', path: '/chatroom' },
    { name: 'Suggestions', path: '/suggestions' },
  ];

  return (
    <nav className="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between p-4 bg-indigo-700 shadow-lg">
      
      {/* Logo/Brand */}
      <div className="text-2xl font-extrabold text-white mb-3 sm:mb-0">
        <Link to="/" className="hover:text-indigo-200 transition duration-150">
          Campus Connect 🎓
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center sm:flex-row space-x-2 sm:space-x-6 text-sm sm:text-base font-medium">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            className="text-white hover:text-indigo-200 transition duration-150 py-1 px-2 rounded-lg"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Profile/Logout Button */}
      <button 
        onClick={handleLogout}
        className="mt-3 sm:mt-0 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-150 transform hover:scale-105"
      >
        Logout
      </button>

    </nav>
  );
};

export default Navbar;
