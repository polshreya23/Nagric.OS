import React, { useState } from 'react';
import { 
  FolderLock, UserCheck, LayoutGrid, CheckSquare, BellRing, Sparkles, 
  BookOpen, Eye, Info, Volume2, ShieldAlert, WifiOff, Award, UploadCloud, FileText 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import GlassCard from '../components/GlassCard';
import JarvisAssistant from '../components/JarvisAssistant';
import InteractiveMap from '../components/InteractiveMap';

export const CitizenDashboard: React.FC = () => {
  const { 
    isDrishtiMode, isSugamyaMode, currentLanguage, 
    toggleDrishtiMode, toggleSugamyaMode, changeLanguage, 
    playFeedbackAudio, triggerHaptic 
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'home' | 'schemes' | 'vault' | 'issues'>('home');
  const [offlineMode, setOfflineMode] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);

  // Seed Scheme Recommendations
  const recommendedSchemes = [
    { id: '1', title: 'PM Fasal Bima Yojana (Crop Insurance)', matchScore: 94, category: 'Agriculture', status: 'ELIGIBLE', details: 'Drought/rain damage coverage. Missing: None' },
    { id: '2', title: 'Pradhan Mantri Mudra Yojana', matchScore: 82, category: 'Business Loan', status: 'CONDITIONAL', details: 'Collateral-free micro expansion loan. Missing: Business Cert' },
    { id: '3', title: 'Lakhpati Didi Scheme', matchScore: 75, category: 'Socioeconomic Upliftment', status: 'ELIGIBLE', details: 'Skill-development support for women. Missing: Income Cert' }
  ];

  // Seed DigiVault Documents
  const vaultDocs = [
    { type: 'Aadhaar ID Card', status: 'VERIFIED', hash: 'e921...c81a', date: 'Jul 2026' },
    { type: 'PAN Tax Document', status: 'VERIFIED', hash: 'fb91...1b23', date: 'Jun 2026' },
    { type: 'Income Certificate', status: 'EXPIRED', hash: '124c...88ee', date: 'Jan 2025' }
  ];

  // Seed Application Timelines
  const applications = [
    { scheme: 'Crop Insurance (Maize)', code: 'PMMY-10892', status: 'In Review', date: 'Jul 04, 2026' },
    { scheme: 'Sewage Overspill Repair', code: 'GRV-4410', status: 'Assigned', date: 'Jul 06, 2026' }
  ];

  const triggerEmergency = () => {
    triggerHaptic([300, 100, 300, 100, 300]);
    setEmergencyActive(prev => {
      const active = !prev;
      if (active) {
        playFeedbackAudio("Emergency Mode activated. Sharing real-time location with regional municipal disaster center.");
      } else {
        playFeedbackAudio("Emergency Mode deactivated.");
      }
      return active;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Dynamic Accessibility Controls & Status Header */}
      <header className="px-6 py-4 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl flex flex-wrap gap-4 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-orange-500 animate-pulse" />
          <div>
            <h1 className="font-outfit text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Nagrik.OS <span className="text-xs text-indigo-400 bg-indigo-950 border border-indigo-900 px-2 py-0.5 rounded-full font-mono">v1.2.0</span>
            </h1>
            <p className="text-xs text-slate-400">Government Digital Infrastructure Platform</p>
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Offline Sync Checkbox */}
          <button 
            onClick={() => { setOfflineMode(!offlineMode); triggerHaptic(40); }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              offlineMode 
                ? 'bg-amber-950/30 border-amber-500 text-amber-400' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <WifiOff className="h-4 w-4" />
            {offlineMode ? 'Nagrik Mesh Offline Active' : 'Online'}
          </button>

          {/* Languages Dropdown */}
          <select 
            value={currentLanguage} 
            onChange={(e) => changeLanguage(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="en">English (US)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="ur">اردو (Urdu)</option>
          </select>

          {/* Drishti Mode Switch */}
          <button
            onClick={toggleDrishtiMode}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
              isDrishtiMode 
                ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
            }`}
          >
            👁️ DRISHTI (Blind Assist)
          </button>

          {/* Sugamya Mode Switch */}
          <button
            onClick={toggleSugamyaMode}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
              isSugamyaMode 
                ? 'bg-orange-600 text-white border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.4)]' 
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
            }`}
          >
            💡 SUGAMYA (Low Literacy)
          </button>

          {/* Emergency Alert Switch */}
          <button
            onClick={triggerEmergency}
            className={`px-4 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
              emergencyActive 
                ? 'bg-red-600 text-white border-red-500 animate-bounce shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                : 'bg-red-950/40 border-red-900/60 text-red-400 hover:bg-red-900 hover:text-white'
            }`}
          >
            <ShieldAlert className="inline-block mr-1 h-4 w-4" /> SOS EMERGENCY
          </button>
        </div>
      </header>

      {/* 2. Unified Dashboards Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side Navigation and Interactive Panels */}
        <section className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Navigation Tags */}
          <div className="flex bg-slate-900/60 border border-slate-800/80 rounded-2xl p-1 gap-2 self-start backdrop-blur-md">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'schemes' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gov Schemes
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'vault' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DigiVault Document Organizer
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'issues' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Civic GIS Grid
            </button>
          </div>

          {/* Content Subsections */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Sugamya Mode Welcome Header (Icon-first storytelling) */}
              {isSugamyaMode && (
                <div className="bg-gradient-to-r from-orange-950/30 to-indigo-950/30 border border-orange-500/30 rounded-3xl p-6 flex items-center gap-6">
                  <div className="avatar-active rounded-full p-1 border border-orange-500">
                    <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-inner">
                      👨‍🌾
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-outfit font-bold text-orange-400">स्वागत है, रमेश जी!</h2>
                    <p className="text-sm text-slate-300 mt-1">अपने सरकारी सहायता एवं शिकायतों के विवरण देखने के लिए नीचे दिए गए चिन्हों को छुएं।</p>
                  </div>
                </div>
              )}

              {/* Citizen Stats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-indigo-950 border border-indigo-500/20 text-indigo-400">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-mono font-bold tracking-wider uppercase">Profile Identity</h4>
                    <p className="text-base font-semibold text-slate-200 mt-0.5">Ramesh Kumar</p>
                    <span className="text-[10px] text-green-400 bg-green-950 px-2 py-0.5 rounded border border-green-900 font-mono">Aadhaar Linked</span>
                  </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-orange-950 border border-orange-500/20 text-orange-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-mono font-bold tracking-wider uppercase">Scheme Matches</h4>
                    <p className="text-base font-semibold text-slate-200 mt-0.5">3 Available</p>
                    <span className="text-[10px] text-orange-400 bg-orange-950 px-2 py-0.5 rounded border border-orange-900 font-mono">Max Match: 94%</span>
                  </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400">
                    <CheckSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-400 font-mono font-bold tracking-wider uppercase">Active Tasks</h4>
                    <p className="text-base font-semibold text-slate-200 mt-0.5">2 Open Cases</p>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">SLA: On Time</span>
                  </div>
                </GlassCard>
              </div>

              {/* Active Application / Grievance Tracker Timeline */}
              <GlassCard>
                <h3 className="font-outfit text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-indigo-400" /> Active Application Timeline
                </h3>
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2" />
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{app.scheme}</p>
                          <p className="text-xs text-slate-400 font-mono">Reference: {app.code} • Submitted {app.date}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-400">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Map view snippet */}
              <div className="h-[350px]">
                <InteractiveMap />
              </div>
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className="space-y-6">
              {recommendedSchemes.map((scheme) => (
                <GlassCard key={scheme.id} className="border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-xs font-bold tracking-wider uppercase text-slate-400 font-mono block mb-1">{scheme.category}</span>
                      <h4 className="text-lg font-outfit font-bold text-white">{scheme.title}</h4>
                      <p className="text-sm text-slate-300 mt-2">{scheme.details}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-outfit font-extrabold text-orange-500">{scheme.matchScore}%</div>
                      <span className="text-[10px] font-mono text-indigo-400 tracking-wider block mt-1">AI MATCH MATCH</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 pt-4 border-t border-slate-800/80">
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all">
                      AI Auto-Fill & Submit
                    </button>
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" /> Scheme Details
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
                <div>
                  <h3 className="font-outfit text-sm font-semibold text-slate-200">Secure DigiVault Directory</h3>
                  <p className="text-xs text-slate-400">Personal files encrypted with SHA-256 government registers</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" /> Upload Document
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vaultDocs.map((doc, idx) => (
                  <GlassCard key={idx} className="flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          doc.status === 'VERIFIED'
                            ? 'bg-green-950/30 border-green-500/30 text-green-400'
                            : 'bg-red-950/30 border-red-500/30 text-red-400'
                        }`}>
                          {doc.status}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{doc.date}</span>
                      </div>
                      <h4 className="font-outfit font-bold text-slate-200 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-400" /> {doc.type}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">Hash ID: {doc.hash}</p>
                    </div>
                    {doc.status === 'EXPIRED' && (
                      <div className="mt-4 p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-xs text-red-400">
                        📄 **Action Needed**: Income Certificate expired. Click below to pull newer updates.
                      </div>
                    )}
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-3 py-2 rounded-xl border border-slate-700 transition-all mt-4">
                      View Encrypted File
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="h-[550px]">
              <InteractiveMap />
            </div>
          )}

        </section>

        {/* Right Side AI Assistant Grid Panel (Constant Companion) */}
        <section className="lg:col-span-4 h-[650px] flex flex-col sticky top-24">
          <JarvisAssistant />
        </section>

      </main>
    </div>
  );
};
export default CitizenDashboard;
