import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import { motion } from 'framer-motion'; // 👈 added

// Icons
const Calendar = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapPin = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 16c3.314 0 6-2.686 6-6 0-3.314-2.686-6-6-6-3.314 0-6 2.686-6 6 0 3.314 2.686 6 6 6z" />
    <path d="M12 16v6" />
  </svg>
);

// Simple badge
const Badge = ({ variant = 'default', children }) => {
  const baseStyle =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors';
  const variants = {
    default:
      'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_0_15px_rgba(129,140,248,0.8)]',
    secondary: 'bg-slate-800/80 text-slate-200 border border-slate-700',
  };
  return (
    <span className={`${baseStyle} ${variants[variant] || variants[variant]}`}>
      {children}
    </span>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data fallback
  const dummyEvents = [
    {
      id: '1',
      title: 'Hackathon Project Submission',
      date: new Date(),
      description: 'Submit your code on Devpost by midnight!',
      location: 'Online / Final Lab',
      host: 'Tech Club',
      category: 'Hackathon',
    },
    {
      id: '2',
      title: 'Fall Career Fair 2025',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      description: 'Meet over 50 companies recruiting for internships.',
      location: 'Main Auditorium',
      host: 'Career Services',
      category: 'Career',
    },
    {
      id: '3',
      title: 'Open Mic Night',
      date: new Date(new Date().setDate(new Date().getDate() + 10)),
      description: 'Enjoy free coffee, music, and poetry readings.',
      location: 'Student Union Cafe',
      host: 'Arts Society',
      category: 'Cultural',
    },
  ];

  const formatDate = (timestamp) => {
    try {
      if (timestamp?.toDate) {
        return format(timestamp.toDate(), 'MMM dd, hh:mm a');
      }
      if (timestamp instanceof Date) {
        return format(timestamp, 'MMM dd, hh:mm a');
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollectionRef);

        let eventList = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by date ascending (upcoming first)
        eventList = eventList.sort((a, b) => {
          const da = a.date?.toDate ? a.date.toDate() : a.date;
          const db = b.date?.toDate ? b.date.toDate() : b.date;
          return new Date(da) - new Date(db);
        });

        setEvents(eventList.length > 0 ? eventList : dummyEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents(dummyEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const gradients = [
    'from-indigo-500 to-violet-500',
    'from-pink-500 to-rose-500',
    'from-emerald-400 to-teal-500',
    'from-sky-400 to-indigo-500',
    'from-amber-400 to-orange-500',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Neon background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-64 w-64 bg-indigo-500/30 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-16 h-72 w-72 bg-pink-500/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 bg-violet-500/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header with slight motion */}
        <motion.header
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-300 mb-3">
            DSATM • CAMPUS EVENTS
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-violet-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(129,140,248,0.7)]">
            All Upcoming Events 📅
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Stay in sync with hackathons, cultural fests, workshops and more —
            everything happening across campus, all in one place.
          </p>
        </motion.header>

        {/* Status pill */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300 bg-slate-900/70 border border-indigo-500/30 rounded-2xl px-4 py-2 backdrop-blur-xl shadow-[0_0_25px_rgba(79,70,229,0.3)]">
            <Calendar className="w-4 h-4 text-indigo-300" />
            <span className="font-semibold text-indigo-200">
              Live Campus Timeline
            </span>
          </div>
        </motion.div>

        {/* States */}
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-6 animate-pulse backdrop-blur-xl"
              >
                <div className="h-4 w-32 bg-slate-700 rounded-full mb-3" />
                <div className="h-3 w-20 bg-slate-800 rounded-full mb-4" />
                <div className="h-3 w-full bg-slate-800 rounded-full mb-2" />
                <div className="h-3 w-3/4 bg-slate-800 rounded-full mb-2" />
                <div className="h-3 w-1/2 bg-slate-800 rounded-full mb-5" />
                <div className="h-9 w-40 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            className="text-center text-slate-300 bg-slate-900/80 border border-slate-800 rounded-3xl py-10 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg font-semibold mb-1">
              No upcoming events right now.
            </p>
            <p className="text-sm text-slate-400">
              Check back later or ask your student council to add new events to
              the portal.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-7">
            {events.map((event, index) => {
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div
                  key={event.id}
                  className="relative group"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  {/* Glowing gradient border wrapper */}
                  <div
                    className={`relative rounded-3xl p-[1px] bg-gradient-to-br ${gradient} shadow-[0_0_35px_rgba(79,70,229,0.45)] group-hover:shadow-[0_0_55px_rgba(236,72,153,0.6)] transition-shadow duration-300`}
                  >
                    <div className="h-full w-full rounded-[1.35rem] bg-slate-950/90 border border-slate-800/90 px-5 py-6 md:px-7 md:py-7 backdrop-blur-xl">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-6">
                        {/* Event Details */}
                        <div className="md:col-span-3 space-y-3">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <Badge variant="default">
                              {event.host || 'General Event'}
                            </Badge>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200 uppercase tracking-[0.14em]">
                              {event.category || 'Campus'}
                            </span>
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold text-slate-50">
                            {event.title || 'Untitled Event'}
                          </h2>

                          <p className="text-sm text-slate-200 leading-relaxed">
                            {event.description || 'Details coming soon.'}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm pt-2">
                            <div className="flex items-center text-slate-200">
                              <Calendar className="w-4 h-4 mr-2 text-indigo-300" />
                              <span className="font-semibold text-slate-100">
                                Time:
                              </span>
                              <span className="ml-1 text-slate-200">
                                {formatDate(event.date)}
                              </span>
                            </div>
                            <div className="flex items-center text-slate-200">
                              <MapPin className="w-4 h-4 mr-2 text-indigo-300" />
                              <span className="font-semibold text-slate-100">
                                Location:
                              </span>
                              <span className="ml-1 text-slate-200">
                                {event.location || 'TBA'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="md:col-span-1 flex md:justify-end items-center">
                          <button
                            className="w-full md:w-auto py-2.5 px-6 text-sm font-semibold rounded-xl
                                       bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500
                                       text-white shadow-[0_0_25px_rgba(129,140,248,0.8)]
                                       hover:shadow-[0_0_35px_rgba(236,72,153,0.9)]
                                       hover:translate-y-[1px] active:translate-y-[2px]
                                       focus:outline-none focus:ring-2 focus:ring-indigo-300/70
                                       transition-all duration-300"
                          >
                            RSVP / Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          className="mt-12 text-center p-4 bg-slate-900/80 rounded-2xl text-slate-400 border border-slate-800 backdrop-blur-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-xs md:text-sm">
            Events are loaded from the{' '}
            <span className="font-mono font-semibold text-indigo-200">
              'events'
            </span>{' '}
            Firestore collection. If no data exists, sample events are shown for
            demo.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Events;
