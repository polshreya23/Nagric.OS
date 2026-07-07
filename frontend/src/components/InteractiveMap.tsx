import React, { useState } from 'react';
import { MapPin, AlertTriangle, Navigation, CheckCircle2, User, Layers } from 'lucide-react';
import GlassCard from './GlassCard';

interface MapIncident {
  id: string;
  category: string;
  latitude: number;
  longitude: number;
  priorityScore: number;
  status: 'REPORTED' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'DUPLICATE';
  address: string;
}

export const InteractiveMap: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<MapIncident | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'optimized'>('all');

  const incidents: MapIncident[] = [
    { id: '1', category: 'Pothole Block', latitude: 12.9716, longitude: 77.5946, priorityScore: 8.5, status: 'VERIFIED', address: 'MG Road Metro, Bangalore' },
    { id: '2', category: 'Open Sewer Pipe', latitude: 12.9722, longitude: 77.5930, priorityScore: 9.4, status: 'IN_PROGRESS', address: 'Cubbon Road, Ward 12' },
    { id: '3', category: 'Broken Street Light', latitude: 12.9705, longitude: 77.5960, priorityScore: 4.2, status: 'REPORTED', address: 'Lavelle Road Corner' },
    { id: '4', category: 'Garbage Heap', latitude: 12.9710, longitude: 77.5950, priorityScore: 6.8, status: 'VERIFIED', address: 'Brigade Road Entry' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/40 rounded-3xl border border-slate-800/80 overflow-hidden backdrop-blur-xl">
      {/* Map Header Panel */}
      <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="font-outfit text-sm font-semibold text-slate-200">GIS SPATIAL GREVIANCE MONITOR</h3>
            <p className="text-xs text-slate-400">PostGIS Clustering + 15m Deduplication Active</p>
          </div>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              viewMode === 'all' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setViewMode('optimized')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'optimized' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="h-3 w-3" />
            Optimized Dispatch
          </button>
        </div>
      </div>

      {/* Styled Mock Map Sandbox Grid */}
      <div className="flex-1 relative bg-slate-950/90 overflow-hidden min-h-[300px]">
        {/* Custom Grid Gridlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
        
        {/* Map Vector Grid Lines (Path for Route Optimization) */}
        {viewMode === 'optimized' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 50,50 L 150,150 L 350,120 L 420,280"
              fill="none"
              stroke="#ea580c"
              strokeWidth="3"
              strokeDasharray="8,6"
              className="animate-[dash_4s_linear_infinite]"
            />
          </svg>
        )}

        {/* Map Incident Hotspots */}
        {incidents.map((incident) => {
          // Absolute layout coordinates mockup
          const mockCoords: Record<string, { top: string, left: string }> = {
            '1': { top: '30%', left: '25%' },
            '2': { top: '55%', left: '45%' },
            '3': { top: '70%', left: '80%' },
            '4': { top: '45%', left: '65%' }
          };
          const coords = mockCoords[incident.id] || { top: '50%', left: '50%' };

          const isCritical = incident.priorityScore >= 8.0;

          return (
            <button
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              style={{ top: coords.top, left: coords.left }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10"
            >
              <div className="relative">
                {/* Radial Glow */}
                <span className={`absolute -inset-2 rounded-full blur-sm opacity-50 scale-125 transition-transform duration-500 group-hover:scale-150 ${
                  isCritical ? 'bg-red-500' : 'bg-orange-500'
                }`} />
                
                <div className={`relative p-2 rounded-xl border flex items-center justify-center transition-all ${
                  isCritical
                    ? 'bg-red-950/80 border-red-500 text-red-400 group-hover:bg-red-900'
                    : 'bg-orange-950/80 border-orange-500 text-orange-400 group-hover:bg-orange-900'
                }`}>
                  <MapPin className="h-5 w-5" />
                </div>

                {/* Micro Label */}
                <div className="absolute top-full mt-1.5 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-[10px] text-slate-300 font-mono py-0.5 px-2 rounded-md border border-slate-800 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Score: {incident.priorityScore}
                </div>
              </div>
            </button>
          )}
        )}

        {/* Selected Incident Drawer */}
        {selectedIncident && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-800/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all z-20">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mb-2 ${
                  selectedIncident.priorityScore >= 8.0
                    ? 'bg-red-950/50 border border-red-500/30 text-red-400'
                    : 'bg-orange-950/50 border border-orange-500/30 text-orange-400'
                }`}>
                  <AlertTriangle className="h-3 w-3" /> Priority: {selectedIncident.priorityScore}
                </span>
                <h4 className="text-sm font-semibold text-slate-100">{selectedIncident.category}</h4>
                <p className="text-xs text-slate-400 mt-1">{selectedIncident.address}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono block mb-2">
                  {selectedIncident.status}
                </span>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Stats Footer */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>Total Grid Incidents: 4</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> 2 Critical</div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> 2 Warning</div>
        </div>
      </div>
    </div>
  );
};
export default InteractiveMap;
