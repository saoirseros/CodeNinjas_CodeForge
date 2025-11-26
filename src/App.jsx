import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Chatbot from './components/chatbot/Chatbot';

// Pages & Components
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Department from './pages/Department';
import Marketplace from './pages/Marketplace';
import LostFound from './pages/LostFound';
import Suggestions from './pages/Suggestions';
import Chatroom from './pages/Chatroom';

// --- AUTH CONTEXT ---
const AuthContext = React.createContext({ currentUser: null, loading: true });

// --- Protected Route ---
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-2xl font-semibold text-slate-200">
        Loading Campus Connect...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// --- Main App Component ---
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {/* Global dark background so no white edges */}
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Router>
          {/* Navbar only when logged in */}
          {currentUser && <Navbar />}

          {/* Main content – no white background, just spacing on top */}
          <main className="pt-4 sm:pt-6 lg:pt-8">
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clubs"
                element={
                  <ProtectedRoute>
                    <Clubs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/departments"
                element={
                  <ProtectedRoute>
                    <Department />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lost-found"
                element={
                  <ProtectedRoute>
                    <LostFound />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suggestions"
                element={
                  <ProtectedRoute>
                    <Suggestions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatroom"
                element={
                  <ProtectedRoute>
                    <Chatroom />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </Router>

        {/* Floating chatbot bubble on dark bg */}
        {currentUser && <Chatbot />}
      </div>
    </AuthContext.Provider>
  );
};

export default App;