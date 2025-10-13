import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase'; 

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false); // Toggle for report form
  const [itemType, setItemType] = useState('lost'); // 'lost' or 'found'
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const collectionName = 'lostFound';

  // 1. Fetch data in real-time using onSnapshot
  useEffect(() => {
    if (!db) {
      console.error("Firestore database is not initialized.");
      setLoading(false);
      return;
    }

    const q = collection(db, collectionName);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? new Date(doc.data().timestamp.toDate()).toLocaleString() : 'N/A'
      }));
      
      // Sort in memory by time (newest first)
      itemsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setItems(itemsList);
      setLoading(false);
    }, (error) => {
      console.error("Error setting up real-time listener for Lost & Found:", error);
      setError("Failed to load listings. Check console for details.");
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [db]); 

  // 2. Handle New Item Report Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !location || !contact) {
      setError("Title, location, and contact are required.");
      return;
    }
    
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to report an item.");
      return;
    }

    try {
      await addDoc(collection(db, collectionName), {
        userId: user.uid,
        userName: user.email, 
        type: itemType,
        title,
        location,
        contact,
        details,
        status: 'active',
        timestamp: new Date(),
      });

      // Reset form fields
      setTitle('');
      setLocation('');
      setContact('');
      setDetails('');
      setItemType('lost');
      setIsReporting(false);

    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to submit item report.");
    }
  };

  // --- RENDERING ---

  const ReportForm = () => (
    <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 border border-red-200">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Report an Item</h2>
      {error && (
        <div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Type Toggle */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setItemType('lost')}
            className={`w-1/2 py-2 px-4 rounded-lg font-semibold transition duration-150 ${
              itemType === 'lost' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            I Lost Something
          </button>
          <button
            type="button"
            onClick={() => setItemType('found')}
            className={`w-1/2 py-2 px-4 rounded-lg font-semibold transition duration-150 ${
              itemType === 'found' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            I Found Something
          </button>
        </div>

        <input
          type="text"
          placeholder="Item Title (e.g., Blue backpack, Black iPhone)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          required
        />
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Last seen / Found location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            required
          />
          <input
            type="text"
            placeholder="Contact (Email or Phone)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>
        <textarea
          placeholder="Detailed description (Color, condition, time, distinguishing marks)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 h-24"
        />
        <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsReporting(false)}
              className="py-2 px-4 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-150 transform hover:scale-105"
            >
              Submit Report
            </button>
        </div>
      </form>
    </div>
  );

  const getTypeStyle = (type) => 
    type === 'lost' 
      ? { color: 'text-red-600', border: 'border-red-400', tag: 'Lost' } 
      : { color: 'text-blue-600', border: 'border-blue-400', tag: 'Found' };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2">
        Lost & Found 🎒
      </h1>

      {/* Report Button / Form Toggle */}
      <div className="flex justify-end mb-6">
        {!isReporting && (
          <button
            onClick={() => setIsReporting(true)}
            className="py-2 px-4 text-white font-semibold bg-red-500 rounded-lg shadow-lg hover:bg-red-600 transition duration-150 transform hover:scale-105"
          >
            + Report Item
          </button>
        )}
      </div>

      {isReporting && <ReportForm />}

      {loading ? (
        <p className="text-lg text-gray-500">Loading Lost & Found reports...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? (
            items.map((item) => {
              const style = getTypeStyle(item.type);
              return (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-xl shadow-xl p-6 transition duration-300 border-l-4 ${style.border} hover:shadow-2xl`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{item.title || 'Untitled Item'}</h2>
                    <span className={`text-sm font-extrabold ${style.color} bg-gray-100 px-3 py-1 rounded-full`}>
                      {style.tag}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 h-16 overflow-hidden">
                    Details: {item.details || 'No detailed description provided.'}
                  </p>
                  
                  <div className="text-sm space-y-2 pt-4 border-t border-gray-100">
                    <p className="font-semibold text-gray-700">
                      Location: <span className="font-normal text-indigo-500">{item.location || 'N/A'}</span>
                    </p>
                    <p className="font-semibold text-gray-700">
                      Contact: <span className="font-normal text-gray-700 break-words">{item.contact || 'N/A'}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Reported by: {item.userName || 'Unknown'} on {item.timestamp}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 md:col-span-3">No active reports found. Be the first to report!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LostFound;
