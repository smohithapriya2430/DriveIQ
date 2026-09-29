import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, ChevronLeft, Play, RotateCcw, Eye, Volume2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildProfileFromConditions } from '../modules/visionAdaptation/VisionAdaptationEngine';
import { voiceService } from '../modules/voice/VoiceService';
import { scenarios } from '../data/mockData';

const STEPS = [
  {
    id: 1, title: 'Normal Vision', subtitle: 'Standard interface — no accessibility adaptations',
    desc: 'The standard DriveIQ interface with default settings. Information is presented in the conventional way.',
    mode: 'standard', condition: null,
  },
  {
    id: 2, title: 'Color Accessibility Selected', subtitle: 'Driver selects red-green color differentiation difficulty',
    desc: 'The driver indicates they have difficulty distinguishing red and green. Watch how the interface transforms.',
    mode: 'color', condition: 'red_green',
  },
  {
    id: 3, title: 'Color-Independent Warning', subtitle: 'Warning converted to icon + text + shape',
    desc: 'Instead of relying on red color, DriveIQ now shows ⚠ icons, text labels, and pattern bars to communicate risk.',
    mode: 'color_warn', condition: 'red_green',
  },
  {
    id: 4, title: 'Low Vision Mode', subtitle: 'Driver switches to low vision profile',
    desc: 'Dashboard automatically enlarges critical information — larger text, higher contrast, simplified layout.',
    mode: 'low_vision', condition: 'low_vision',
  },
  {
    id: 5, title: 'Voice Assistance Enabled', subtitle: 'Driver adds voice assistance to their profile',
    desc: 'Important warnings are now spoken aloud. Critical information is communicated through multiple channels.',
    mode: 'voice', condition: 'voice_prefer',
  },
  {
    id: 6, title: 'Pedestrian Scenario', subtitle: 'Pedestrian crossing simulation begins',
    desc: 'A pedestrian is detected crossing the road. Watch how the adapted system communicates this to the driver.',
    mode: 'pedestrian', condition: null,
  },
  {
    id: 7, title: 'Voice Alert Activates', subtitle: 'Spoken safety warning triggered',
    desc: '"Warning. Pedestrian crossing detected. Distance eighteen meters. Vehicle stopping."',
    mode: 'voice_alert', condition: null,
  },
  {
    id: 8, title: 'Critical Obstacle', subtitle: 'Emergency scenario — road fully blocked',
    desc: 'High-priority warning activates. Multiple channels — visual, voice, haptic indicator — all fire simultaneously.',
    mode: 'critical', condition: null,
  },
  {
    id: 9, title: 'Before vs After', subtitle: 'Comparison of standard vs adapted interface',
    desc: 'Side-by-side: the same warning communicated in the standard way vs the DriveIQ adapted way.',
    mode: 'comparison', condition: null,
  },
  {
    id: 10, title: 'One System. Every Vision.', subtitle: '"Personalized for every driver."',
    desc: '"One intelligent driving system. Personalized for every vision." — The same autonomous driving system, adapted to communicate differently for each driver.',
    mode: 'finale', condition: null,
  },
];

