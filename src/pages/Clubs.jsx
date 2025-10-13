import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore database instance

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data structure for initial display while fetching
  const dummyClubs = [
    { id: '1', name: 'Tech Innovators Club', description: 'Focuses on competitive coding and hackathons.', contact: 'techclub@college.edu' },
    { id: '2', name: 'Photography Society', description: 'Capturing campus life and hosting photography workshops.', contact: 'photosoc@college.edu' },
    { id: '3', name: 'Debate Union', description: 'Weekly debates and preparation for inter-college tournaments.', contact: 'debateunion@college.edu' },
  ];

  useEffect(() => {
    // --- Day 3 Goal: Fetch real data from Firestore ---
    const fetchClubs = async () => {
      try {
        const clubsCollectionRef = collection(db, 'clubs');
        const clubSnapshot = await getDocs(clubsCollectionRef);
        
        // Map Firestore documents to a clean array of objects
        const clubsList = clubSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // If Firestore is empty, use dummy data temporarily for demo
        if (clubsList.length > 0) {
          setClubs(clubsList);
        } else {
          setClubs(dummyClubs);
        }
        
      } catch (error) {
        console.error("Error fetching clubs:", error);
        // Fallback to dummy data if fetching fails
        setClubs(dummyClubs); 
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 border-b-2 border-indigo-200 pb-2">
        Club Directory 🎭
      </h1>

      {loading ? (
        <p className="text-lg text-gray-500">Loading clubs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club.id} className="bg-white rounded-xl shadow-xl p-6 transition duration-300 hover:shadow-2xl hover:border-indigo-400 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{club.name || 'Untitled Club'}</h2>
              <p className="text-gray-600 mb-4 h-16 overflow-hidden">
                {club.description || 'No description provided.'}
              </p>
              
              <div className="text-sm space-y-1">
                <p className="font-semibold text-indigo-500">
                  Contact: <span className="font-normal text-gray-700 break-words">{club.contact || 'N/A'}</span>
                </p>
              </div>

              <button className="mt-4 w-full py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
      
      <p className="mt-10 text-center text-gray-500">
        **NOTE:** If your Firestore is empty, this page displays placeholder data.
      </p>
    </div>
  );
};

export default Clubs;
