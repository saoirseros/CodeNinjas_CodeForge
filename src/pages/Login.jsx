import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import the auth service

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      if (isLogin) {
        // Log In existing user
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully!');
      } else {
        // Create a new user
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User registered successfully!');
      }
      
      // On success, redirect to the Home/Events Feed page
      navigate('/'); 

    } catch (err) {
      // Display Firebase error messages
      setError(err.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' '));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-cover bg-center bg-no-repeat m-0 p-0"
    style={{ backgroundImage: "url('/src/assets/dsu1.png')" }}>

      <div className="max-w-md w-full p-8 space-y-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
          {isLogin ? 'Sign in to Campus Connect' : 'Create Your Student Account'}
        </h2>
        
        {/* Error Message Display */}
        {error && (
          <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
            Error: {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <input
            id="email-address"
            name="email"
            type="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="College Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 transition duration-150"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Button */}
        <div className="text-center text-sm">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <span 
                className="font-medium text-primary hover:text-indigo-700 cursor-pointer transition duration-150"
                onClick={() => { setIsLogin(false); setError(''); }}
              >
                Sign up now
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span
                className="font-medium text-primary hover:text-indigo-700 cursor-pointer transition duration-150"
                onClick={() => { setIsLogin(true); setError(''); }}
              >
                Sign in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
