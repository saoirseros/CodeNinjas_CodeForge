import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const Marketplace = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const marketplaceCollectionName = 'marketplace';

  // Real-time listener
  useEffect(() => {
    if (!db) {
      console.error('Firestore database is not initialized.');
      setLoading(false);
      return;
    }

    const q = collection(db, marketplaceCollectionName);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp
            ? new Date(doc.data().timestamp.toDate()).toLocaleString()
            : 'N/A',
        }));

        postsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setPosts(postsList);
        setLoading(false);
      },
      (error) => {
        console.error(
          'Error setting up real-time listener for Marketplace:',
          error
        );
        setError('Failed to load listings. Check console for details.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !price || !contact) {
      setError('Title, price, and contact are required.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to post.');
      return;
    }

    try {
      await addDoc(collection(db, marketplaceCollectionName), {
        userId: user.uid,
        userName: user.email,
        title,
        price,
        contact,
        description,
        timestamp: new Date(),
      });

      setTitle('');
      setPrice('');
      setContact('');
      setDescription('');
      setIsPosting(false);
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Failed to post listing.');
    }
  };

  const gradients = [
    'from-indigo-500 to-violet-500',
    'from-pink-500 to-rose-500',
    'from-emerald-400 to-teal-500',
    'from-sky-400 to-indigo-500',
    'from-amber-400 to-orange-500',
  ];

  const PostForm = () => (
    <div className="relative mb-10">
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-emerald-400 to-sky-500 shadow-[0_0_35px_rgba(34,197,94,0.45)]">
        <div className="rounded-[1.35rem] bg-slate-950/90 border border-slate-800/90 p-6 md:p-7 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-emerald-300 mb-4">
            Post a Listing
          </h2>
          {error && (
            <div className="p-3 mb-4 text-sm font-medium text-red-300 bg-red-900/40 border border-red-700/60 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title (e.g., Calculus Textbook)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              required
            />
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
              <input
                type="text"
                placeholder="Price (e.g., ₹500 or Negotiable)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full md:w-1/2 p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Contact (Email or Phone)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full md:w-1/2 p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                required
              />
            </div>
            <textarea
              placeholder="Description (Condition, location, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-50 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="py-2 px-4 text-xs md:text-sm font-semibold text-slate-200 bg-slate-800/80 rounded-lg border border-slate-700 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-xs md:text-sm font-semibold rounded-lg
                           bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400
                           text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.9)]
                           hover:shadow-[0_0_28px_rgba(56,189,248,1)]
                           hover:translate-y-[1px] active:translate-y-[2px]
                           transition-all duration-200"
              >
                Submit Listing
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-20 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 blur-3xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Neon background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-64 w-64 bg-emerald-500/25 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-16 h-72 w-72 bg-sky-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 bg-violet-500/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-3">
            DSATM • CAMPUS MARKETPLACE
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(45,212,191,0.7)]">
            Campus Marketplace 🛒
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Buy, sell, or exchange textbooks, gadgets, and essentials with other
            students. Safe, campus-only listings in one place.
          </p>
        </header>

        {/* Post Button / Form Toggle */}
        <div className="flex justify-end mb-6">
          {!isPosting && (
            <button
              onClick={() => setIsPosting(true)}
              className="py-2.5 px-5 text-xs md:text-sm font-semibold rounded-full
                         bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400
                         text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.9)]
                         hover:shadow-[0_0_28px_rgba(56,189,248,1)]
                         hover:translate-y-[1px] active:translate-y-[2px]
                         transition-all duration-200"
            >
              + Post New Item
            </button>
          )}
        </div>

        {isPosting && <PostForm />}

        {/* Listings */}
        {loading ? (
          <p className="text-center text-slate-300">Loading marketplace listings...</p>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.map((post, index) => {
              const gradient = gradients[index % gradients.length];

              return (
                <div key={post.id} className="relative group">
                  {/* Neon gradient border card */}
                  <div
                    className={`relative rounded-3xl p-[1px] bg-gradient-to-br ${gradient} shadow-[0_0_28px_rgba(79,70,229,0.55)] group-hover:shadow-[0_0_40px_rgba(236,72,153,0.7)] transition-shadow duration-300`}
                  >
                    <div className="h-full w-full rounded-[1.35rem] bg-slate-950/90 border border-slate-800/90 p-5 backdrop-blur-xl flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-lg md:text-xl font-bold text-slate-50">
                          {post.title || 'No Title'}
                        </h2>
                        <span className="text-sm md:text-base font-extrabold text-rose-100 bg-rose-600/80 px-3 py-1 rounded-full shadow-[0_0_18px_rgba(248,113,113,0.9)]">
                          {post.price || 'FREE'}
                        </span>
                      </div>

                      <p className="text-sm text-slate-200 mb-4 line-clamp-3">
                        {post.description || 'No description provided.'}
                      </p>

                      <div className="mt-auto text-xs text-slate-300 space-y-1 pt-3 border-t border-slate-800">
                        <p>
                          <span className="font-semibold text-emerald-300">
                            Seller:
                          </span>{' '}
                          <span className="text-indigo-200">
                            {post.userName || 'Anonymous'}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-emerald-300">
                            Contact:
                          </span>{' '}
                          <span className="text-slate-200 break-words">
                            {post.contact || 'N/A'}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Posted on: {post.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Outer glow on hover */}
                  <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 blur-3xl transition-opacity duration-500" />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-300 mt-10">
            No active listings found. Be the first to post!
          </p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
