import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Users, Link as LinkIcon, Mail, Zap, Sparkles } from "lucide-react";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsRef = collection(db, "clubs");
        const snapshot = await getDocs(clubsRef);

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClubs(list);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const getInitials = (name = "") => {
    const trimmed = name.trim();
    if (!trimmed) return "?";
    const parts = trimmed.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const neonColors = [
    "from-cyan-400 to-blue-500",
    "from-fuchsia-500 to-purple-600",
    "from-green-400 to-emerald-500",
    "from-yellow-400 to-amber-500",
    "from-pink-400 to-rose-500",
  ];

  const getNeon = (index) => neonColors[index % neonColors.length];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014] text-slate-100">
      {/* ------------------ ANIMATED BACKGROUND ------------------ */}
      <style>{`
        @keyframes moveLines {
          from { transform: translateX(-200px); }
          to { transform: translateX(200px); }
        }
        @keyframes pulseOrb {
          0%,100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0px); opacity: 0.15; }
          50% { transform: translateY(-22px); opacity: 0.35; }
          100% { transform: translateY(0px); opacity: 0.15; }
        }
      `}</style>

      {/* Neon moving lines */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-[120vw] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
            style={{
              top: `${i * 4}vh`,
              animation: "moveLines 6s linear infinite",
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Floating neon orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl animate-[pulseOrb_8s_infinite]" />
        <div className="absolute bottom-32 right-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-[pulseOrb_10s_infinite]" />
        <div className="absolute left-1/3 top-1/3 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl animate-[floatUp_7s_infinite]" />
      </div>

      {/* ------------------ PAGE CONTENT ------------------ */}
      <div className="max-w-6xl mx-auto px-4 py-14 relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/40 px-3 py-1 text-[11px] font-semibold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Club System Interface
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Club Directory
          </h1>

          <p className="mt-2 max-w-xl text-sm text-cyan-100/80">
            All student-led organizations connected in one neon network.  
            Tap into their energy. Explore, join, collaborate.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-cyan-200">Loading clubs…</p>
        ) : error ? (
          <p className="text-sm text-rose-400">Error: {error}</p>
        ) : clubs.length === 0 ? (
          <p className="text-sm text-gray-400">No clubs found.</p>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club, index) => {
              const initials = getInitials(club.name);
              const neon = getNeon(index);

              return (
                <article
                  key={club.id}
                  className="relative flex flex-col rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl p-6 shadow-[0_0_40px_-10px_rgba(0,255,255,0.4)] transition hover:border-cyan-400 hover:shadow-[0_0_45px_0px_rgba(0,255,255,0.6)] hover:-translate-y-1"
                >
                  {/* Top glowing line */}
                  <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

                  <div className="mb-6 flex items-start justify-between">
                    {/* Left text */}
                    <div className="pr-3">
                      <h2 className="text-lg font-bold text-cyan-200 mb-1">
                        {club.name}
                      </h2>

                      <p className="text-xs text-cyan-100/80 line-clamp-3">
                        {club.description}
                      </p>

                      <div className="mt-3 space-y-1 text-[11px]">
                        {club.contact && (
                          <p className="flex items-center gap-1 text-cyan-200">
                            <Mail className="h-3 w-3 text-cyan-300" />
                            {club.contact}
                          </p>
                        )}

                        {club["head name"] && (
                          <p className="text-cyan-100">{club["head name"]}</p>
                        )}

                        {club["social media"] && (
                          <p className="flex items-center gap-1 text-fuchsia-300">
                            <LinkIcon className="h-3 w-3" />
                            {club["social media"]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Logo / initials avatar */}
                    <div className="flex-shrink-0">
                      {club.imageURL ? (
                        <div className="relative h-14 w-14">
                          <img
                            src={club.imageURL}
                            alt={club.name}
                            className="h-14 w-14 rounded-full border border-cyan-300 object-cover shadow-lg shadow-cyan-500/30"
                          />
                        </div>
                      ) : (
                        <div className="relative h-14 w-14">
                          <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${neon} blur-md opacity-70`}
                          />
                          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-black border border-cyan-400 text-lg font-bold text-white shadow-md shadow-cyan-500/40">
                            {initials}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer: member count + button */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-cyan-500/20">
                    <div className="flex items-center gap-2 text-[11px]">
                      <div className="h-7 w-7 flex items-center justify-center rounded-xl bg-black border border-cyan-300">
                        <Users className="h-3.5 w-3.5 text-cyan-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-cyan-200">
                          {club.members_count
                            ? `${club.members_count} members`
                            : "Active members"}
                        </p>
                        <p className="text-[10px] text-cyan-100/70">
                          {club.category || "Campus Club"}
                        </p>
                      </div>
                    </div>

                    <button className="rounded-xl bg-cyan-400 px-3 py-1.5 text-[11px] font-semibold text-slate-900 shadow-lg shadow-cyan-500/40 transition hover:bg-cyan-300">
                      View Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
