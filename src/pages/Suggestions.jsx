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
      const user = auth.currentUser;
      const userId = user ? user.uid : 'anonymous';

      await addDoc(collection(db, 'suggestions'), {
        suggestion: suggestion,
        userId: userId,
        timestamp: new Date(),
        isAnonymous: !user,
      });

      setSuggestion('');
      setMessage('Thank you! Your anonymous suggestion has been submitted.');
      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      setMessage('Submission failed. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusStyle = isSuccess
    ? 'bg-emerald-900/40 border-emerald-500 text-emerald-200'
    : 'bg-rose-900/40 border-rose-500 text-rose-200';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Neon blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-64 w-64 bg-indigo-500/25 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-16 h-72 w-72 bg-pink-500/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 bg-emerald-400/25 blur-3xl rounded-full" />
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Glow wrapper */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 shadow-[0_0_35px_rgba(129,140,248,0.6)]">
          <div className="bg-slate-950/85 rounded-[1.5rem] p-7 md:p-8 border border-slate-800 backdrop-blur-xl">
            {/* Header */}
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-transparent bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text drop-shadow-[0_0_18px_rgba(129,140,248,0.7)]">
              💡 Anonymous Suggestion Box
            </h1>
            <p className="text-sm md:text-base text-slate-300 mb-6 border-b border-slate-800 pb-4">
              Tell us what’s on your mind. All submissions are anonymous and help
              improve campus life and the Campus Connect platform.
            </p>

            {/* Status */}
            {message && (
              <div
                className={`p-4 mb-6 border rounded-xl text-sm font-medium ${statusStyle} transition-all duration-300`}
              >
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Type your feedback, feature request, or complaint here..."
                className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-slate-100 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                required
                disabled={isSubmitting}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-sm md:text-base font-semibold rounded-xl
                           bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400
                           text-slate-950 shadow-[0_0_22px_rgba(168,85,247,0.9)]
                           hover:shadow-[0_0_30px_rgba(236,72,153,1)]
                           hover:translate-y-[1px] active:translate-y-[2px]
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Submit Anonymously'}
              </button>
            </form>

            <p className="mt-6 text-[11px] text-center text-slate-500">
              Your email and name are not shown with this suggestion. Only an
              internal ID is used for moderation, if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
