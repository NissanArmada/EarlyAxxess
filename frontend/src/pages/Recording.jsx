import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mic,
  LayoutDashboard,
  ChevronLeft,
  Sparkles,
  Activity,
  User,
  ClipboardPlus,
  LogOut
} from 'lucide-react';

const Recording = () => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer logic for the active recording
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] text-[#333333] font-sans">
      
      {/* Sidebar - Fixed to prevent the layout gap */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#B9233C] rounded-lg flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">EarlyAxxess</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/doctor_dashboard" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
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

      {/* Main Content - ml-64 correctly offsets the fixed sidebar */}
      <main className="flex-grow flex flex-col ml-64 min-h-screen">
        
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Link to="/doctor_dashboard">
                <ChevronLeft size={20} />
              </Link>
            </button>
            <h1 className="text-xl font-bold">In-Visit Recording</h1>
          </div>
        </header>

        {/* Centered Content */}
        <div className="flex-grow flex flex-col items-center justify-center px-8 pb-20">
          
          {/* Large Microphone UI */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-[#B9233C]/20 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-[#B9233C]/10 rounded-full animate-pulse scale-150" />
            
            <div className="relative bg-white border-4 border-white shadow-2xl shadow-red-900/20 w-48 h-48 rounded-full flex items-center justify-center">
              <div className="bg-[#B9233C] w-40 h-40 rounded-full flex flex-col items-center justify-center text-white">
                <Mic size={56} className="mb-2" />
                <span className="text-2xl font-mono font-bold tracking-tighter">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <div className="pt-20 flex items-center justify-center space-x-2 mb-2">
              <span className="w-2 h-2 bg-[#B9233C] rounded-full animate-pulse" />
              <span className="text-sm font-bold text-[#B9233C] uppercase tracking-widest">Recording Conversation</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button 
            className="w-full max-w-sm py-6 rounded-2xl bg-[#333333] text-white font-bold text-xl shadow-2xl shadow-gray-900/20 transition-all hover:bg-black active:scale-95 flex items-center justify-center space-x-3 group"
          >
            <Sparkles size={24} className="group-hover:animate-pulse" />
            <span>Finish & Summarize</span>
          </button>

          <p className="mt-6 text-xs text-[#6B7280] font-medium uppercase tracking-wider">
            Confirm to end the visit and get your notes
          </p>

        </div>
      </main>
    </div>
  );
};

export default Recording;