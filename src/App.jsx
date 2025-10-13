import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Added signOut for Navbar
import { auth, db, rtdb } from './firebase'; // Ensure all services are imported

// === Components & Pages ===
import Login from './pages/Login';
import Navbar from './components/Navbar';
// Placeholder Pages (You need to create these files in src/pages/)
import Home from './pages/Home'; 
import Clubs from './pages/Clubs';
import Marketplace from './pages/Marketplace';
import LostFound from './pages/LostFound';
import Suggestions from './pages/Suggestions';
import Chatroom from './pages/Chatroom';

// --- AUTH CONTEXT SETUP (FOR EASIER STATE MANAGEMENT) ---
// Note: In a real app, this would be separate, but here we keep it simple.
const AuthContext = React.createContext({ currentUser: null, loading: true });

// --- Protected Route Component ---
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-700">Loading Campus Connect...</div>;
  }
  // If not logged in, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  // If logged in, render the requested component
  return children;
};

// --- Main App Component ---
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; // Cleanup subscription
  }, []);

  return (
    // Pass Auth state via context
    <AuthContext.Provider value={{ currentUser, loading }}>
      <Router>
        {/* Navbar is visible only when a user is logged in */}
        {currentUser && <Navbar />} 
        
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes (Require Login) */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
            <Route path="/suggestions" element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />
            <Route path="/chatroom" element={<ProtectedRoute><Chatroom /></ProtectedRoute>} />

            {/* Fallback for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