export default function DemoMode() {
  const { setActiveScenario, setAccessibility, accessibility } = useApp();
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const currentStep = STEPS[step];

  // Apply scenario and profile based on demo step
  useEffect(() => {
    const s = STEPS[step];
    if (s.mode === 'pedestrian' || s.mode === 'voice_alert' || s.mode === 'voice') {
      setActiveScenario(scenarios.find(sc => sc.id === 'pedestrian') ?? scenarios[0]);
    } else if (s.mode === 'critical') {
      setActiveScenario(scenarios.find(sc => sc.id === 'road_blockage') ?? scenarios[0]);
    } else if (s.mode === 'vehicle_ahead') {
      setActiveScenario(scenarios.find(sc => sc.id === 'vehicle_ahead') ?? scenarios[0]);
    } else {
      setActiveScenario(scenarios[0]);
    }

    if (s.mode === 'low_vision') {
      setAccessibility(buildProfileFromConditions(['low_vision'], { textSizeDifficulty: 'Often', voicePreference: 'For important warnings' }));
    } else if (s.mode === 'color' || s.mode === 'color_warn') {
      setAccessibility(buildProfileFromConditions(['red_green'], { colorDifficulty: ['Red', 'Green'] }));
    } else if (s.mode === 'voice' || s.mode === 'voice_alert') {
      setAccessibility(buildProfileFromConditions(['red_green', 'low_vision', 'voice_prefer'], { voicePreference: 'Always' }));
    } else if (s.mode === 'critical') {
      setAccessibility(buildProfileFromConditions(['red_green', 'low_vision', 'voice_prefer'], { voicePreference: 'Always' }));
    } else if (s.mode === 'standard') {
      setAccessibility(buildProfileFromConditions(['none'], {}));
    }

    // Auto-speak for voice steps
    if (s.mode === 'voice_alert') {
      setTimeout(() => {
        voiceService.setEnabled(true);
        voiceService.setRate(0.9);
        voiceService.speak('Warning. Pedestrian crossing detected. Distance eighteen meters. Vehicle stopping.', true);
      }, 600);
    }
    if (s.mode === 'critical') {
      setTimeout(() => {
        voiceService.setEnabled(true);
        voiceService.speak('Critical alert. Road blocked ahead. Emergency stop activated.', true);
      }, 400);
    }
  }, [step]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    if (step >= STEPS.length - 1) { setAutoPlay(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 4500);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  const prev = () => setStep(s => Math.max(0, s - 1));
  const next = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const reset = () => { setStep(0); setAutoPlay(false); };

  const riskColor = '#ff4560';

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Accessibility Demo</h2>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">DEMO MODE</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="p-2 rounded-lg text-slate-400 hover:text-white border border-drive-border">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => setAutoPlay(a => !a)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${autoPlay ? 'border-amber-500/40 text-amber-400' : 'border-blue-500/40 text-blue-400'}`}>
            <Play className="w-4 h-4" />
            {autoPlay ? 'Auto-Playing...' : 'Auto-Play'}
          </button>
        </div>
      </div>

      {/* Step progress */}
      <div className="flex gap-1.5 flex-wrap">
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setStep(i)}
            className={`w-8 h-2 rounded-full transition-all ${i === step ? 'bg-blue-500' : i < step ? 'bg-blue-800' : 'bg-drive-border'}`} />
        ))}
      </div>

      {/* Main step card */}
      <div className="glass-panel rounded-2xl overflow-hidden" style={{ border: '1px solid #1e2d4a' }}>
        <div className="px-5 py-3 border-b border-drive-border flex items-center justify-between"
          style={{ background: 'rgba(26,107,255,0.06)' }}>
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">
            STEP {currentStep.id} OF {STEPS.length}
          </span>
          <span className="text-slate-500 text-xs">{currentStep.mode}</span>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">{currentStep.title}</h3>
            <p className="text-blue-400 font-semibold">{currentStep.subtitle}</p>
            <p className="text-slate-400 mt-2">{currentStep.desc}</p>
          </div>

          {/* Step-specific visual */}
          <StepVisual step={currentStep.mode} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={prev} disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-400 border border-drive-border disabled:opacity-30 hover:border-blue-500/40 transition-all">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <span className="text-slate-500 text-sm">{step + 1} / {STEPS.length}</span>
        <button onClick={next} disabled={step === STEPS.length - 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white disabled:opacity-30 transition-all"
          style={{ background: step < STEPS.length - 1 ? 'linear-gradient(135deg, #1a6bff, #0f4fd1)' : '#1e2d4a' }}>
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StepVisual({ step }: { step: string }) {
  switch (step) {
    case 'standard':
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-drive-border" style={{ background: '#0f1628' }}>
            <div className="text-xs text-slate-500 mb-2">Standard Warning</div>
            <div className="p-3 rounded-lg border-2 border-red-500 bg-red-900/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-red-400 font-bold text-sm">WARNING</span>
              </div>
              <div className="text-slate-300 text-xs mt-1">Vehicle ahead — 14m</div>
            </div>
            <div className="text-xs text-slate-600 mt-2 italic">Color alone = danger signal</div>
          </div>
          <div className="p-3 rounded-xl border border-drive-border" style={{ background: '#0f1628' }}>
            <div className="text-xs text-slate-500 mb-2">Standard Dashboard</div>
            <div className="space-y-1.5">
              {['Speed: 52 km/h', 'Road: Urban', 'Weather: Clear'].map(t => (
                <div key={t} className="text-xs text-slate-400 px-2 py-1 rounded bg-drive-border">{t}</div>
              ))}
            </div>
            <div className="text-xs text-slate-600 mt-2 italic">Normal font, standard layout</div>
          </div>
        </div>
      );

    case 'color':
    case 'color_warn':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,69,96,0.08)', border: '2px solid rgba(255,69,96,0.4)' }}>
              <div className="text-xs text-slate-400 mb-2">❌ Color-only (inaccessible)</div>
              <div className="p-3 rounded-lg border-2 border-red-500 bg-red-900/20">
                <div className="w-4 h-4 rounded-full bg-red-500 mx-auto" />
                <div className="text-xs text-center text-red-400 mt-1">DANGER</div>
              </div>
              <div className="text-xs text-slate-500 mt-2">If red/green look the same, this is invisible</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(26,107,255,0.08)', border: '2px solid rgba(26,107,255,0.4)' }}>
              <div className="text-xs text-slate-400 mb-2">✓ DriveIQ adapted</div>
              <div className="p-3 rounded-xl border border-orange-500/50 bg-orange-500/10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠</span>
                  <div>
                    <div className="font-bold text-white text-sm">VEHICLE AHEAD</div>
                    <div className="text-orange-300 text-xs">HIGH RISK · 14 m</div>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded text-xs font-mono border border-orange-500/30 text-orange-300">███░ HIGH</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-drive-border text-slate-300">SLOW DOWN</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">Works with or without color vision</div>
            </div>
          </div>
        </div>
      );

    case 'low_vision':
      return (
        <div className="p-5 rounded-xl text-center" style={{ background: '#000', border: '3px solid #ff4560' }}>
          <div className="text-5xl mb-3">⚠</div>
          <div className="text-4xl font-black text-white mb-2">VEHICLE AHEAD</div>
          <div className="text-5xl font-black text-red-400 mb-3">14 METERS</div>
          <div className="text-3xl font-bold text-white bg-red-500/20 rounded-xl py-2">SLOW DOWN</div>
          <div className="text-xs text-slate-500 mt-3">Large text · Max contrast · Extra-large numbers</div>
        </div>
      );

    case 'voice':
    case 'voice_alert':
      return (
        <div className="p-5 rounded-xl" style={{ background: 'rgba(26,107,255,0.08)', border: '2px solid rgba(26,107,255,0.4)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white">Voice Co-Pilot Speaking</div>
              <div className="text-blue-400 text-sm">Priority alert activated</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-600/30">
            <p className="text-white text-base italic font-medium leading-relaxed">
              "Warning. Pedestrian crossing detected. Distance eighteen meters. Vehicle stopping."
            </p>
          </div>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 rounded-full bg-blue-500"
                style={{ height: `${10 + Math.random() * 20}px`, opacity: 0.6 + Math.random() * 0.4 }} />
            ))}
          </div>
        </div>
      );

    case 'pedestrian':
      return (
        <div className="space-y-3">
          <div className="p-4 rounded-xl border-l-4 border-orange-500 bg-orange-500/10">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🚶</span>
              <div>
                <div className="text-xl font-black text-white">PEDESTRIAN CROSSING</div>
                <div className="text-slate-300 text-sm">Distance: 18 m — Vehicle stopping</div>
                <div className="text-2xl font-black text-orange-400 mt-1">18 m</div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-orange-500/20 text-orange-400">[HIGH RISK]</span>
                  <span className="px-2 py-1 rounded text-xs font-mono border border-orange-500/30 text-orange-300">███░ HIGH</span>
                  <span className="px-2 py-1 rounded text-xs text-blue-400 border border-blue-500/30">🔊 VOICE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'critical':
      return (
        <div className="p-5 rounded-xl warning-critical text-center">
          <div className="text-6xl mb-3">⛔</div>
          <div className="text-3xl font-black text-white mb-2">ROAD BLOCKED</div>
          <div className="text-5xl font-black text-red-400 mb-3">EMERGENCY STOP</div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="p-2 rounded border border-red-500/40 bg-red-500/10">
              <div className="text-xs text-red-300">VISUAL</div>
              <div className="text-red-400 font-bold">⚡ ACTIVE</div>
            </div>
            <div className="p-2 rounded border border-blue-500/40 bg-blue-500/10">
              <div className="text-xs text-blue-300">VOICE</div>
              <div className="text-blue-400 font-bold">🔊 ACTIVE</div>
            </div>
            <div className="p-2 rounded border border-amber-500/40 bg-amber-500/10">
              <div className="text-xs text-amber-300">HAPTIC</div>
              <div className="text-amber-400 font-bold">📳 SIM</div>
            </div>
          </div>
        </div>
      );

    case 'comparison':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: '#0a0e1a', border: '2px solid #1e2d4a' }}>
            <div className="text-xs text-slate-400 mb-3 font-bold">BEFORE – Standard</div>
            <div className="p-3 rounded-lg border-2 border-red-500 bg-red-900/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-red-400 font-bold text-sm">WARNING</span>
              </div>
              <div className="text-slate-300 text-xs">Vehicle ahead · 14m</div>
            </div>
            <div className="text-xs text-slate-600 mt-2 italic">Color = risk signal · No voice · Small text</div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: '#000', border: '2px solid #1a6bff' }}>
            <div className="text-xs text-blue-400 mb-3 font-bold">AFTER – DriveIQ Adapted</div>
            <div className="p-3 rounded-xl border border-orange-500/60 bg-orange-500/10">
              <div className="flex items-center gap-2">
                <span className="text-3xl">⚠</span>
                <div>
                  <div className="text-lg font-black text-white">VEHICLE AHEAD</div>
                  <div className="text-2xl font-black text-orange-400">14 METERS</div>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="px-2 py-1 rounded text-xs font-bold text-orange-400 bg-orange-500/20">[HIGH]</span>
                <span className="px-2 py-1 rounded text-xs font-mono text-orange-300 border border-orange-500/30">███░</span>
                <span className="px-2 py-1 rounded text-xs text-blue-400">🔊</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-2 italic">Icon + text + pattern + voice</div>
          </div>
        </div>
      );

    case 'finale':
      return (
        <div className="text-center py-6 space-y-4">
          <div className="text-6xl">🚗</div>
          <div className="text-3xl font-black text-white leading-tight">
            One Intelligent Driving System.
          </div>
          <div className="text-2xl font-bold" style={{ background: 'linear-gradient(90deg, #1a6bff, #00c2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Personalized for Every Vision.
          </div>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Every driver perceives information differently. DriveIQ understands each driver's declared accessibility needs and adapts how autonomous-driving information is communicated — so the same system works for everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {['Color-independent', 'Large text', 'Voice alerts', 'High contrast', 'Simplified', 'Combined modes'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: 'rgba(26,107,255,0.15)', border: '1px solid rgba(26,107,255,0.3)', color: '#93bbfc' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}
