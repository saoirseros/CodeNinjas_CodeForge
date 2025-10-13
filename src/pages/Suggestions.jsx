import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; 

const Suggestions = () => {
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (suggestion.trim().length < 10) {
      setMessage('Suggestion must be at least 10 characters long.');
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Get current user details, even if only their UID is recorded for security/moderation purposes
      const user = auth.currentUser;
      const userId = user ? user.uid : 'anonymous';

      await addDoc(collection(db, 'suggestions'), {
        suggestion: suggestion,
        userId: userId,
        timestamp: new Date(),
        isAnonymous: !user, // Flag true if user is not authenticated (though our app requires login)
      });

      setSuggestion('');
      setMessage('Thank you! Your anonymous suggestion has been submitted.');
      setIsSuccess(true);

    } catch (err) {
      console.error("Error submitting suggestion:", err);
      setMessage('Submission failed. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusStyle = isSuccess 
    ? "bg-green-100 border-green-400 text-green-700" 
    : "bg-red-100 border-red-400 text-red-700";

  return (
    <div className="container mx-auto max-w-xl p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-indigo-500">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          💡 Anonymous Suggestion Box
        </h1>
        <p className="text-gray-600 mb-6 border-b pb-4">
          Tell us what's on your mind. All submissions are anonymous and help improve campus life.
        </p>

        {/* Status Message */}
        {message && (
          <div className={`p-4 mb-6 border-l-4 rounded-lg ${statusStyle} transition-all duration-300`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Type your feedback, feature request, or complaint here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 h-32 resize-none"
            required
            disabled={isSubmitting}
          />
          
          <button
            type="submit"
            className="w-full py-3 px-4 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01] disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit Anonymously'}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-400">
          Your user ID will not be attached to this submission.
        </p>
      </div>
    </div>
  );
};

export default Suggestions;
