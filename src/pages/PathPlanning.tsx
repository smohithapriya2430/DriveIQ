import React from 'react';
import { Route, Navigation, ArrowRight, CornerDownLeft, CornerDownRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PathPlanning() {
  const { activeScenario } = useApp();

  const maneuvers = [
    { dist: 120, action: 'LEFT TURN', icon: <CornerDownLeft className="w-5 h-5" /> },
    { dist: 340, action: 'STRAIGHT', icon: <ArrowRight className="w-5 h-5" /> },
    { dist: 580, action: 'RIGHT TURN', icon: <CornerDownRight className="w-5 h-5" /> },
    { dist: 820, action: 'DESTINATION', icon: <Navigation className="w-5 h-5" /> },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Route className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Path Planning</h2>
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
          ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map visualization */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Route Visualization</span>
            <span className="text-xs text-slate-500">Simulated Map</span>
          </div>
          {/* SVG map */}
          <svg viewBox="0 0 400 300" className="w-full rounded-xl" style={{ background: '#0d1528' }}>
            {/* Grid */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <line x1={i * 57} y1="0" x2={i * 57} y2="300" stroke="#1e2d4a" strokeWidth="1" />
                <line x1="0" y1={i * 43} x2="400" y2={i * 43} stroke="#1e2d4a" strokeWidth="1" />
              </g>
            ))}

            {/* Alternative route */}
            <path d="M 50 250 Q 50 180 150 150 Q 250 120 300 80" stroke="#1e2d4a" strokeWidth="4" fill="none" strokeDasharray="8 6" />

            {/* Planned route */}
            <path d="M 50 250 L 50 180 L 200 180 L 200 100 L 320 100" stroke="#1a6bff" strokeWidth="4" fill="none" />

            {/* Highlight segment */}
            <path d="M 50 250 L 50 180" stroke="#00c2ff" strokeWidth="5" fill="none" />

            {/* Lane markers */}
            <path d="M 50 250 L 50 180 L 200 180 L 200 100 L 320 100" stroke="rgba(26,107,255,0.15)" strokeWidth="18" fill="none" />

            {/* Maneuver markers */}
            {[
              { x: 50, y: 180, label: 'L', color: '#1a6bff' },
              { x: 200, y: 180, label: '→', color: '#00c2ff' },
              { x: 200, y: 100, label: 'R', color: '#1a6bff' },
              { x: 320, y: 100, label: '★', color: '#ffb300' },
            ].map((m, i) => (
              <g key={i}>
                <circle cx={m.x} cy={m.y} r="14" fill={m.color + '30'} stroke={m.color} strokeWidth="2" />
                <text x={m.x} y={m.y + 5} textAnchor="middle" fill={m.color} fontSize="11" fontWeight="bold">{m.label}</text>
              </g>
            ))}

            {/* Ego vehicle */}
            <rect x="38" y="238" width="24" height="16" rx="3" fill="#1a3a6a" stroke="#4a7adf" strokeWidth="1.5" />
            <circle cx="50" cy="250" r="6" fill="rgba(26,107,255,0.3)" stroke="#1a6bff" strokeWidth="1" />

            {/* Objects on path */}
            {activeScenario.objects.slice(0, 2).map((obj, i) => (
              <g key={obj.id}>
                <rect x={80 + i * 60} y={165} width={18} height={12} rx="2" fill="#ff456030" stroke="#ff4560" strokeWidth="1.5" />
                <text x={89 + i * 60} y={145} textAnchor="middle" fill="#ff8c00" fontSize="9">{obj.label}</text>
              </g>
            ))}

            {/* Labels */}
            <text x="8" y="255" fill="#64748b" fontSize="9">START</text>
            <text x="310" y="90" fill="#ffb300" fontSize="9">DEST.</text>
            <text x="5" y="12" fill="#1a6bff" fontSize="10" fontWeight="bold">PATH PLANNING · SIMULATED</text>
          </svg>
        </div>

        {/* Maneuver list */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white">Upcoming Maneuvers</span>
          </div>
          {maneuvers.map((m, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${i === 0 ? 'border-blue-500/40 bg-blue-500/8' : 'border-drive-border'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-blue-600' : 'bg-drive-border'}`}
                style={{ color: i === 0 ? '#fff' : '#64748b' }}>
                {m.icon}
              </div>
              <div>
                <div className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-slate-400'}`}>{m.action}</div>
                <div className="text-xs text-slate-500">{m.dist} m</div>
              </div>
              {i === 0 && <span className="ml-auto text-xs font-bold text-blue-400">NEXT</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Path Planning', value: 'ACTIVE', color: '#00d68f' },
          { label: 'Route Status', value: 'Optimal', color: '#00d68f' },
          { label: 'Lane Position', value: 'Center', color: '#60a5fa' },
          { label: 'Next Maneuver', value: '120 m', color: '#1a6bff' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-3 rounded-xl">
            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
            <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Current Scenario', value: activeScenario.name },
          { label: 'Decision', value: activeScenario.decision.action },
          { label: 'Risk', value: activeScenario.decision.riskLevel },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 rounded-xl">
            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
            <div className="font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
