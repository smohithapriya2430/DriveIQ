import React from 'react';
import { Map, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { scenarios } from '../data/mockData';
import { VisionAdaptationEngine } from '../modules/visionAdaptation/VisionAdaptationEngine';
import { voiceService } from '../modules/voice/VoiceService';

export default function ScenarioSimulation() {
  const { activeScenario, setActiveScenario, accessibility, voiceMuted } = useApp();
  const engine = new VisionAdaptationEngine(accessibility);

  const riskColor = { LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560' };

  const handleSelect = (scenario: typeof scenarios[0]) => {
    setActiveScenario(scenario);
    // Trigger voice
    if (!voiceMuted && accessibility.voiceEnabled) {
      scenario.warnings.forEach(w => {
        if (engine.shouldSpeak(w)) {
          voiceService.setRate(accessibility.voiceSpeed);
          voiceService.speak(w.voiceText, w.level === 4);
        }
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Map className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Scenario Simulation</h2>
      </div>
      <p className="text-slate-400 text-sm">Select a driving scenario to simulate the full perception → decision → adaptation → warning pipeline.</p>

      {/* Active scenario hero */}
      <div className="glass-panel p-5 rounded-2xl"
        style={{ border: `1px solid ${riskColor[activeScenario.decision.riskLevel]}40` }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Active Scenario</div>
            <div className="text-2xl font-black text-white">{activeScenario.name}</div>
            <div className="text-slate-400 text-sm">{activeScenario.description}</div>
          </div>
          <span className="px-3 py-1.5 rounded-lg font-bold text-sm"
            style={{ background: riskColor[activeScenario.decision.riskLevel] + '20', color: riskColor[activeScenario.decision.riskLevel], border: `1px solid ${riskColor[activeScenario.decision.riskLevel]}50` }}>
            {activeScenario.decision.riskLevel} RISK
          </span>
        </div>

        {/* Pipeline steps */}
        <div className="flex flex-wrap items-center gap-1 mt-4 text-xs">
          {[
            `Env: ${activeScenario.environment.roadType ?? 'Road'}`,
            `Objects: ${activeScenario.objects.length}`,
            `Decision: ${activeScenario.decision.action}`,
            `Alerts: ${activeScenario.warnings.length}`,
            `Adapted: ${accessibility.visionMode.replace(/_/g, ' ')}`,
          ].map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-2 py-1 rounded text-slate-300 font-medium" style={{ background: '#1e2d4a' }}>{step}</span>
              {i < 4 && <span className="text-slate-600">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Adapted warnings for current scenario */}
      {activeScenario.warnings.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Adapted Warning (Vision: {accessibility.visionMode.replace(/_/g, ' ')})
          </div>
          {activeScenario.warnings.map(w => {
            const adapted = engine.adaptWarning(w);
            const col = riskColor[adapted.risk];
            return (
              <div key={w.id} className={`rounded-xl p-4 ${adapted.emphasis === 'critical' ? 'warning-critical' : adapted.emphasis === 'high' ? 'warning-medium' : 'warning-low'}`}
                style={{ borderColor: col }}>
                <div className="flex items-start gap-3">
                  <span className={`${accessibility.textSize === 'x-large' ? 'text-4xl' : 'text-2xl'}`}>{adapted.icon}</span>
                  <div className="flex-1">
                    <div className={`font-black text-white ${accessibility.textSize === 'x-large' ? 'text-3xl' : accessibility.textSize === 'large' ? 'text-2xl' : 'text-lg'}`}>
                      {adapted.title}
                    </div>
                    <div className={`text-slate-300 whitespace-pre-line mt-0.5 ${accessibility.textSize !== 'normal' ? 'text-base' : 'text-sm'}`}>
                      {adapted.detail}
                    </div>
                    {adapted.distance && (
                      <div className={`font-black mt-1 ${accessibility.textSize === 'x-large' ? 'text-4xl' : 'text-2xl'}`} style={{ color: col }}>
                        {adapted.distance} m
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: col + '20', color: col }}>{adapted.riskLabel}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-drive-border text-slate-300">{adapted.actionText}</span>
                      {adapted.usePattern && <span className="px-2 py-0.5 rounded text-xs font-mono border border-slate-600 text-slate-400">
                        {adapted.risk === 'CRITICAL' ? '████ CRITICAL' : adapted.risk === 'HIGH' ? '███░ HIGH' : '██░░ MEDIUM'}
                      </span>}
                      {adapted.showVoiceIndicator && <span className="px-2 py-0.5 rounded text-xs text-blue-400 border border-blue-500/30">🔊 VOICE</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scenario selector */}
      <div>
        <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">Select Scenario</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {scenarios.map(s => {
            const isActive = s.id === activeScenario.id;
            const col = riskColor[s.decision.riskLevel];
            return (
              <button key={s.id} onClick={() => handleSelect(s)}
                className={`p-4 rounded-xl text-left transition-all border hover:scale-[1.01] ${isActive ? 'border-blue-500 bg-blue-500/8' : 'border-drive-border hover:border-blue-500/40'}`}
                style={{ background: isActive ? `${col}08` : undefined }}>
                <div className="flex items-start justify-between mb-2">
                  {isActive
                    ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    : <Play className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  }
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded ml-auto" style={{ background: col + '20', color: col }}>
                    {s.decision.riskLevel}
                  </span>
                </div>
                <div className="font-bold text-white text-sm mb-1">{s.name}</div>
                <div className="text-slate-500 text-xs">{s.description}</div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>{s.objects.length} obj</span>
                  <span>{s.warnings.length} alert{s.warnings.length !== 1 ? 's' : ''}</span>
                </div>
                {isActive && <div className="mt-2 text-xs text-blue-400 font-semibold">▶ RUNNING</div>}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">
        ⓘ All scenarios are software simulations. No real vehicle, sensor, or road data is used.
      </p>
    </div>
  );
}
