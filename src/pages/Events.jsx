import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore database instance
import { format } from 'date-fns';

// Placeholder Icons (for visual consistency)
const Calendar = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y1="10"/></svg>;
const MapPin = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 16c3.314 0 6-2.686 6-6 0-3.314-2.686-6-6-6-3.314 0-6 2.686-6 6 0 3.314 2.686 6 6 6z"/><path d="M12 16v6"/></svg>;

// Placeholder Component Styles (for aesthetic theme)
const Card = ({ children, className }) => <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 transition duration-300 hover:shadow-xl ${className}`}>{children}</div>;
const Badge = ({ variant = 'default', children }) => {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variants = {
    default: "bg-indigo-500/90 text-white",
    secondary: "bg-gray-200 text-gray-700",
  };
  const style = variants[variant] || variants.default;
  return <span className={`${baseStyle} ${style}`}>{children}</span>;
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data (same as your Home.jsx to ensure content immediately loads)
  const dummyEvents = [
    { id: '1', title: 'Hackathon Project Submission', date: new Date(), description: 'Submit your code on Devpost by midnight!', location: 'Online / Final Lab', host: 'Tech Club' },
    { id: '2', title: 'Fall Career Fair 2025', date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Meet over 50 companies recruiting for internships.', location: 'Main Auditorium', host: 'Career Services' },
    { id: '3', title: 'Open Mic Night', date: new Date(new Date().setDate(new Date().getDate() + 10)), description: 'Enjoy free coffee, music, and poetry readings.', location: 'Student Union Cafe', host: 'Arts Society' },
  ];

  // Helper function to format Firestore Timestamp
  const formatDate = (timestamp) => {
    try {
      if (timestamp && timestamp.toDate) {
        return format(timestamp.toDate(), 'MMM dd, hh:mm a');
      }
      // Handle Date object if dummy data is used
      if (timestamp instanceof Date) {
         return format(timestamp, 'MMM dd, hh:mm a');
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };


  useEffect(() => {
    // Fetches all events once upon component mount
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollectionRef);
        
        const eventList = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Use real data if available, otherwise fallback to dummy data
        setEvents(eventList.length > 0 ? eventList : dummyEvents);
        
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback on error
        setEvents(dummyEvents); 
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-indigo-200 pb-3 text-center">
          All Upcoming Events 📅
        </h1>

        {loading ? (
          <p className="text-xl text-indigo-600 text-center">Fetching event listings...</p>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-6">
                
                {/* Event Details (Col 1-3) */}
                <div className="md:col-span-3 space-y-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="default">{event.host || 'General'}</Badge>
                    <span className="text-sm text-gray-500 font-medium">{event.category || 'Academic'}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-indigo-700">
                    {event.title || 'Untitled Event'}
                  </h2>
                  
                  <p className="text-gray-600 text-sm">
                    {event.description || 'Details coming soon.'}
                  </p>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm pt-2">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span className="font-semibold">Time:</span> 
                      <span className="ml-1">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                      <span className="font-semibold">Location:</span> 
                      <span className="ml-1">{event.location || 'TBA'}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button (Col 4) */}
                <div className="md:col-span-1 flex justify-end">
                  <button className="w-full md:w-auto py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150">
                    RSVP / Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center p-4 bg-gray-100 rounded-lg text-gray-600">
          <p className="text-sm">
            This page pulls all events from the 'events' Firestore collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
