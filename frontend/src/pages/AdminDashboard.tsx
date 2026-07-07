import React, { useState } from 'react';
import { 
  Building2, Users, AlertTriangle, ShieldAlert, BarChart3, 
  Map, User, CheckCircle2, ChevronRight, Activity, TrendingUp 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import InteractiveMap from '../components/InteractiveMap';

export const AdminDashboard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'collector' | 'state_admin'>('collector');

  // Seed Admin Grievance database log
  const grievancesLog = [
    { id: 'GRV-001', category: 'Sewer Overflow', reporter: 'Ramesh K.', priority: 9.4, sentiment: -0.85, status: 'In Progress', dept: 'Water Supply Board' },
    { id: 'GRV-002', category: 'Pothole Block', reporter: 'Sunita S.', priority: 8.5, sentiment: -0.62, status: 'Verified', dept: 'Public Works Dept' },
    { id: 'GRV-003', category: 'Streetlight Failure', reporter: 'Deepak M.', priority: 4.2, sentiment: -0.21, status: 'Reported', dept: 'Electricity Board' }
  ];

  // Seed Scam Shield Flags
  const scamShieldLogs = [
    { source: 'WhatsApp Forward SMS', verdict: 'SCAM', score: 98, warning: 'PM Free Laptop Scheme 2026 registration link.', date: 'Today' },
    { source: 'SMS Alert Link', verdict: 'SUSPICIOUS', score: 72, warning: 'Get 5000 subsidy immediately on deposit of verification fee.', date: 'Yesterday' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header Banner */}
      <header className="px-6 py-4 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-indigo-500" />
          <div>
            <h1 className="font-outfit text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Nagrik.OS Control Panel <span className="text-xs text-orange-500 bg-orange-950 border border-orange-900 px-2 py-0.5 rounded-full font-mono">ADMIN ACCESS</span>
            </h1>
            <p className="text-xs text-slate-400">Collector & State Administrative Command Center</p>
          </div>
        </div>

        {/* Administrative Role Selector */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1.5">
          <button
            onClick={() => setSelectedRole('collector')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              selectedRole === 'collector' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            District Collector view
          </button>
          <button
            onClick={() => setSelectedRole('state_admin')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              selectedRole === 'state_admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            State Administrator view
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Stats and GIS Grid Map (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Key Admin KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard className="p-4" hoverScale={false}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-semibold">Total Cases</span>
                <Activity className="h-4.5 w-4.5 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">438</h3>
              <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12% resolved this week
              </p>
            </GlassCard>

            <GlassCard className="p-4" hoverScale={false}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-semibold">Critical Priority</span>
                <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">14</h3>
              <p className="text-[10px] text-slate-400 mt-1">AI assigned to active routes</p>
            </GlassCard>

            <GlassCard className="p-4" hoverScale={false}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-semibold">Average SLA Resolution</span>
                <BarChart3 className="h-4.5 w-4.5 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">18.4 Hrs</h3>
              <p className="text-[10px] text-indigo-400 mt-1">2.4 Hrs ahead of target</p>
            </GlassCard>

            <GlassCard className="p-4" hoverScale={false}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-mono font-semibold">Fraud Block Rate</span>
                <ShieldAlert className="h-4.5 w-4.5 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold font-outfit text-white">99.2%</h3>
              <p className="text-[10px] text-orange-400 mt-1">12 duplicate reports merged</p>
            </GlassCard>
          </div>

          {/* Interactive GIS Grid component */}
          <div className="h-[400px]">
            <InteractiveMap />
          </div>

          {/* AI Grievance Priority Log Table */}
          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-outfit text-base font-bold text-slate-200">AI Grievance Queue & Priority Matrix</h3>
                <p className="text-xs text-slate-400">Prioritization calculated by vulnerability indexes + sentiment weight</p>
              </div>
              <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 border border-indigo-900 rounded font-mono">Live Sync</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5">ID</th>
                    <th className="py-2.5">Grievance Category</th>
                    <th className="py-2.5">Reporter</th>
                    <th className="py-2.5 text-center">AI Priority Score</th>
                    <th className="py-2.5 text-center">Sentiment Analysis</th>
                    <th className="py-2.5">Assigned Agency</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {grievancesLog.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-300">{g.id}</td>
                      <td className="py-3 font-medium text-white">{g.category}</td>
                      <td className="py-3 text-slate-400">{g.reporter}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold font-mono ${
                          g.priority >= 8.0 ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {g.priority}
                        </span>
                      </td>
                      <td className="py-3 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded ${
                          g.sentiment <= -0.5 ? 'bg-red-950/20 text-red-400' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {g.sentiment}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">{g.dept}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Scam Shield and Field Dispatch (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Scam Shield alerts */}
          <GlassCard className="border-t-4 border-t-orange-500">
            <h3 className="font-outfit text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-orange-500" /> Scam Shield Detections
            </h3>
            <p className="text-xs text-slate-400 mb-4">Phishing messages and fraud links flagged via Gemini Agent check</p>

            <div className="space-y-4">
              {scamShieldLogs.map((log, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                      {log.source}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      log.verdict === 'SCAM' 
                        ? 'bg-red-950/40 border-red-500/30 text-red-400' 
                        : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                    }`}>
                      {log.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">{log.warning}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 font-mono">
                    <span>Risk Score: {log.score}%</span>
                    <span>{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Active Field Officers Optimization */}
          <GlassCard>
            <h3 className="font-outfit text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" /> Field Dispatch Center
            </h3>
            <p className="text-xs text-slate-400 mb-4">Monitoring optimized pathfinding of department repair units</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-900/40 p-3 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-indigo-950 flex items-center justify-center border border-indigo-500/20 text-indigo-400 text-xs font-bold font-mono">
                    FO1
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Officer Suresh</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Task: Potholes repair</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-green-400 bg-green-950 px-2 py-0.5 border border-green-900 rounded">Optimized</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">3 stops left</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-900/40 p-3 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 text-xs font-bold font-mono">
                    FO2
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">Officer Mahendra</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Task: Sewer pipe clog</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 border border-amber-900 rounded">Pending sync</span>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">Mesh active</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
};
export default AdminDashboard;
