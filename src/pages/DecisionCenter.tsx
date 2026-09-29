import React from 'react';
import { Brain, AlertTriangle, Activity, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DecisionCenter() {
  const { activeScenario } = useApp();
  const risk = activeScenario.decision.riskLevel;
  const riskColor = { LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560' }[risk];

  const pipeline = [
    { label: 'Environment Perception', value: activeScenario.environment.roadType ?? 'Urban Road', status: 'ACTIVE' },
    { label: 'Object Detection', value: `${activeScenario.objects.length} object(s) detected`, status: activeScenario.objects.length > 0 ? 'DETECTING' : 'CLEAR' },
    { label: 'Risk Assessment', value: risk, status: risk === 'CRITICAL' || risk === 'HIGH' ? 'ALERT' : 'NOMINAL' },
    { label: 'Decision Engine', value: activeScenario.decision.action, status: 'ACTIVE' },
    { label: 'Path Planner', value: activeScenario.decision.nextAction, status: 'ACTIVE' },
    { label: 'Vision Adaptation', value: 'Adapting warnings to profile', status: 'ACTIVE' },
    { label: 'Output to Driver', value: `${activeScenario.warnings.length} alert(s) generated`, status: 'ACTIVE' },
  ];

  const statusColor = (s: string) => ({ ACTIVE: '#00d68f', DETECTING: '#ffb300', ALERT: '#ff4560', NOMINAL: '#00d68f', CLEAR: '#64748b' }[s] ?? '#64748b');

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Brain className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Autonomous Decision Center</h2>
      </div>

      {/* Current decision hero */}
      <div className="glass-panel p-6 rounded-2xl text-center"
        style={{ border: `1px solid ${riskColor}40`, background: `${riskColor}08` }}>
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Current Autonomous Decision</div>
        <div className="text-3xl sm:text-4xl font-black text-white mb-2">{activeScenario.decision.action}</div>
        <div className="text-slate-400 mb-3">{activeScenario.decision.reason}</div>
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: riskColor + '20', color: riskColor, border: `1px solid ${riskColor}60` }}>
            {risk} RISK
          </span>
        </div>
      </div>

      {/* Decision pipeline */}
      <div className="glass-panel p-5 rounded-xl space-y-0">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-white">Decision Pipeline</span>
        </div>
        <div className="space-y-0">
          {pipeline.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                  style={{ borderColor: statusColor(step.status), color: statusColor(step.status) }}>
                  {i + 1}
                </div>
                {i < pipeline.length - 1 && (
                  <div className="w-0.5 h-8" style={{ background: 'linear-gradient(' + statusColor(step.status) + ', ' + statusColor(pipeline[i + 1].status) + ')' }} />
                )}
              </div>
              <div className={`flex-1 flex items-center justify-between py-1 ${i < pipeline.length - 1 ? 'mb-0' : ''}`}>
                <div>
                  <div className="text-sm font-medium text-white">{step.label}</div>
                  <div className="text-xs text-slate-400">{step.value}</div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: statusColor(step.status) + '20', color: statusColor(step.status) }}>
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objects & next action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Detected Objects
          </div>
          {activeScenario.objects.length === 0 ? (
            <div className="text-slate-400 text-sm text-center py-4">No objects detected</div>
          ) : (
            <div className="space-y-2">
              {activeScenario.objects.map(obj => (
                <div key={obj.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: '#0f1628' }}>
                  <div>
                    <span className="text-white text-sm font-medium">{obj.label}</span>
                    <span className="text-slate-400 text-xs ml-2">{obj.distance}m</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: { LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560' }[obj.risk] }}>
                    {obj.risk}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel p-4 rounded-xl">
          <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-blue-400" />
            Next Actions
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(26,107,255,0.08)', border: '1px solid rgba(26,107,255,0.2)' }}>
              <div className="text-xs text-slate-400">Immediate</div>
              <div className="text-white font-bold">{activeScenario.decision.action}</div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: '#0f1628', border: '1px solid #1e2d4a' }}>
              <div className="text-xs text-slate-400">Follow-up</div>
              <div className="text-white font-medium text-sm">{activeScenario.decision.nextAction}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
