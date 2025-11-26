// src/pages/Departments.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Inline icons
const Building = ({ className }) => (
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
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <line x1="9" y1="22" x2="9" y2="10" />
    <line x1="15" y1="22" x2="15" y2="10" />
  </svg>
);

const Mail = ({ className }) => (
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
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const User = ({ className }) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptCollectionRef = collection(db, 'departments');
        const deptSnapshot = await getDocs(deptCollectionRef);

        const deptList = deptSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDepartments(deptList);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
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
      {/* Neon anime background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-64 w-64 bg-indigo-500/30 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-16 h-72 w-72 bg-pink-500/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 bg-violet-500/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-300 mb-3">
            DSATM • ACADEMICS
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-violet-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(129,140,248,0.7)]">
            Academic Departments 🏛️
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Browse all academic departments, meet the heads of departments, and
            jump to official pages for more details on programs, research, and
            opportunities.
          </p>
        </header>

        {/* Status badges */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300 bg-slate-900/70 border border-indigo-500/30 rounded-2xl px-4 py-2 backdrop-blur-xl shadow-[0_0_25px_rgba(79,70,229,0.3)]">
            <Building className="w-4 h-4 text-indigo-300" />
            <span className="font-semibold text-indigo-200">
              Department Directory
            </span>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-6 animate-pulse backdrop-blur-xl"
              >
                <div className="h-4 w-40 bg-slate-700 rounded-full mb-3" />
                <div className="h-3 w-20 bg-slate-800 rounded-full mb-5" />
                <div className="h-3 w-full bg-slate-800 rounded-full mb-2" />
                <div className="h-3 w-3/4 bg-slate-800 rounded-full mb-4" />
                <div className="h-9 w-full bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-400 bg-red-950/40 border border-red-700/40 rounded-2xl py-4">
            {error}
          </p>
        ) : departments.length === 0 ? (
          <div className="text-center text-slate-300 bg-slate-900/80 border border-slate-800 rounded-3xl py-10 backdrop-blur-xl">
            <p className="text-lg font-semibold mb-1">
              No departments found in Firestore.
            </p>
            <p className="text-sm text-slate-400">
              Add department documents to the{' '}
              <code className="text-indigo-200">'departments'</code> collection
              to see them listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {departments.map((dept, index) => {
              const gradient = gradients[index % gradients.length];

              return (
                <div key={dept.id} className="relative group">
                  {/* Glowing border wrapper */}
                  <div
                    className={`relative rounded-3xl p-[1px] bg-gradient-to-br ${gradient} shadow-[0_0_35px_rgba(79,70,229,0.45)] group-hover:shadow-[0_0_55px_rgba(236,72,153,0.6)] transition-shadow duration-300`}
                  >
                    <div className="h-full w-full rounded-[1.35rem] bg-slate-950/90 border border-slate-800/90 px-6 py-6 backdrop-blur-xl">
                      {/* Header row */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/70 border border-indigo-500/40 text-[10px] uppercase tracking-[0.18em] text-indigo-200 mb-2">
                            <Building className="w-3 h-3" />
                            {dept.short || 'Department'}
                          </div>
                          <h2 className="text-2xl font-extrabold text-slate-50 leading-tight group-hover:text-indigo-100 transition-colors">
                            {dept.name || 'Untitled Department'}
                          </h2>
                        </div>

                        <div className="text-xs text-slate-300 md:text-right">
                          <p className="flex md:justify-end items-center gap-2">
                            <User className="w-4 h-4 text-indigo-300" />
                            <span className="font-semibold text-indigo-100">
                              HOD:
                            </span>
                            <span>{dept.hod || 'Not updated'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-200 leading-relaxed mb-4">
                        {dept.description ||
                          'Department details will be updated soon. Stay tuned for more information on courses, labs and faculty.'}
                      </p>

                      {/* Details grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
                        {dept.hod && (
                          <div className="flex items-center">
                            <User className="w-5 h-5 mr-3 text-indigo-400" />
                            <span className="font-semibold text-slate-100">
                              Head of Dept:
                            </span>
                            <span className="ml-2 text-slate-200">
                              {dept.hod}
                            </span>
                          </div>
                        )}

                        {dept.url && (
                          <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-3 text-indigo-400" />
                            <span className="font-semibold text-slate-100">
                              Website:
                            </span>
                            <a
                              href={dept.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-indigo-300 hover:text-pink-300 hover:underline truncate"
                            >
                              Visit Page
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Button row */}
                      <div className="mt-5">
                        {dept.url ? (
                          <a
                            href={dept.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center py-2.5 text-sm font-semibold rounded-xl
                                       bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500
                                       text-white shadow-[0_0_25px_rgba(129,140,248,0.8)]
                                       hover:shadow-[0_0_35px_rgba(236,72,153,0.9)]
                                       hover:translate-y-[1px] active:translate-y-[2px]
                                       focus:outline-none focus:ring-2 focus:ring-indigo-300/70
                                       transition-all duration-300"
                          >
                            View Department Details
                          </a>
                        ) : (
                          <button
                            disabled
                            className="block w-full text-center py-2.5 text-sm font-semibold rounded-xl
                                       bg-slate-800 text-slate-400 border border-slate-700
                                       cursor-not-allowed"
                          >
                            More details coming soon
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl transition-opacity duration-500" />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center p-4 bg-slate-900/80 rounded-2xl text-slate-400 border border-slate-800 backdrop-blur-xl">
          <p className="text-xs md:text-sm">
            Data is fetched live from the{' '}
            <span className="font-semibold text-indigo-200">
              'departments'
            </span>{' '}
            Firestore collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Departments;
