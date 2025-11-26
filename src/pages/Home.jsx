import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import {
  CalendarDays,
  Users as UsersIcon,
  TrendingUp,
  Bell,
  MapPin,
  Sparkles,
} from "lucide-react";

// small UI primitives
const Card = ({ className = "", children }) => (
  <div
    className={`rounded-2xl bg-slate-950/70 text-slate-50 border border-slate-800/80 shadow-[0_18px_40px_-24px_rgba(15,23,42,1)] backdrop-blur ${className}`}
  >
    {children}
  </div>
);
const CardContent = ({ className = "", children }) => (
  <div className={`p-4 md:p-5 ${className}`}>{children}</div>
);
const CardHeader = ({ className = "", children }) => (
  <div className={`px-4 pt-4 md:px-5 md:pt-5 ${className}`}>{children}</div>
);
const CardTitle = ({ className = "", children }) => (
  <h3 className={`font-semibold tracking-tight text-lg md:text-xl ${className}`}>
    {children}
  </h3>
);
const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-slate-400 ${className}`}>{children}</p>
);
const Badge = ({ variant = "default", className = "", children }) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold";
  const variants = {
    default: "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40",
    secondary: "bg-slate-800 text-slate-100 border border-slate-600",
    accent: "bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/50",
    outline: "bg-transparent text-slate-200 border border-slate-600",
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
  );
};
const Button = ({
  size = "default",
  variant = "default",
  className = "",
  onClick,
  children,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950";
  const sizes = {
    default: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-sm md:text-base",
  };
  const variants = {
    default:
      "bg-cyan-500 text-slate-950 shadow-[0_15px_40px_-18px_rgba_34,211,238,0.9] hover:bg-cyan-400 hover:-translate-y-[1px]",
    outline:
      "border border-slate-600 bg-slate-950/40 text-slate-50 hover:bg-slate-900/80 hover:-translate-y-[1px]",
    ghost:
      "bg-transparent text-cyan-300 hover:bg-slate-900/80 border border-transparent",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// main component
const Home = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    try {
      if (timestamp && timestamp.toDate) {
        return format(timestamp.toDate(), "MMM dd · hh:mm a");
      }
      return "TBA";
    } catch {
      return "TBA";
    }
  };

  useEffect(() => {
    const eventsQuery = query(
      collection(db, "events"),
      orderBy("date", "asc"),
      limit(3)
    );
    const unsubscribeEvents = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date,
        }));
        setEvents(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    );

    const clubsQuery = query(
      collection(db, "clubs"),
      orderBy("name", "asc"),
      limit(4)
    );
    const unsubscribeClubs = onSnapshot(clubsQuery, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        members_count: doc.data().members_count || 50,
      }));
      setClubs(list);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeClubs();
    };
  }, []);

  const activeStudents = "600+";
  const newUpdates = "35";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* custom animations */}
      <style>{`
        @keyframes gridPulse {
          0%,100% { opacity: 0.22; }
          50% { opacity: 0.38; }
        }
        @keyframes streakMove {
          0% { transform: translateX(-40%); opacity: 0; }
          10% { opacity: 0.8; }
          60% { opacity: 0.9; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes floatSoft {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-grid-pulse { animation: gridPulse 8s ease-in-out infinite; }
        .animate-streak { animation: streakMove 5.5s linear infinite; }
        .animate-streak-delay { animation: streakMove 7s linear infinite 1.5s; }
        .animate-float-soft { animation: floatSoft 10s ease-in-out infinite; }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* tech grid */}
        <div
          className="pointer-events-none absolute inset-0 animate-grid-pulse"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(51,65,85,0.7) 1px, transparent 1px),linear-gradient(to bottom, rgba(51,65,85,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* glowing spheres */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-[-60px] top-32 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute left-1/2 bottom-[-80px] h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
        </div>
        {/* lightning-like streaks */}
        <div className="pointer-events-none absolute inset-x-0 top-24 h-1">
          <div className="animate-streak h-px w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="animate-streak-delay mt-2 h-px w-1/2 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />
        </div>

        <div className="relative container mx-auto flex flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:py-20">
          {/* left */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold text-cyan-200">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Campus Connect · Live console</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Your{" "}
              <span className="text-cyan-300">real-time dashboard</span> for
              campus life.
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Track events, discover clubs, and watch your campus activity update
              in front of you like a control panel – but made for students.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/events")}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Upcoming events
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/clubs")}
              >
                <UsersIcon className="mr-2 h-4 w-4" />
                Explore clubs
              </Button>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <div className="flex -space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-semibold text-slate-950">
                  CSE
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-[10px] font-semibold text-slate-950">
                  ECE
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-slate-950">
                  ME
                </div>
              </div>
              <span>Data flowing from clubs & departments across campus.</span>
            </div>
          </div>

          {/* right: animated panel */}
          <div className="relative mx-auto w-full max-w-md md:mx-0">
            <div className="animate-float-soft relative rounded-3xl border border-slate-700/80 bg-slate-950/80 p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,1)] backdrop-blur">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-50">
                  Event stream · now
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  synced
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900/90 px-3 py-2 shadow-sm shadow-black/60"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-[11px] font-semibold text-cyan-200">
                      {event.title?.[0]?.toUpperCase() || "E"}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-50 line-clamp-1">
                        {event.title || "Untitled Event"}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-400">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(event.date)}
                      </p>
                      {event.location && (
                        <p className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {event.host || "Campus"}
                    </Badge>
                  </div>
                ))}

                {events.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-3 text-xs text-slate-400">
                    No events yet. Add some in Firestore to see this panel light up ⚡
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Connected students: {activeStudents}</span>
                <span className="inline-flex items-center gap-1">
                  <Bell className="h-3 w-3 text-amber-300" />
                  {newUpdates} new updates
                </span>
              </div>
            </div>

            {/* small angle image chip */}
            <div className="absolute -left-6 bottom-4 hidden w-24 overflow-hidden rounded-2xl border border-slate-700 shadow-lg shadow-black/70 md:block">
              <img
                src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&dpr=2&w=400"
                alt="Campus at night"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="container mx-auto -mt-8 px-4 pb-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            <CardContent className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                <CalendarDays className="h-5 w-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-xl font-semibold">{events.length}+</p>
                <p className="text-xs text-slate-400">Upcoming events</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15">
                <UsersIcon className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <p className="text-xl font-semibold">{clubs.length}+</p>
                <p className="text-xs text-slate-400">Active clubs</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15">
                <TrendingUp className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xl font-semibold">{activeStudents}</p>
                <p className="text-xs text-slate-400">Students engaged</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15">
                <Bell className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <p className="text-xl font-semibold">{newUpdates}</p>
                <p className="text-xs text-slate-400">New updates</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="container mx-auto px-4 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-50">
              Upcoming events
            </h2>
            <p className="text-xs text-slate-400">
              Fests, hackathons, club meets – in one timeline.
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-xs font-semibold text-cyan-300"
            onClick={() => navigate("/events")}
          >
            View all
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading events…</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-slate-400">
            No events yet. Add some in Firestore to see them here.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event.id}
                className="group overflow-hidden border border-slate-800/80 hover:-translate-y-1 hover:shadow-[0_25px_70px_-40px_rgba(15,23,42,1)] transition"
              >
                <div className="h-40 w-full overflow-hidden bg-slate-800">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://images.pexels.com/photos/167404/pexels-photo-167404.jpeg?auto=compress&dpr=2&w=600";
                      }}
                      className="h-full w-full object-cover transition group-hover:scale-105 group-hover:brightness-110"
                    />
                  ) : (
                    <img
                      src="https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&dpr=2&w=600"
                      alt="Event banner"
                      className="h-full w-full object-cover transition group-hover:scale-105 group-hover:brightness-110"
                    />
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <Badge variant="accent">
                      {event.host || "Campus"}
                    </Badge>
                    <span className="text-slate-400">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <CardTitle className="text-base md:text-lg group-hover:text-cyan-300">
                    {event.title || "Untitled Event"}
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {event.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location || "On campus"}
                  </span>
                  <button className="text-cyan-300 font-semibold">
                    View details
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* TRENDING CLUBS */}
      <section className="border-t border-slate-800 bg-slate-950 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-50">
                Trending clubs
              </h2>
              <p className="text-xs text-slate-400">
                Join teams that actually meet, build, and ship.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-xs font-semibold text-cyan-300"
              onClick={() => navigate("/clubs")}
            >
              View all
            </Button>
          </div>

          {clubs.length === 0 ? (
            <p className="text-sm text-slate-400">Loading clubs…</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {clubs.map((club) => (
                <Card
                  key={club.id}
                  className="group overflow-hidden border border-slate-800/80 hover:-translate-y-1 hover:shadow-[0_25px_70px_-40px_rgba(15,23,42,1)] transition"
                >
                  <div className="h-28 w-full overflow-hidden bg-slate-800">
                    {club.image_url ? (
                      <img
                        src={club.image_url}
                        alt={club.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&dpr=2&w=500";
                        }}
                        className="h-full w-full object-cover transition group-hover:scale-105 group-hover:brightness-110"
                      />
                    ) : (
                      <img
                        src="https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&dpr=2&w=500"
                        alt="Club"
                        className="h-full w-full object-cover transition group-hover:scale-105 group-hover:brightness-110"
                      />
                    )}
                  </div>

                  <CardHeader className="pb-1">
                    <CardTitle className="text-base group-hover:text-cyan-300">
                      {club.name}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {club.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between pt-0 text-xs text-slate-400">
                    <span className="font-semibold">
                      {club.members_count} members
                    </span>
                    <Badge variant="secondary">
                      {club.category || "Campus club"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
