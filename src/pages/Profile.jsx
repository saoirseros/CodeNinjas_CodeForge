// src/pages/Profile.jsx
import React from 'react';
import { auth } from '../firebase';
import { format } from 'date-fns';

const Profile = () => {
  const user = auth.currentUser;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-300">
          No user is logged in. Please sign in again.
        </p>
      </div>
    );
  }

  const initial = user.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  const createdAt = user.metadata?.creationTime
    ? format(new Date(user.metadata.creationTime), 'PPpp')
    : 'N/A';

  const lastLogin = user.metadata?.lastSignInTime
    ? format(new Date(user.metadata.lastSignInTime), 'PPpp')
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Neon background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-64 w-64 bg-indigo-500/25 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-16 h-72 w-72 bg-pink-500/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 bg-emerald-400/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Outer glow wrapper */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_35px_rgba(129,140,248,0.7)]">
          <div className="bg-slate-950/85 rounded-[1.5rem] p-7 md:p-10 border border-slate-800 backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center shadow-[0_0_25px_rgba(129,140,248,0.8)] overflow-hidden border border-indigo-400/60">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {initial}
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-300 via-sky-300 to-pink-300 bg-clip-text drop-shadow-[0_0_18px_rgba(129,140,248,0.7)]">
                    {user.displayName || 'Campus Connect User'}
                  </h1>
                  <p className="text-sm text-slate-300 mt-1">
                    {user.email}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-indigo-300">
                    Student • DSATM • Campus Connect
                  </p>
                </div>

              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">User ID</p>
                <p className="text-xs break-all text-slate-200">{user.uid}</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Account Created</p>
                <p className="text-sm text-slate-200">{createdAt}</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Last Login</p>
                <p className="text-sm text-slate-200">{lastLogin}</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Auth Provider</p>
                <p className="text-sm text-slate-200">
                  {user.providerData?.[0]?.providerId || 'password'}
                </p>
              </div>

            </div>

            {/* Coming soon */}
            <div className="mt-4 bg-slate-900/60 border border-dashed border-slate-700 rounded-xl p-4 text-sm text-slate-300">
              <p className="font-semibold text-slate-100 mb-1">Coming soon</p>
              <p className="text-xs text-slate-400">
                Profile editing, avatar upload, and preference settings will be
                added here in future versions of Campus Connect.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
