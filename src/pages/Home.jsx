import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import Firestore services (replacing Supabase imports)
import { collection, query, onSnapshot, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase'; // Your Firebase Firestore instance

// Placeholder Components (Assuming you created these empty files in src/components/ui/)
// If these throw errors, check that these files exist in src/components/ui/
const Card = ({ className, children }) => <div className={`bg-card text-card-foreground border border-border rounded-xl shadow-lg ${className}`}>{children}</div>;
const CardContent = ({ className, children }) => <div className={`p-4 ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="p-4 pb-2">{children}</div>;
const CardTitle = ({ className, children }) => <h3 className={`font-semibold tracking-tight text-xl ${className}`}>{children}</h3>;
const CardDescription = ({ className, children }) => <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
const Badge = ({ variant = 'default', children }) => {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background text-foreground",
    // Custom colors to match the aesthetic theme
    accent: "bg-indigo-500/80 text-white",
  };
  const style = variants[variant] || variants.default;
  return <div className={`${baseStyle} ${style}`}>{children}</div>;
};
const Button = ({ size = 'default', variant = 'default', className, onClick, children }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors shadow-md";
  const sizes = {
    default: "h-10 px-4 py-2 text-base",
    lg: "h-11 px-8 text-lg",
  };
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "bg-transparent border border-white/40 text-white hover:bg-white/10",
    ghost: "bg-transparent text-foreground/80 hover:bg-foreground/10",
    // Custom style for the Hero button
    'btn-gradient': "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
  };
  const sizeStyle = sizes[size] || sizes.default;
  const variantStyle = variants[variant] || variants.default;

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
const Calendar = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const Users = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const TrendingUp = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const Bell = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;


// --- Firebase Logic for Data Fetching ---

const Home = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to format date (assuming 'date-fns' is installed)
  const formatDate = (timestamp) => {
    try {
      if (timestamp && timestamp.toDate) {
        return format(timestamp.toDate(), 'MMM dd, hh:mm a');
      }
      return 'N/A';
    } catch {
      return 'N/A';
    }
  };

  useEffect(() => {
    // 1. Fetch Upcoming Events (Real-time Listener)
    const eventsQuery = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      // NOTE: Filtering by current date is complex in Firestore.
      // For MVP, we order and limit for visual effect.
      limit(3)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp if necessary, assuming you saved it as a Firestore Timestamp
        date: doc.data().date,
      }));
      setEvents(eventsList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    // 2. Fetch Trending Clubs (Real-time Listener)
    // NOTE: Sorting by 'members_count' requires a composite index in Firestore.
    // We will just order by name/alphabetically for the MVP demo.
    const clubsQuery = query(
      collection(db, 'clubs'),
      orderBy('name', 'asc'),
      limit(4)
    );

    const unsubscribeClubs = onSnapshot(clubsQuery, (snapshot) => {
      const clubsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Placeholder member count if field is missing
        members_count: doc.data().members_count || 50
      }));
      setClubs(clubsList);
    });


    // Cleanup listeners when component unmounts
    return () => {
      unsubscribeEvents();
      unsubscribeClubs();
    };
  }, []);

  // Simple, static numbers for remaining stats (since user count is hard to track live)
  const activeStudents = '600+';
  const newUpdates = '35';


  // --- Render UI ---
  return (
    <div className="min-h-screen text-foreground bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#1A1A2E] py-20 text-white">
        {/* Aesthetic Mesh Background (Simulated with Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/60 to-indigo-900/60 opacity-80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Campus Connect
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your one-stop platform to stay connected, informed, and engaged on campus.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="btn-gradient" onClick={() => navigate('/events')}>
                <Calendar className="mr-2 h-5 w-5" />
                Explore Events
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/clubs')}>
                <Users className="mr-2 h-5 w-5" />
                Join Clubs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Stats (Displaying live counts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 -mt-32 relative z-20 mb-12">
          
          <Card className="glass-card card-hover bg-white/90 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{events.length}+</p>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover bg-white/90 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{clubs.length}+</p>
                  <p className="text-sm text-gray-600">Active Clubs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover bg-white/90 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{activeStudents}</p>
                  <p className="text-sm text-gray-600">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover bg-white/90 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{newUpdates}</p>
                  <p className="text-sm text-gray-600">New Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events List */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
            <Button variant="ghost" onClick={() => navigate('/events')} className="text-indigo-600">
              View All
            </Button>
          </div>
          
          {loading ? (
            <p className="text-lg text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-lg text-gray-500">No upcoming events found. Add some dummy data in Firestore!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="bg-white shadow-lg border border-gray-200">
                  {event.imageUrl && (
                    <div className="h-48 overflow-hidden rounded-t-xl bg-gray-100">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x300/e0e7ff/4338ca?text=No+Image"; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="accent">{event.host || 'General'}</Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(event.date)}
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-indigo-700">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span className="font-semibold">{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Trending Clubs List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Trending Clubs</h2>
            <Button variant="ghost" onClick={() => navigate('/clubs')} className="text-indigo-600">
              View All
            </Button>
          </div>
          
          {clubs.length === 0 ? (
            <p className="text-lg text-gray-500">Loading clubs...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {clubs.map((club) => (
                <Card key={club.id} className="bg-white shadow-lg border border-gray-200">
                  {club.image_url && (
                    <div className="h-32 overflow-hidden rounded-t-xl">
                       <img
                        src={club.image_url}
                        alt={club.name}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x128/9ca3af/ffffff?text=Club+Logo"; }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg text-indigo-600">{club.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600">
                      {club.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-semibold">
                        {club.members_count} members
                      </span>
                      <Badge variant="secondary">{club.category || 'Social'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
