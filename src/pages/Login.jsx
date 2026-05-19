import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

// ✅ Import the background image properly
import dsu1 from '../assets/dsu1.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);   // student login/sign up toggle
  const [isAdminMode, setIsAdminMode] = useState(false); // ✅ admin vs student
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ put your admin emails here
  const adminEmails = [
    'admin@yourcollege.edu',
    'anotheradmin@example.com',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isAdminMode) {
        // ✅ ADMIN LOGIN ONLY (no signup)
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.email || !adminEmails.includes(user.email)) {
          await signOut(auth);
          setError('you are not authorized as an admin');
          return;
        }

        console.log('Admin logged in successfully!');
        navigate('/admin');  // 👉 make sure you have this route
        return;
      }

      // ✅ NORMAL STUDENT LOGIN / SIGNUP
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User registered successfully!');
      }

      navigate('/');

    } catch (err) {
      setError(
        err.message
          .replace('Firebase: Error (auth/', '')
          .replace(').', '')
          .replace(/-/g, ' ')
      );
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat m-0 p-4"
      style={{ backgroundImage: `url(${dsu1})` }}
    >
      <div className="max-w-md w-full p-8 space-y-8 bg-white/90 backdrop-blur shadow-lg rounded-lg border border-gray-200">
        
        {/* ✅ Mode Toggle (Student / Admin) */}
        <div className="flex justify-center gap-3 mb-2">
          <button
            type="button"
            onClick={() => { setIsAdminMode(false); setError(''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              !isAdminMode
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => { setIsAdminMode(true); setIsLogin(true); setError(''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              isAdminMode
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            Admin
          </button>
        </div>

        <h2 className="mt-2 text-center text-2xl font-extrabold text-primary">
          {isAdminMode
            ? 'Admin Login – Campus Connect'
            : isLogin
              ? 'Sign in to Campus Connect'
              : 'Create Your Student Account'}
        </h2>

        {error && (
          <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
            Error: {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            id="email-address"
            name="email"
            type="email"
            required
            className="appearance-none rounded-md w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder={isAdminMode ? 'Admin Email Address' : 'College Email Address'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-md w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 transition duration-150"
          >
            {isAdminMode
              ? 'Sign In as Admin'
              : isLogin
                ? 'Sign In'
                : 'Sign Up'}
          </button>
        </form>

        {/* ✅ Student-only sign in / sign up switch */}
        {!isAdminMode && (
          <div className="text-center text-sm text-black">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <span
                  className="font-medium text-primary hover:text-indigo-700 cursor-pointer"
                  onClick={() => { setIsLogin(false); setError(''); }}
                >
                  Sign up now
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span
                  className="font-medium text-primary hover:text-indigo-700 cursor-pointer"
                  onClick={() => { setIsLogin(true); setError(''); }}
                >
                  Sign in
                </span>
              </p>
            )}
          </div>
        )}

        {/* ✅ Small hint when admin mode is on */}
        {isAdminMode && (
          <p className="mt-2 text-center text-xs text-gray-600">
            Only authorized admin emails can log in here.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
