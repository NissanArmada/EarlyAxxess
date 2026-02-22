import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User,
  ClipboardPlus,
  HeartPulse,
  FileText, 
  ChevronRight, 
  Activity,
  Calendar,
  LogOut
} from 'lucide-react';


const PatientDashboard = () => {  
  // Mock data for visit summaries
  const visitSummaries = [
    {
      id: 1,
      doctor: "Dr. Sarah Mitchell",
      specialty: "General Practitioner",
      date: "Oct 24, 2023",
      snippet: "Discussed seasonal allergies and adjusted dosage for current medications...",
      category: "Routine Checkup"
    },
    {
      id: 2,
      doctor: "Dr. James Wilson",
      specialty: "Cardiology",
      date: "Oct 12, 2023",
      snippet: "Follow-up on heart rate monitoring. EKG results within normal parameters...",
      category: "Specialist Visit"
    },
    {
      id: 3,
      doctor: "Dr. Elena Rodriguez",
      specialty: "Dermatology",
      date: "Sep 28, 2023",
      snippet: "Skin examination complete. Recommended specific SPF and moisture routine...",
      category: "Consultation"
    }
  ];

  const handleLogout = () => {
    // Logic for logout
    console.log("User logged out");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-[#333333] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#B9233C] rounded-lg flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">EarlyAxxess</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <ClipboardPlus size={20} />
          <span>Summaries</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <User size={20} />
            <span>My Profile</span>
          </button>
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Hello, User</h2>
        </header>

        {/* Hero Section */}
        <div className="px-8 pt-8">
          <div className="relative bg-[#B9233C] rounded-[2.5rem] p-10 text-white overflow-hidden shadow-xl shadow-red-900/10">
            <HeartPulse 
              size={240} 
              className="absolute -right-12 -bottom-12 opacity-15 rotate-12 pointer-events-none" 
            />
            <div className="relative z-10 max-w-2xl space-y-4">
              <h1 className="text-5xl font-bold leading-tight">Insightful Summaries</h1>
              <p className="text-white/80 text-xl leading-relaxed max-w-xl">
                We turn your complex medical conversations with your doctors into kind, easy-to-understand summaries so you stay informed and never forget a detail.
              </p>
              <p className="text-white/60 text-sm font-medium pt-2">
                Look below to see your most recent visit summaries.
              </p>
            </div>
          </div>
        </div>

        {/* List Section */}
        <section className="px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <FileText size={22} className="text-[#B9233C]" />
              <span>Recent Visit Summaries</span>
            </h3>
          </div>

          <div className="grid gap-4">
            {visitSummaries.map((visit) => (
              <Link to="/summary">
                <div
                  key={visit.id}
                  className="bg-white border border-gray-100 p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#B9233C] bg-red-50 px-2 py-1 rounded">
                        {visit.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-400 space-x-1">
                        <Calendar size={12} />
                        <span>{visit.date}</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold group-hover:text-[#B9233C] transition-colors">
                      {visit.doctor}
                    </h4>
                    <p className="text-gray-500 text-sm italic mb-1">{visit.specialty}</p>
                    <p className="text-gray-600 line-clamp-1 max-w-2xl">
                      {visit.snippet}
                    </p>
                  </div>
                
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end text-xs text-gray-400"></div>
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#B9233C] group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;