import React, { useEffect, useState } from 'react';
import {
  Gauge, Battery, Thermometer, Eye, AlertTriangle, CheckCircle,
  Navigation, Car, User, CloudRain, Activity, Zap, Volume2,
  ShieldCheck, TrendingDown, ArrowRight, Clock, MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VisionAdaptationEngine } from '../modules/visionAdaptation/VisionAdaptationEngine';
import { voiceService } from '../modules/voice/VoiceService';

export default function DashboardHome() {
  const { driver, accessibility, activeScenario, vehicle, environment, voiceMuted } = useApp();
  const engine = new VisionAdaptationEngine(accessibility);
  const theme = engine.getTheme();
  const adaptedWarnings = activeScenario.warnings.map(w => engine.adaptWarning(w));
  const [speed, setSpeed] = useState(vehicle.speed);
  const [tick, setTick] = useState(0);

  // Simulate live speed variation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => {
        const drift = (Math.random() - 0.5) * 3;
        return Math.max(0, Math.min(130, prev + drift));
      });
      setTick(t => t + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Voice alerts
  useEffect(() => {
    if (voiceMuted) return;
    voiceService.setEnabled(accessibility.voiceEnabled);
    voiceService.setRate(accessibility.voiceSpeed);
    voiceService.setVolume(0.7);
    activeScenario.warnings.forEach(w => {
      if (engine.shouldSpeak(w)) {
        voiceService.speak(w.voiceText, w.level === 4);
      }
    });
  }, [activeScenario.id, voiceMuted]);

  const riskColor = { LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560' };
  const riskBg = { LOW: 'rgba(0,214,143,0.1)', MEDIUM: 'rgba(255,179,0,0.1)', HIGH: 'rgba(255,140,0,0.1)', CRITICAL: 'rgba(255,69,96,0.15)' };

  const textBase = accessibility.textSize === 'x-large' ? 'text-lg' : accessibility.textSize === 'large' ? 'text-base' : 'text-sm';
  const textLg = accessibility.textSize === 'x-large' ? 'text-3xl' : accessibility.textSize === 'large' ? 'text-2xl' : 'text-xl';
  const textXl = accessibility.textSize === 'x-large' ? 'text-5xl' : accessibility.textSize === 'large' ? 'text-4xl' : 'text-3xl';

  return (
    <div className={`p-4 lg:p-6 space-y-4 ${accessibility.simplifiedMode ? 'simplified' : ''}`}>
      {/* Adaptation Banner */}
      {accessibility.conditions[0] !== 'none' && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: 'rgba(26,107,255,0.08)', border: '1px solid rgba(26,107,255,0.2)' }}>
          <Eye className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <p className="text-xs text-blue-300">
            <strong>Vision Adaptation Active</strong> — Interface adapted for:{' '}
            {accessibility.conditions.filter(c => c !== 'none').map(c => c.replace(/_/g, ' ')).join(', ')}
          </p>
        </div>
      )}

      {/* Active Warnings */}
      {adaptedWarnings.length > 0 && (
        <div className="space-y-2">
          {adaptedWarnings.map(w => (
            <div key={w.id}
              className={`rounded-xl p-4 border-l-4 ${w.emphasis === 'critical' ? 'warning-critical' : w.emphasis === 'high' ? 'warning-medium' : 'warning-low'}`}
              style={{
                borderLeftColor: riskColor[w.risk],
                background: riskBg[w.risk],
              }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className={`${accessibility.textSize === 'x-large' ? 'text-4xl' : 'text-2xl'} flex-shrink-0`}>{w.icon}</span>
                  <div>
                    <div className={`font-bold ${textLg} text-white`}>{w.title}</div>
                    <div className={`${textBase} text-slate-300 mt-0.5 whitespace-pre-line`}>{w.detail}</div>
                    {w.distance && (
                      <div className={`${textLg} font-bold mt-1`} style={{ color: riskColor[w.risk] }}>
                        {w.distance} m
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded font-bold text-xs whitespace-nowrap`}
                    style={{ background: riskColor[w.risk] + '30', color: riskColor[w.risk], border: `1px solid ${riskColor[w.risk]}60` }}>
                    {w.riskLabel}
                  </span>
                  {w.usePattern && (
                    <span className="px-2 py-1 rounded text-xs border border-slate-600 text-slate-400">
                      {w.level === 4 ? '████ CRITICAL' : w.level === 3 ? '███░ HIGH' : w.level === 2 ? '██░░ MED' : '█░░░ INFO'}
                    </span>
                  )}
                  {w.showVoiceIndicator && (
                    <span className="flex items-center gap-1 text-xs text-blue-400">
                      <Volume2 className="w-3 h-3" /> VOICE
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-bold`}
                    style={{ background: '#1e2d4a', color: '#94a3b8' }}>
                    {w.actionText}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vehicle Status */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-400" />
              <h3 className={`font-bold text-white ${textBase}`}>Vehicle Status</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">NOMINAL</span>
          </div>

          {/* Speedometer */}
          <div className="text-center py-2">
            <div className={`${textXl} font-bold text-white`}>{Math.round(speed)}</div>
            <div className="text-slate-400 text-sm">{driver?.units === 'mph' ? 'mph' : 'km/h'}</div>
            <div className={`mt-1 font-semibold text-sm`} style={{ color: speed > (activeScenario.environment.speedLimit ?? 50) ? '#ff4560' : '#00d68f' }}>
              Limit: {activeScenario.environment.speedLimit ?? environment.speedLimit} {driver?.units === 'mph' ? 'mph' : 'km/h'}
            </div>
          </div>

          <div className="space-y-2.5">
            <StatusRow icon={<Gauge className="w-4 h-4" />} label="Mode" value={vehicle.mode} color="#60a5fa" />
            <StatusRow icon={<Zap className="w-4 h-4" />} label="Gear" value={vehicle.gear} color="#34d399" />
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Battery className="w-4 h-4" />
                  <span>Battery</span>
                </div>
                <span className="text-green-400 text-xs font-bold">{vehicle.batteryLevel}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-drive-border">
                <div className="h-2 rounded-full transition-all"
                  style={{ width: `${vehicle.batteryLevel}%`, background: vehicle.batteryLevel > 40 ? '#00d68f' : '#ffb300' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Decision */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className={`font-bold text-white ${textBase}`}>Current Decision</h3>
          </div>

          <div className="text-center py-4 rounded-xl"
            style={{ background: `${riskBg[activeScenario.decision.riskLevel]}`, border: `1px solid ${riskColor[activeScenario.decision.riskLevel]}40` }}>
            <div className={`font-black text-white ${accessibility.textSize === 'x-large' ? 'text-3xl' : 'text-2xl'} leading-tight`}>
              {activeScenario.decision.action}
            </div>
            <div className="text-slate-400 text-sm mt-2">{activeScenario.decision.reason}</div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#0f1628', border: '1px solid #1e2d4a' }}>
            <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Next Action</div>
              <div className="text-white text-sm font-medium">{activeScenario.decision.nextAction}</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#0f1628', border: '1px solid #1e2d4a' }}>
            <div>
              <div className="text-xs text-slate-400">Risk Level</div>
              <div className="font-bold text-sm" style={{ color: riskColor[activeScenario.decision.riskLevel] }}>
                {activeScenario.decision.riskLevel}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Objects</div>
              <div className="text-white font-bold text-sm">{activeScenario.objects.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Warnings</div>
              <div className="text-white font-bold text-sm">{activeScenario.warnings.length}</div>
            </div>
          </div>
        </div>

        {/* Environment */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-400" />
            <h3 className={`font-bold text-white ${textBase}`}>Environment</h3>
          </div>

          <div className="space-y-2.5">
            <StatusRow icon={<MapPin className="w-4 h-4" />} label="Road Type" value={activeScenario.environment.roadType ?? environment.roadType} color="#94a3b8" />
            <StatusRow icon={<CloudRain className="w-4 h-4" />} label="Weather" value={activeScenario.environment.weather ?? environment.weather} color="#60a5fa" />
            <StatusRow icon={<Eye className="w-4 h-4" />} label="Visibility" value={activeScenario.environment.visibility ?? environment.visibility}
              color={(activeScenario.environment.visibility ?? environment.visibility) === 'Poor' ? '#ff8c00' : '#00d68f'} />
            <StatusRow icon={<Car className="w-4 h-4" />} label="Traffic" value={activeScenario.environment.trafficDensity ?? environment.trafficDensity}
              color={(activeScenario.environment.trafficDensity ?? environment.trafficDensity) === 'Heavy' ? '#ffb300' : '#94a3b8'} />
            <StatusRow icon={<Activity className="w-4 h-4" />} label="Lane" value={activeScenario.environment.laneCondition ?? environment.laneCondition} color="#94a3b8" />
            <StatusRow icon={<Clock className="w-4 h-4" />} label="Time" value={(activeScenario.environment as { timeOfDay?: string }).timeOfDay ?? environment.timeOfDay} color="#94a3b8" />
          </div>
        </div>
      </div>

      {/* Objects Detected */}
      {activeScenario.objects.length > 0 && (
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className={`font-bold text-white ${textBase}`}>Detected Objects</h3>
            </div>
            <span className="text-xs text-slate-400 secondary-info">SIMULATED PERCEPTION</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {activeScenario.objects.map(obj => (
              <div key={obj.id} className="p-3 rounded-xl border"
                style={{ borderColor: riskColor[obj.risk] + '60', background: riskBg[obj.risk] }}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-white ${accessibility.textSize !== 'normal' ? 'text-base' : 'text-sm'}`}>{obj.label}</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: riskColor[obj.risk], background: riskColor[obj.risk] + '20' }}>{obj.risk}</span>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between"><span>Distance</span><span className="text-white font-medium">{obj.distance} m</span></div>
                  <div className="flex justify-between"><span>Rel. Speed</span>
                    <span className={`font-medium ${obj.relativeSpeed < 0 ? 'text-orange-400' : 'text-green-400'}`}>
                      {obj.relativeSpeed < 0 ? '▼' : '▲'} {Math.abs(obj.relativeSpeed)} km/h
                    </span>
                  </div>
                  <div className="flex justify-between"><span>Confidence</span><span className="text-blue-400 font-medium">{obj.confidence}%</span></div>
                </div>
                {accessibility.colorIndependentWarnings && (
                  <div className="mt-2 text-xs font-bold text-center py-1 rounded"
                    style={{ background: riskColor[obj.risk] + '20', color: riskColor[obj.risk] }}>
                    [{obj.risk} RISK]
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety & System Status */}
      {!accessibility.simplifiedMode && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Perception', status: 'ACTIVE', ok: true },
            { label: 'Path Planning', status: 'ACTIVE', ok: true },
            { label: 'Decision Engine', status: 'ACTIVE', ok: true },
            { label: 'Vision Adaptation', status: 'ACTIVE', ok: true },
          ].map(s => (
            <div key={s.label} className="glass-panel p-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-white text-xs font-medium truncate">{s.label}</div>
                <div className="text-green-400 text-xs font-bold">{s.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attention Support */}
      <div className="flex items-center justify-between p-3 rounded-xl secondary-info"
        style={{ background: 'rgba(26,107,255,0.05)', border: '1px solid #1e2d4a' }}>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-slate-300">Driver Attention Support</span>
        </div>
        <span className="text-green-400 text-xs font-bold">ATTENTION NORMAL</span>
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span style={{ color }}>{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}
