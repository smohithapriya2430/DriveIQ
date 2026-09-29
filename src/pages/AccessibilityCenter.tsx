import React from 'react';
import { Eye, Type, Sun, Volume2, Bell, Layout, Moon, Zap, Globe, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VisionAdaptationEngine } from '../modules/visionAdaptation/VisionAdaptationEngine';
import type { AccessibilityProfile } from '../types';

export default function AccessibilityCenter() {
  const { accessibility, setAccessibility, driver } = useApp();
  const engine = new VisionAdaptationEngine(accessibility);
  const adaptations = engine.getAdaptationSummary();

  const set = (k: keyof AccessibilityProfile, v: unknown) =>
    setAccessibility({ ...accessibility, [k]: v });

  const Toggle = ({ label, icon, field, desc }: { label: string; icon: React.ReactNode; field: keyof AccessibilityProfile; desc?: string }) => (
    <div className="flex items-center justify-between p-4 rounded-xl border border-drive-border hover:border-blue-500/30 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(26,107,255,0.1)' }}>
          <span className="text-blue-400">{icon}</span>
        </div>
        <div>
          <div className="text-white text-sm font-semibold">{label}</div>
          {desc && <div className="text-slate-500 text-xs">{desc}</div>}
        </div>
      </div>
      <div onClick={() => set(field, !(accessibility[field] as boolean))}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${accessibility[field] ? 'bg-blue-600' : 'bg-drive-border'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${accessibility[field] ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );

  const visionModeLabel = accessibility.visionMode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const activeCount = adaptations.filter(a => a.active).length;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Accessibility Center</h2>
        </div>
        <span className="px-3 py-1.5 rounded-lg text-sm font-bold"
          style={{ background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.3)', color: '#00d68f' }}>
          {activeCount} ADAPTATIONS ACTIVE
        </span>
      </div>

      {/* Current profile */}
      <div className="glass-panel p-5 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(26,107,255,0.08), rgba(0,194,255,0.04))' }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Current Driver Profile</div>
            <div className="text-xl font-bold text-white">{driver?.name ?? 'Driver'}</div>
            <div className="text-blue-400 font-semibold">{visionModeLabel}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1">Adaptation Status</div>
            <div className="text-green-400 font-bold text-sm flex items-center gap-1.5 justify-end">
              <Check className="w-4 h-4" />ACTIVE
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {accessibility.conditions.filter(c => c !== 'none').map(c => (
            <span key={c} className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(26,107,255,0.15)', border: '1px solid rgba(26,107,255,0.3)', color: '#93bbfc' }}>
              {c.replace(/_/g, ' ')}
            </span>
          ))}
          {accessibility.conditions[0] === 'none' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium text-green-400"
              style={{ background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.2)' }}>
              Standard Vision
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Visual */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Type className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Visual Settings</h3>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Text Size</label>
            <div className="flex gap-2">
              {(['normal', 'large', 'x-large'] as const).map(v => (
                <button key={v} onClick={() => set('textSize', v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${accessibility.textSize === v ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400 hover:border-blue-500/40'}`}>
                  {v === 'normal' ? 'Normal' : v === 'large' ? 'Large' : 'X-Large'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Contrast Mode</label>
            <div className="flex gap-2">
              {(['normal', 'high', 'max'] as const).map(v => (
                <button key={v} onClick={() => set('contrastMode', v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${accessibility.contrastMode === v ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400 hover:border-blue-500/40'}`}>
                  {v === 'normal' ? 'Normal' : v === 'high' ? 'High' : 'Max'}
                </button>
              ))}
            </div>
          </div>

          <Toggle label="Color-Independent Warnings" icon={<Eye className="w-4 h-4" />} field="colorIndependentWarnings"
            desc="Icons + text + patterns replace color-only signals" />
          <Toggle label="Enhanced Object Labels" icon={<Type className="w-4 h-4" />} field="enhancedLabels"
            desc="Larger, more prominent detection labels" />
          <Toggle label="Glare Reduction Mode" icon={<Sun className="w-4 h-4" />} field="glareMode"
            desc="Dimmed interface for bright light sensitivity" />
          <Toggle label="Night Visibility Mode" icon={<Moon className="w-4 h-4" />} field="nightMode"
            desc="Optimized for low-light conditions" />
        </div>

        {/* Alerts & Voice */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Alerts & Voice</h3>
          </div>

          <Toggle label="Voice Safety Alerts" icon={<Volume2 className="w-4 h-4" />} field="voiceEnabled"
            desc="Spoken warnings via browser speech synthesis" />
          <Toggle label="Simplified Dashboard" icon={<Layout className="w-4 h-4" />} field="simplifiedMode"
            desc="Non-critical information is minimized" />

          {accessibility.voiceEnabled && (
            <>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Voice Speed: {accessibility.voiceSpeed < 0.9 ? 'Slow' : accessibility.voiceSpeed > 1.1 ? 'Fast' : 'Normal'}
                </label>
                <input type="range" min={0.5} max={1.5} step={0.1} value={accessibility.voiceSpeed}
                  onChange={e => set('voiceSpeed', parseFloat(e.target.value))}
                  className="w-full accent-blue-500" />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Alert Priority</label>
            <div className="flex gap-2">
              {(['normal', 'high', 'critical-only'] as const).map(v => (
                <button key={v} onClick={() => set('alertPriority', v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${accessibility.alertPriority === v ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400 hover:border-blue-500/40'}`}>
                  {v === 'normal' ? 'Normal' : v === 'high' ? 'High' : 'Critical'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Language</label>
            <select value={driver?.language ?? 'English'}
              onChange={() => { }}
              className="drive-input text-sm py-2">
              {['English', 'Spanish', 'French', 'German', 'Portuguese'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Adaptation summary */}
      <div className="glass-panel p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">All Adaptations</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {adaptations.map(a => (
            <div key={a.label} className={`flex items-center justify-between p-3 rounded-xl border ${a.active ? 'border-green-500/30 bg-green-500/5' : 'border-drive-border opacity-50'}`}>
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

      <p className="text-xs text-slate-600 text-center">
        🔒 Accessibility preferences are stored locally in this prototype. No medical data is collected.
      </p>
    </div>
  );
}
