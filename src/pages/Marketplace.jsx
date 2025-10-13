import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Ensure you import auth for userId
import { getAuth } from 'firebase/auth'; // Import getAuth utility

const Marketplace = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false); // Toggle for post form
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const marketplaceCollectionName = 'marketplace';

  // 1. Fetch data in real-time using onSnapshot
  useEffect(() => {
    // Check if db is initialized before trying to connect
    if (!db) {
      console.error("Firestore database is not initialized.");
      setLoading(false);
      return;
    }

    // Set up real-time listener
    const q = collection(db, marketplaceCollectionName);
    
    // NOTE: Avoid orderBy() in Firestore, sort data in client-side memory
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Parse the timestamp to a more readable format if needed
        timestamp: doc.data().timestamp ? new Date(doc.data().timestamp.toDate()).toLocaleString() : 'N/A'
      }));
      
      // Sort in memory by time (newest first)
      postsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setPosts(postsList);
      setLoading(false);
    }, (error) => {
      console.error("Error setting up real-time listener for Marketplace:", error);
      setError("Failed to load listings. Check console for details.");
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [db]); // Re-run effect if db changes

  // 2. Handle New Post Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !price || !contact) {
      setError("Title, price, and contact are required.");
      return;
    }
    
    // Get current user ID and email
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to post.");
      return;
    }

    try {
      await addDoc(collection(db, marketplaceCollectionName), {
        userId: user.uid,
        userName: user.email, // Use email as a placeholder name
        title,
        price,
        contact,
        description,
        timestamp: new Date(),
      });

      // Reset form fields
      setTitle('');
      setPrice('');
      setContact('');
      setDescription('');
      setIsPosting(false);

    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to post listing.");
    }
  };

  // --- RENDERING ---

  // Form component
  const PostForm = () => (
    <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 border border-green-200">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Post a Listing</h2>
      {error && (
        <div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title (e.g., Calculus Textbook)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          required
        />
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Price (e.g., $25 or Negotiable)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required
          />
          <input
            type="text"
            placeholder="Contact (Email or Phone)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <textarea
          placeholder="Description (Condition, location, etc.)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 h-24"
        />
        <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="py-2 px-4 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 transform hover:scale-105"
            >
              Submit Listing
            </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-4xl font-extrabold text-green-700 mb-6 border-b-2 border-green-200 pb-2">
        Campus Marketplace 🛒
      </h1>

      {/* Post Button / Form Toggle */}
      <div className="flex justify-end mb-6">
        {!isPosting && (
          <button
            onClick={() => setIsPosting(true)}
            className="py-2 px-4 text-white font-semibold bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition duration-150 transform hover:scale-105"
          >
            + Post New Item
          </button>
        )}
      </div>

      {isPosting && <PostForm />}

      {loading ? (
        <p className="text-lg text-gray-500">Loading marketplace listings...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-xl p-6 transition duration-300 border border-gray-100 hover:shadow-2xl">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{post.title || 'No Title'}</h2>
                  <span className="text-2xl font-extrabold text-red-600 bg-red-100 px-3 py-1 rounded-full">{post.price || 'FREE'}</span>
                </div>
                
                <p className="text-gray-600 mb-4 h-16 overflow-hidden">
                  {post.description || 'No description provided.'}
                </p>
                
                <div className="text-sm space-y-2 pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-700">
                    Seller: <span className="font-normal text-indigo-500">{post.userName || 'Anonymous'}</span>
                  </p>
                  <p className="font-semibold text-gray-700">
                    Contact: <span className="font-normal text-gray-700 break-words">{post.contact || 'N/A'}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Posted on: {post.timestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 md:col-span-3">No active listings found. Be the first to post!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
