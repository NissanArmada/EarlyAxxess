import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Stethoscope, 
  MessageSquare, 
  Clock,
  Activity,
  LayoutDashboard,
  ClipboardPlus,
  User,
  Info,
  Mic,
  Bot,
  Send,
  X,
  Sparkles,
  LogOut
} from 'lucide-react';

const Summary = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm your EarlyAxxess AI assistant. I've reviewed your summary from today's visit with Dr. Mitchell. How can I help you understand your results or plan today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response based on the transcription/narrative
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Based on your conversation with Dr. Mitchell, she recommended increasing your Cetirizine to 10mg. If you feel tired, you can try taking it at night instead of the morning. Would you like me to clarify anything else about the dosage?" 
      }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#333333] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#B9233C] rounded-lg flex items-center justify-center text-white">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">EarlyAxxess</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/patient_dashboard" className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Sticky Header */}
        <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link to="/patient_dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors"> 
              <ChevronLeft size={20} />
            </Link>
            <div className="flex flex-col">
              <span className="text-xs text-[#6B7280] uppercase tracking-widest font-semibold">Visit Details</span>
              <h1 className="text-lg font-bold">Post-Visit Summary</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 bg-gray-100 text-[#333333] px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all active:scale-95"
            >
              <Sparkles size={16} className="text-[#B9233C]" />
              Ask AI Assistant
            </button>
            <button className="bg-[#B9233C] text-white px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-red-900/10">
              Download PDF
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Hero Section - Dr. Mitchell Info */}
            <section className="bg-[#B9233C] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-red-900/20">
              <Stethoscope className="absolute -right-8 -bottom-8 w-64 h-64 text-white opacity-10 rotate-12 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Dr. Sarah Mitchell
                    </span>
                    <div className="flex items-center gap-1.5 text-white/80 text-xs">
                      <Calendar size={14} />
                      Oct 24, 2023
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Routine Checkup</h2>
                    <p className="text-xl text-white/80 italic font-light">General Practitioner</p>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-3xl border-4 border-white/20 p-1 bg-white/10">
                     <img 
                      src="https://images.unsplash.com/photo-1559839734-2b71f1536783?w=200&h=200&fit=crop" 
                      className="w-full h-full object-cover rounded-2xl" 
                      alt="Dr. Mitchell" 
                     />
                  </div>
                </div>
              </div>
            </section>

            {/* Summary Content */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#B9233C]">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Visit Narrative</h3>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Patient presented today complaining of increased watery eyes, sneezing, and nasal congestion over the past two weeks. Symptoms appear consistent with <strong>seasonal allergies</strong> triggered by rising pollen counts.
                  </p>
                  <p>
                    We reviewed the current medication efficacy. Patient noted that the standard OTC dose of Cetirizine was no longer providing full relief throughout the day.
                  </p>
                  <blockquote className="border-l-4 border-[#B9233C] bg-red-50/50 p-4 rounded-r-xl italic">
                    "Discussed seasonal allergies and adjusted dosage for current medications. Patient reported significant fatigue after high-pollen days."
                  </blockquote>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#333333]">
                      <Mic size={20} />
                    </div>
                    <h3 className="text-xl font-bold">Visit Transcription</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7280] font-medium bg-gray-50 px-3 py-1.5 rounded-full">
                    <Clock size={14} />
                    Duration: 12:44
                  </div>
                </div>

                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                  <p><strong>Dr. Sarah Mitchell:</strong> Good morning, Alex. It's good to see you again. I noticed on your intake form you've been having a bit of a rough time with allergies lately?</p>
                  <p><strong>Alex Johnson:</strong> Yeah, it's been pretty constant for the last two weeks. The watery eyes are the worst part, especially in the mornings. I'm sneezing non-stop as soon as I step outside.</p>
                  <p><strong>Dr. Sarah Mitchell:</strong> I see. Are you still taking the Cetirizine daily like we discussed last fall?</p>
                  <p><strong>Alex Johnson:</strong> I am, but it doesn't seem to be holding up. By lunch time, it feels like I haven't taken anything at all. I've also been feeling really wiped out, just total fatigue.</p>
                  <p><strong>Dr. Sarah Mitchell:</strong> That makes sense. The pollen counts have been hitting record highs this week. Given that your current 5mg dose isn't cutting it, I'd like to bump you up to the full 10mg daily strength. We should also look at adding a nasal spray for that congestion.</p>
                  <p><strong>Alex Johnson:</strong> Okay, I'm willing to try anything. Will the higher dose make me more sleepy?</p>
                  <p><strong>Dr. Sarah Mitchell:</strong> Typically, Cetirizine is non-drowsy, but at the higher dose, some people notice a slight effect. If you find it makes you tired, try taking it right before bed instead of in the morning. It should still provide coverage throughout the following day.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Pop-up Panel */}
        {isChatOpen && (
          <div className="fixed bottom-8 right-8 w-96 bg-white border border-gray-100 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all animate-in slide-in-from-bottom-4 duration-300 max-h-[600px]">
            {/* Header */}
            <div className="p-5 bg-[#333333] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#B9233C] rounded-lg flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Alexxis</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Online</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-5 space-y-4 bg-gray-50/50 min-h-[300px]"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#B9233C] text-white rounded-br-none shadow-md shadow-red-900/10' 
                      : 'bg-white border border-gray-100 text-[#333333] rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question about your visit..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-[#B9233C]/20 outline-none transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1.5 p-1.5 bg-[#B9233C] text-white rounded-lg hover:bg-[#a11d33] transition-colors shadow-sm"
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                <Info size={10} /> Powered by Axxess intelligence
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Summary;