import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Search, 
  LayoutDashboard, 
  Activity, 
  X, 
  Database, 
  Network, 
  Clock, 
  Thermometer, 
  Heart, 
  Droplets, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  HeartPulse, 
  Info, 
  Mic, 
  ArrowRight,
  LogOut
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_PATIENTS = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    dob: '1982-05-14',
    mrn: 'MRN-882910',
    visitDate: 'Oct 24, 2023',
    complaint: 'Generalized weakness and palpitations',
    suggestedDiagnoses: [
      { 
        name: 'Acute Hyperkalemia', 
        confidence: 94.2,
        reasoning: [
          {
            text: 'Patient exhibits peaked T-waves on ECG Waveform Analysis.',
            source: 'PATIENT VISIT (TODAY)',
            icon: <Calendar className="w-3 h-3" />,
            highlights: ['peaked T-waves', 'ECG Waveform Analysis']
          },
          {
            text: 'Stage 3 CKD historical node correlates to K+ Excretion Failure.',
            source: 'USER KNOWLEDGE GRAPH',
            icon: <Network className="w-3 h-3" />,
            highlights: ['Stage 3 CKD', 'K+ Excretion Failure']
          },
          {
            text: 'Serum Potassium 6.2 mEq/L exceeds NHS Safety Thresholds.',
            source: 'NHS KNOWLEDGE BASE',
            icon: <Database className="w-3 h-3" />,
            highlights: ['Serum Potassium 6.2 mEq/L', 'NHS Safety Thresholds']
          }
        ]
      },
      { 
        name: 'Metabolic Acidosis', 
        confidence: 89.5,
        reasoning: [
          {
            text: 'Low serum bicarbonate levels detected in recent labs.',
            source: 'LAB RESULTS',
            icon: <Activity className="w-3 h-3" />,
            highlights: ['serum bicarbonate']
          },
          {
            text: 'Anion gap calculation suggests primary metabolic disturbance.',
            source: 'CLINICAL CALCULATOR',
            icon: <Database className="w-3 h-3" />,
            highlights: ['Anion gap']
          }
        ]
      },
      { name: 'Chronic Renal Failure', confidence: 12.5, reasoning: [] }
    ],
    vitals: { temp: '98.6', hr: '88', bp: '138/92' },
    soap: {
      subjective: 'Patient reports progressive muscle weakness over the last 24 hours. Notable history of Stage 3 CKD. Denies chest pain but reports "fluttering" sensation.',
      objective: 'Alert and oriented x3. Lungs clear to auscultation. ECG shows peaked T-waves. Potassium lab: 6.2 mEq/L.',
      assessment: 'Acute Hyperkalemia secondary to Chronic Kidney Disease exacerbation.',
      plan: 'Administer Calcium Gluconate 1g IV. Start Insulin/Dextrose protocol. Continuous cardiac monitoring. Consult Nephrology.'
    },
    icd: 'E87.5',
    orders: 'STAT ECG, Chem 7, IV Access, Insulin/Glucose infusion'
  },
  {
    id: '2',
    name: 'Robert Chen',
    dob: '1959-11-20',
    mrn: 'MRN-229384',
    visitDate: 'Oct 24, 2023',
    complaint: 'Productive cough and fever',
    suggestedDiagnoses: [
      { 
        name: 'Community Pneumonia', 
        confidence: 88.7,
        reasoning: [
          {
            text: 'Right lower lobe crackles noted during physical examination.',
            source: 'PHYSICAL EXAM',
            icon: <User className="w-3 h-3" />,
            highlights: ['Right lower lobe crackles']
          },
          {
            text: 'Oxygen saturation 91% on room air.',
            source: 'VITALS MONITOR',
            icon: <Activity className="w-3 h-3" />,
            highlights: ['91%', 'room air']
          }
        ]
      },
      { name: 'Acute Bronchitis', confidence: 45.2, reasoning: [] }
    ],
    vitals: { temp: '102.1', hr: '104', bp: '115/75' },
    soap: {
      subjective: '3-day history of productive cough with yellow sputum. Fever and chills.',
      objective: 'Temp 102.1, HR 104. RLL consolidation on percussion.',
      assessment: 'CAP, suspected bacterial.',
      plan: 'CXR, start Ceftriaxone, sputum culture.'
    },
    icd: 'J18.9',
    orders: 'Chest X-Ray, CBC, Sputum Culture'
  }
];

// --- Sub-components ---

