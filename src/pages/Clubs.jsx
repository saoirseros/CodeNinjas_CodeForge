import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        console.log('DB instance:', db);

        const clubsRef = collection(db, 'clubs');
        const snapshot = await getDocs(clubsRef);

        console.log('snapshot size:', snapshot.size);

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('mapped clubs list:', list);

        setClubs(list);
      } catch (err) {
        console.error('Error loading clubs:', err);
        setError(err.message || 'Something went wrong while loading clubs.');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const getInitials = (name = '') => {
    const trimmed = name.trim();
    if (!trimmed) return '?';
    const parts = trimmed.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const colors = [
    'bg-indigo-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-emerald-500',
    'bg-rose-500',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 border-b-2 border-indigo-100 pb-3">
          Club Directory
        </h1>

        {loading ? (
          <p className="text-lg text-gray-500">Loading clubs...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : clubs.length === 0 ? (
          <p className="text-center text-gray-500">
            No clubs found in Firestore.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {clubs.map((club, index) => (
              <div
                key={club.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100
                           hover:shadow-2xl transition-shadow duration-300 flex flex-col p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="pr-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {club.name}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {club.description}
                    </p>

                    <p className="mt-4 text-sm">
                      <span className="font-semibold text-indigo-600">
                        Contact:
                      </span>{' '}
                      <span className="text-gray-800">{club.contact}</span>
                    </p>

                    {club['head name'] && (
                      <p className="mt-1 text-xs text-gray-600">
                        Head: {club['head name']}
                      </p>
                    )}

                    {club['social media'] && (
                      <p className="mt-1 text-xs text-gray-600">
                        Social: {club['social media']}
                      </p>
                    )}
                  </div>

                 <img
  src={club.imageURL}
  alt={club.name}
  className="w-14 h-14 rounded-full object-cover shadow-md border"
/>

                </div>

                <button
                  className="mt-auto w-full py-2.5 text-sm font-semibold
                             bg-indigo-500 text-white rounded-lg shadow-md
                             hover:bg-indigo-600 focus:outline-none focus:ring-2
                             focus:ring-indigo-300 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
