import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Eye, Brain, Activity, Volume2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

type SystemStatus = 'ACTIVE' | 'WARNING' | 'ATTENTION' | 'OFFLINE';

interface SystemItem {
  label: string;
  status: SystemStatus;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SafetyCenter() {
  const { activeScenario, accessibility } = useApp();
  const mainRisk = activeScenario.decision.riskLevel;
  const riskColor = { LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560' }[mainRisk];

  const systemItems: SystemItem[] = [
    { label: 'System Safety Status', status: mainRisk === 'CRITICAL' ? 'WARNING' : mainRisk === 'HIGH' ? 'ATTENTION' : 'ACTIVE', detail: `Overall risk: ${mainRisk}`, icon: Shield },
    { label: 'Perception Status', status: 'ACTIVE', detail: `${activeScenario.objects.length} objects in range`, icon: Eye },
    { label: 'Path Planning', status: 'ACTIVE', detail: 'Route computed — optimal path', icon: Activity },
    { label: 'Decision Engine', status: mainRisk === 'CRITICAL' ? 'WARNING' : 'ACTIVE', detail: activeScenario.decision.action, icon: Brain },
    { label: 'Vision Adaptation Engine', status: 'ACTIVE', detail: `Mode: ${accessibility.visionMode.replace(/_/g, ' ')}`, icon: Eye },
    { label: 'Voice Alerts', status: accessibility.voiceEnabled ? 'ACTIVE' : 'OFFLINE', detail: accessibility.voiceEnabled ? 'Voice alerts enabled' : 'Voice alerts off', icon: Volume2 },
    { label: 'Accessibility Layer', status: 'ACTIVE', detail: `Profile applied — ${accessibility.conditions.filter(c => c !== 'none').length} adaptations active`, icon: ShieldCheck },
    { label: 'Emergency System', status: 'ACTIVE', detail: 'Emergency protocols ready', icon: AlertTriangle },
  ];

  const statusIcon = (s: SystemStatus) => {
    if (s === 'ACTIVE') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (s === 'WARNING') return <ShieldAlert className="w-5 h-5 text-red-400" />;
    if (s === 'ATTENTION') return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    return <Info className="w-5 h-5 text-slate-400" />;
  };
  const statusColor = (s: SystemStatus) => ({ ACTIVE: '#00d68f', WARNING: '#ff4560', ATTENTION: '#ffb300', OFFLINE: '#64748b' }[s]);
  const statusBg = (s: SystemStatus) => ({ ACTIVE: 'rgba(0,214,143,0.05)', WARNING: 'rgba(255,69,96,0.08)', ATTENTION: 'rgba(255,179,0,0.06)', OFFLINE: 'rgba(100,116,139,0.06)' }[s]);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Safety Center</h2>
      </div>

      {/* Overall safety status */}
      <div className="glass-panel p-5 rounded-2xl text-center" style={{ border: `1px solid ${riskColor}30` }}>
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Overall System Safety Status</div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: riskColor + '20', border: `2px solid ${riskColor}` }}>
            <Shield className="w-7 h-7" style={{ color: riskColor }} />
          </div>
        </div>
        <div className="text-2xl font-black" style={{ color: riskColor }}>
          {mainRisk === 'LOW' ? 'ALL SYSTEMS NOMINAL' : mainRisk === 'MEDIUM' ? 'CAUTION — MONITOR' : mainRisk === 'HIGH' ? 'ATTENTION REQUIRED' : 'CRITICAL — IMMEDIATE ACTION'}
        </div>
        <div className="text-slate-400 text-sm mt-2">{activeScenario.decision.action} · {activeScenario.name}</div>
        {/* Color-independent status bar */}
        {accessibility.colorIndependentWarnings && (
          <div className="mt-3 font-mono text-sm font-bold" style={{ color: riskColor }}>
            {mainRisk === 'CRITICAL' ? '████ CRITICAL' : mainRisk === 'HIGH' ? '███░ HIGH' : mainRisk === 'MEDIUM' ? '██░░ MEDIUM' : '█░░░ LOW'}
          </div>
        )}
      </div>

      {/* System items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {systemItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="glass-panel p-4 rounded-xl flex items-center gap-4"
              style={{ borderColor: statusColor(item.status) + '40', background: statusBg(item.status) }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: statusColor(item.status) + '15' }}>
                <Icon className="w-5 h-5" style={{ color: statusColor(item.status) }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white font-semibold text-sm truncate">{item.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                    style={{ background: statusColor(item.status) + '20', color: statusColor(item.status) }}>
                    {item.status}
                  </span>
                </div>
                <div className="text-slate-400 text-xs mt-0.5 truncate">{item.detail}</div>
              </div>
              {statusIcon(item.status)}
            </div>
          );
        })}
      </div>

      {/* Active warnings */}
      {activeScenario.warnings.length > 0 && (
        <div className="glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">Active Safety Warnings</span>
          </div>
          <div className="space-y-2">
            {activeScenario.warnings.map(w => {
              const wColor = { LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560' }[w.risk];
              return (
                <div key={w.id} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: wColor + '08', border: `1px solid ${wColor}30` }}>
                  <div className="text-xl flex-shrink-0">
                    {w.level === 4 ? '⛔' : w.level === 3 ? '⚠' : w.level === 2 ? '!' : 'ℹ'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-sm">{w.title}</span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: wColor + '20', color: wColor }}>
                        LVL {w.level}
                      </span>
                    </div>
                    <div className="text-slate-300 text-xs">{w.detail}</div>
                    {accessibility.colorIndependentWarnings && (
                      <div className="text-xs font-mono mt-1" style={{ color: wColor }}>
                        [{w.risk}] {w.risk === 'CRITICAL' ? '████' : w.risk === 'HIGH' ? '███░' : '██░░'}
                      </div>
                    )}
                  </div>
                  {w.distance && (
                    <div className="font-bold text-lg flex-shrink-0" style={{ color: wColor }}>{w.distance}m</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Simulated Haptic Indicators */}
      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">Simulated Haptic Alerts</span>
          </div>
          <span className="text-xs text-slate-500 italic">Software Simulation Only</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'LEFT', active: false, desc: 'Left zone' },
            { label: 'CENTER', active: mainRisk === 'CRITICAL', desc: 'Full seat' },
            { label: 'RIGHT', active: false, desc: 'Right zone' },
          ].map(h => (
            <div key={h.label} className={`p-3 rounded-xl text-center border transition-all ${h.active ? 'border-red-500/60 bg-red-500/10' : 'border-drive-border'}`}>
              <div className={`text-sm font-bold ${h.active ? 'text-red-400' : 'text-slate-500'}`}>{h.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{h.desc}</div>
              {h.active && <div className="text-xs text-red-400 mt-1 font-bold blink-slow">ACTIVE</div>}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 text-center mt-3">
          ⓘ Simulated haptic indicators — no physical hardware is involved.
        </p>
      </div>
    </div>
  );
}
