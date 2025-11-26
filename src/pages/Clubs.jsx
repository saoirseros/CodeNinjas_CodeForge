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
    'from-indigo-500 to-violet-500',
    'from-pink-500 to-rose-500',
    'from-emerald-400 to-teal-500',
    'from-sky-400 to-indigo-500',
    'from-amber-400 to-orange-500',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Background anime/neon gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-64 w-64 bg-indigo-500/30 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-16 h-72 w-72 bg-pink-500/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 bg-violet-500/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-300 mb-2">
              DSATM CAMPUS • CLUBS
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-violet-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(129,140,248,0.7)]">
              Club Directory
            </h1>
            <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl">
              Explore all active clubs across campus – from coding and design to
              music, art, and more. Find your tribe and start building something
              legendary.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300 bg-slate-900/70 border border-indigo-500/30 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-[0_0_30px_rgba(79,70,229,0.25)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p>
              <span className="font-semibold text-indigo-200">
                {loading ? 'Syncing' : 'Live'}
              </span>{' '}
              with campus database
            </p>
          </div>
        </header>

        {/* States */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-6 animate-pulse backdrop-blur-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-full bg-slate-700" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-slate-700 rounded-full mb-2" />
                    <div className="h-3 w-20 bg-slate-800 rounded-full" />
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full mb-2" />
                <div className="h-3 w-3/4 bg-slate-800 rounded-full mb-5" />
                <div className="h-9 w-full bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-400 bg-red-950/40 border border-red-700/40 rounded-2xl py-4">
            Error: {error}
          </p>
        ) : clubs.length === 0 ? (
          <div className="text-center text-slate-300 bg-slate-900/70 border border-slate-800 rounded-3xl py-10 backdrop-blur-xl">
            <p className="text-lg font-semibold mb-1">
              No clubs found in Firestore.
            </p>
            <p className="text-sm text-slate-400">
              Start by adding club documents in the <code>clubs</code> collection
              to see them here in real time.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club, index) => {
              const gradient = colors[index % colors.length];

              return (
                <div
                  key={club.id}
                  className="group relative"
                >
                  {/* Glowing gradient border wrapper */}
                  <div
                    className={`relative rounded-3xl p-[1px] bg-gradient-to-br ${gradient} shadow-[0_0_35px_rgba(79,70,229,0.45)] group-hover:shadow-[0_0_55px_rgba(236,72,153,0.6)] transition-shadow duration-300`}
                  >
                    <div className="h-full w-full rounded-[1.35rem] bg-slate-950/90 border border-slate-800/90 px-5 py-6 flex flex-col backdrop-blur-xl">
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="pr-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/70 border border-indigo-500/40 text-[10px] uppercase tracking-[0.18em] text-indigo-200 mb-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {club.category || 'Campus Club'}
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold text-slate-50 mb-1 leading-tight group-hover:text-indigo-100 transition-colors">
                            {club.name}
                          </h2>

                          <p className="text-xs text-slate-400 mb-3">
                            {club.tagline || 'Join, learn, build, and vibe with your people.'}
                          </p>
                        </div>

                        {/* Avatar with neon ring */}
                        <div className="relative shrink-0">
                          <div
                            className={`p-[2px] rounded-full bg-gradient-to-br ${gradient} shadow-[0_0_25px_rgba(129,140,248,0.7)] group-hover:scale-110 transition-transform duration-300`}
                          >
                            {club.imageURL ? (
                              <img
                                src={club.imageURL}
                                alt={club.name}
                                className="w-14 h-14 rounded-full object-cover border border-slate-900"
                              />
                            ) : (
                              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-900 text-indigo-100 text-xl font-bold border border-slate-800">
                                {getInitials(club.name)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-200 leading-relaxed mb-4 line-clamp-3">
                        {club.description || 'No description added yet. Be the first to define the vibe of this club.'}
                      </p>

                      {/* Meta info */}
                      <div className="mt-auto space-y-2 text-xs text-slate-300">
                        <p>
                          <span className="font-semibold text-indigo-200">Contact:</span>{' '}
                          <span className="text-slate-100">
                            {club.contact || 'Not available'}
                          </span>
                        </p>

                        {club['head name'] && (
                          <p className="flex items-center gap-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/70 border border-slate-700 text-slate-200">
                              Club Head
                            </span>
                            <span>{club['head name']}</span>
                          </p>
                        )}

                        {club['social media'] && (
                          <p className="text-[11px] text-indigo-200 truncate">
                            <span className="opacity-80">Social:</span>{' '}
                            <a
                              href={club['social media']}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-2 hover:text-pink-300"
                            >
                              {club['social media']}
                            </a>
                          </p>
                        )}
                      </div>

                      {/* CTA button */}
                      <button
                        className="mt-4 w-full py-2.5 text-sm font-semibold rounded-xl
                                   bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500
                                   text-white shadow-[0_0_25px_rgba(129,140,248,0.8)]
                                   hover:shadow-[0_0_35px_rgba(236,72,153,0.9)]
                                   hover:translate-y-[1px] active:translate-y-[2px]
                                   focus:outline-none focus:ring-2 focus:ring-indigo-300/70
                                   transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Tiny floating glow on hover */}
                  <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl transition-opacity duration-500" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