const HighlightedText = ({ text, highlights }) => {
  if (!highlights || highlights.length === 0) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${highlights.join('|')})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => {
        const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
        return isHighlight ? (
          <span key={i} className="bg-red-50 text-[#B9233C] font-semibold px-1 rounded mx-0.5">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};

const DoctorDashboard = () => {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [editState, setEditState] = useState(null);
  const [activeDiagnosisForReasoning, setActiveDiagnosisForReasoning] = useState(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  useEffect(() => {
    if (selectedPatient) {
      setEditState({ ...selectedPatient });
      setActiveDiagnosisForReasoning(null);
    } else {
      setEditState(null);
      setActiveDiagnosisForReasoning(null);
    }
  }, [selectedPatientId]);


  const handleClose = () => setSelectedPatientId(null);

  const handleUpdateField = (category, field, value) => {
    if (category) {
      setEditState(prev => ({
        ...prev,
        [category]: { ...prev[category], [field]: value }
      }));
    } else {
      setEditState(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    setPatients(prev => prev.map(p => p.id === editState.id ? editState : p));
    handleClose();
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#333333] font-sans overflow-hidden">
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
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold">Hello, User</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patient..." 
              className="bg-gray-100 border-none rounded-2xl py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-[#B9233C]/20 transition-all" 
            />
          </div>
        </header>

        <div className="px-8 py-8 space-y-8">
          {/* Hero Section */}
          <section className="relative bg-[#B9233C] rounded-[2.5rem] p-12 text-white overflow-hidden shadow-2xl shadow-red-900/10 min-h-[18rem] flex flex-col justify-center">
            <HeartPulse 
              size={240} 
              className="absolute -right-12 -bottom-12 opacity-15 rotate-12 pointer-events-none" 
            />
            <div className="relative z-10 max-w-lg space-y-5">
              <h1 className="text-5xl font-bold leading-tight tracking-tight">Consultation Capture</h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-md">
                Record consultation audio to automatically generate structured SOAP notes and real-time diagnostic justifications.
              </p>
              <div>
                <Link to="/recording" className="mt-6 bg-white text-[#B9233C] px-8 py-4 rounded-2xl flex items-center space-x-3 font-bold text-lg hover:bg-gray-200 transition-all shadow-md active:scale-95">
                  <Mic size={20} />
                  <span>Start Recording Now</span>
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#333333] mb-6">Active Tickets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className="bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-medium"><Clock size={12} /> {patient.visitDate}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-1 group-hover:text-[#B9233C] transition-colors">{patient.name}</h4>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awaiting Review</span>
                    <button className="text-sm font-bold text-[#B9233C] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      Open <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modal Overlay */}
      {selectedPatientId && editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleClose}></div>
          
          <div className="bg-[#F9FAFB] w-full max-w-7xl h-full max-h-[900px] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Top Left X Button */}
            <div className="absolute top-6 left-6 z-30">
              <button onClick={handleClose} className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 text-gray-500 hover:text-[#B9233C] transition-all active:scale-95">
                <X size={24} />
              </button>
            </div>

            <div className="flex h-full pt-20">
              
              {/* Left Column: AI Diagnostics (1/3) */}
              <div className="w-1/3 border-r border-gray-200 bg-white p-10 overflow-y-auto relative">
                
                {/* Standard Diagnostic List View */}
                {!activeDiagnosisForReasoning ? (
                  <div className="animate-in slide-in-from-left duration-200">
                    <div className="mb-8">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">HIGH CONFIDENCE DIAGNOSTICS</span>
                      <p className="text-xs text-gray-500 mb-6">Select a diagnostic outcome to view clinical reasoning and evidence sources.</p>
                      
                      <div className="space-y-4">
                        {editState.suggestedDiagnoses
                          .filter(dx => dx.confidence > 85)
                          .map((dx, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setActiveDiagnosisForReasoning(dx)}
                            className="w-full text-left p-6 rounded-[1.5rem] border border-gray-100 bg-gray-50 hover:bg-red-50 hover:border-[#B9233C]/20 transition-all group flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-[#B9233C] uppercase tracking-widest">Confidence</span>
                                <span className="text-sm font-bold text-[#B9233C]">{dx.confidence}%</span>
                              </div>
                              <h2 className="text-xl font-bold text-gray-800">{dx.name}</h2>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#B9233C]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Clinical Reasoning View (Triggered on click) */
                  <div className="animate-in slide-in-from-right duration-200">
                    <button 
                      onClick={() => setActiveDiagnosisForReasoning(null)}
                      className="flex items-center gap-2 text-[10px] font-bold text-[#B9233C] uppercase tracking-widest mb-8 hover:translate-x-[-4px] transition-transform"
                    >
                      <ChevronLeft size={16} /> Back to Diagnostics
                    </button>

                    <div className="mb-10">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SELECTED DIAGNOSIS</span>
                        <span className="text-sm font-bold text-[#B9233C]">{activeDiagnosisForReasoning.confidence}% CONFIDENCE</span>
                      </div>
                      <h2 className="text-3xl font-bold text-[#B9233C] leading-tight">{activeDiagnosisForReasoning.name}</h2>
                    </div>

                    <div className="space-y-10">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Info size={14} /> AI Evidence Graph (Max 3)
                      </h3>
                      <div className="space-y-10">
                        {activeDiagnosisForReasoning.reasoning.slice(0, 3).map((reason, idx) => (
                          <div key={idx} className="relative pl-6 border-l-2 border-red-100">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 bg-[#B9233C] rounded-full"></div>
                            <p className="text-md leading-relaxed text-[#333333] mb-3">
                              <HighlightedText text={reason.text} highlights={reason.highlights} />
                            </p>
                            <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                              <span className="text-[#B9233C]">{reason.icon}</span>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{reason.source}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: EMR Input (2/3) */}
              <div className="w-2/3 p-10 overflow-y-auto bg-[#F9FAFB]">
                
                {/* Editable Storyboard Banner */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 mb-8 shadow-sm">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Patient Name</label>
                        <input 
                          value={editState.name} 
                          onChange={(e) => handleUpdateField(null, 'name', e.target.value)}
                          className="text-2xl font-bold border-none bg-transparent w-full p-0 focus:ring-0 focus:bg-gray-50 rounded-lg px-2 -mx-2"
                        />
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">DOB</label>
                          <input 
                            value={editState.dob} 
                            onChange={(e) => handleUpdateField(null, 'dob', e.target.value)}
                            className="text-xs font-semibold border-none bg-transparent w-full p-0 focus:ring-0"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">MRN</label>
                          <input 
                            value={editState.mrn} 
                            onChange={(e) => handleUpdateField(null, 'mrn', e.target.value)}
                            className="text-xs font-semibold border-none bg-transparent w-full p-0 focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Chief Complaint</label>
                      <input 
                        value={editState.complaint} 
                        onChange={(e) => handleUpdateField(null, 'complaint', e.target.value)}
                        className="text-lg font-bold text-[#B9233C] border-none bg-transparent w-full p-0 text-right focus:ring-0 focus:bg-gray-50 rounded-lg px-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Editable Vitals Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <EditableVital icon={<Thermometer size={18} className="text-orange-500" />} label="Temp" value={editState.vitals.temp} unit="°F" onChange={(val) => handleUpdateField('vitals', 'temp', val)} />
                  <EditableVital icon={<Heart size={18} className="text-red-500" />} label="HR" value={editState.vitals.hr} unit="BPM" onChange={(val) => handleUpdateField('vitals', 'hr', val)} />
                  <EditableVital icon={<Droplets size={18} className="text-blue-500" />} label="BP" value={editState.vitals.bp} unit="mmHg" onChange={(val) => handleUpdateField('vitals', 'bp', val)} />
                </div>

                {/* Clinical Notes (SOAP) */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-8 space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold">Clinical Notes (SOAP)</h4>
                    <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-md">AUTO-FILLED BY AI</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <NoteField label="SUBJECTIVE" value={editState.soap.subjective} onChange={(val) => handleUpdateField('soap', 'subjective', val)} />
                    <NoteField label="OBJECTIVE" value={editState.soap.objective} onChange={(val) => handleUpdateField('soap', 'objective', val)} />
                  </div>
                  <NoteField label="ASSESSMENT" value={editState.soap.assessment} onChange={(val) => handleUpdateField('soap', 'assessment', val)} />
                  <NoteField label="PLAN" value={editState.soap.plan} onChange={(val) => handleUpdateField('soap', 'plan', val)} />
                </div>

                {/* Orders & Diagnoses */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Suspected ICD</label>
                    <input value={editState.icd} onChange={(e) => handleUpdateField(null, 'icd', e.target.value)} className="w-full text-xl font-bold border-none bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B9233C]/10" />
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Active Orders</label>
                    <textarea value={editState.orders} onChange={(e) => handleUpdateField(null, 'orders', e.target.value)} className="w-full text-sm font-medium border-none bg-gray-50 rounded-xl px-4 py-3 h-20 resize-none focus:ring-2 focus:ring-[#B9233C]/10" />
                  </div>
                </div>

                {/* Final Actions */}
                <div className="flex justify-end gap-4 mt-12 pb-10">
                  <button onClick={handleClose} className="bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95">Discard</button>
                  <button onClick={handleSubmit} className="bg-[#B9233C] text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-red-900/10 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                    <CheckCircle2 size={20} /> Finalize & Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EditableVital = ({ icon, label, value, unit, onChange }) => (
  <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 flex items-center gap-4 shadow-sm group focus-within:border-[#B9233C]/30 transition-all">
    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-grow">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{label}</span>
      <div className="flex items-baseline gap-1">
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="text-xl font-bold border-none bg-transparent w-full p-0 focus:ring-0 leading-none h-6"
        />
        <span className="text-[10px] font-bold text-gray-400 uppercase">{unit}</span>
      </div>
    </div>
  </div>
);

const NoteField = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-[#B9233C] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md inline-block">{label}</label>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[120px] border-none bg-gray-50 rounded-2xl px-5 py-4 text-sm leading-relaxed focus:ring-2 focus:ring-[#B9233C]/10 transition-all"
    />
  </div>
);

export default DoctorDashboard;