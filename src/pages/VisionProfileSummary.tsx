import React, { useState } from 'react';
import { Check, Car, ChevronRight, ChevronLeft, Eye, Volume2, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VisionAdaptationEngine } from '../modules/visionAdaptation/VisionAdaptationEngine';
import type { AccessibilityProfile } from '../types';

const CONDITION_LABELS: Record<string, string> = {
  none: 'Standard Vision',
  color_general: 'Color Differentiation Support',
  red_green: 'Red-Green Accessibility',
  blue_yellow: 'Blue-Yellow Accessibility',
  small_text: 'Small Text Difficulty',
  low_vision: 'Low Vision Support',
  low_contrast: 'Contrast Enhancement',
  glare: 'Glare Reduction',
  night: 'Night Visibility Enhancement',
  slow_recognition: 'Extended Warning Display',
  voice_prefer: 'Voice Assistance',
  simplified: 'Simplified Interface',
  other: 'Custom Accessibility',
};

export default function VisionProfileSummary() {
  const { setPage, accessibility, setAccessibility, setProfileComplete, driver } = useApp();
  const [localProfile, setLocalProfile] = useState<AccessibilityProfile>({ ...accessibility });

  const engine = new VisionAdaptationEngine(localProfile);
  const adaptations = engine.getAdaptationSummary();

  const setLocal = (k: keyof AccessibilityProfile, v: unknown) =>
    setLocalProfile(prev => ({ ...prev, [k]: v }));

  const handleApply = () => {
    setAccessibility(localProfile);
    setProfileComplete(true);
    setPage('dashboard');
  };

  const activeConditions = localProfile.conditions.filter(c => c !== 'none');

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'linear-gradient(135deg, #04070f 0%, #0a0e1a 100%)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a6bff, #00c2ff)' }}>
              <Car className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">DriveIQ</div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['Driver Profile', 'Vision Assessment', 'Your Profile', 'Dashboard'].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= 2 ? 'bg-blue-500 text-white' : 'bg-drive-border text-slate-500'}`}>{i + 1}</div>
                <span className={`text-xs mt-1 hidden sm:block ${i <= 2 ? 'text-blue-400' : 'text-slate-600'}`}>{s}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 ${i < 2 ? 'bg-blue-500' : 'bg-drive-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl p-8 space-y-6" style={{ background: 'rgba(15, 22, 40, 0.95)', border: '1px solid #1e2d4a' }}>
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Your DriveIQ Accessibility Profile</h2>
              {driver && <p className="text-slate-400 text-sm">Personalized for {driver.name}</p>}
            </div>
          </div>

          {/* Selected conditions */}
          {activeConditions.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-3">Selected Requirements</p>
              <div className="flex flex-wrap gap-2">
                {activeConditions.map(c => (
                  <span key={c} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: 'rgba(26,107,255,0.15)', border: '1px solid rgba(26,107,255,0.3)', color: '#60a5fa' }}>
                    <Check className="w-3 h-3" />
                    {CONDITION_LABELS[c] ?? c}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(0,214,143,0.08)', border: '1px solid rgba(0,214,143,0.2)' }}>
              <p className="text-green-400 font-medium">✓ Standard Vision Profile</p>
              <p className="text-slate-400 text-sm">No accessibility adaptations required.</p>
            </div>
          )}

          {/* Recommended adaptations */}
          <div>
            <p className="text-sm font-semibold text-slate-300 mb-3">Recommended Interface Adaptations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {adaptations.map(a => (
                <div key={a.label} className={`flex items-center justify-between p-3 rounded-xl border ${a.active ? 'border-green-500/30 bg-green-500/5' : 'border-drive-border bg-drive-panel/50 opacity-50'}`}>
                  <div>
                    <div className="text-sm font-medium text-white">{a.label}</div>
                    <div className="text-xs text-slate-500">{a.description}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${a.active ? 'bg-green-500/20 text-green-400' : 'bg-drive-border text-slate-500'}`}>
                    {a.active ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Manual adjustments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-semibold text-slate-300">Manual Adjustments</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Text Size */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Text Size</label>
                <select value={localProfile.textSize}
                  onChange={e => setLocal('textSize', e.target.value)}
                  className="drive-input text-sm py-2">
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="x-large">Extra Large</option>
                </select>
              </div>
              {/* Contrast */}
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Contrast Mode</label>
                <select value={localProfile.contrastMode}
                  onChange={e => setLocal('contrastMode', e.target.value)}
                  className="drive-input text-sm py-2">
                  <option value="normal">Normal</option>
                  <option value="high">High Contrast</option>
                  <option value="max">Maximum Contrast</option>
                </select>
              </div>
              {/* Toggles */}
              {([
                ['voiceEnabled', 'Voice Safety Alerts'],
                ['colorIndependentWarnings', 'Color-Independent Warnings'],
                ['simplifiedMode', 'Simplified Dashboard'],
                ['enhancedLabels', 'Enhanced Object Labels'],
                ['glareMode', 'Glare Reduction'],
                ['nightMode', 'Night Visibility Mode'],
              ] as [keyof AccessibilityProfile, string][]).map(([k, label]) => (
                <label key={k} className="flex items-center justify-between p-3 rounded-xl border border-drive-border cursor-pointer hover:border-blue-500/40 transition-all">
                  <span className="text-sm text-slate-300">{label}</span>
                  <div onClick={() => setLocal(k, !(localProfile[k] as boolean))}
                    className={`w-11 h-6 rounded-full transition-all duration-300 relative ${localProfile[k] ? 'bg-blue-600' : 'bg-drive-border'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${localProfile[k] ? 'left-6' : 'left-1'}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Voice Speed */}
          {localProfile.voiceEnabled && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Volume2 className="inline w-4 h-4 mr-1" />
                Voice Speed: {localProfile.voiceSpeed === 0.8 ? 'Slow' : localProfile.voiceSpeed === 1.0 ? 'Normal' : 'Fast'}
              </label>
              <input type="range" min={0.5} max={1.5} step={0.1} value={localProfile.voiceSpeed}
                onChange={e => setLocal('voiceSpeed', parseFloat(e.target.value))}
                className="w-full accent-blue-500" />
            </div>
          )}

          {/* Alert Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Critical Warning Priority</label>
            <div className="flex gap-2">
              {(['normal', 'high', 'critical-only'] as const).map(v => (
                <button key={v} onClick={() => setLocal('alertPriority', v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${localProfile.alertPriority === v ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400 hover:border-blue-500/40'}`}>
                  {v === 'normal' ? 'Normal' : v === 'high' ? 'HIGH' : 'CRITICAL ONLY'}
                </button>
              ))}
            </div>
          </div>

          {/* Mode label */}
          <div className="p-4 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg, rgba(26,107,255,0.15), rgba(0,194,255,0.08))', border: '1px solid rgba(26,107,255,0.3)' }}>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Active Vision Mode</p>
            <p className="text-2xl font-bold text-blue-400">
              {localProfile.visionMode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </p>
            <p className="text-xs text-slate-500 mt-1">Vision Adaptation Engine will use this profile</p>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <button onClick={() => setPage('vision-assessment')}
              className="flex-1 py-3 rounded-xl font-medium text-slate-400 border border-drive-border hover:border-blue-500/50 flex items-center justify-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={handleApply}
              className="flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 text-base transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #1a6bff, #0f4fd1)' }}>
              Apply My Accessibility Profile
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
