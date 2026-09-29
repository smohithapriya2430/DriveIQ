import React, { useState } from 'react';
import { GitCompare, Eye, AlertTriangle, Volume2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { VisionMode } from '../types';

const MODES: { id: VisionMode; label: string; desc: string }[] = [
  { id: 'standard', label: 'Standard Vision', desc: 'Default interface — no accessibility adaptations' },
  { id: 'color_accessible', label: 'Color Accessibility', desc: 'Color-independent warnings with icons and text' },
  { id: 'red_green', label: 'Red-Green Simulation', desc: 'Interface for red-green color differentiation difficulty' },
  { id: 'blue_yellow', label: 'Blue-Yellow Simulation', desc: 'Interface for blue-yellow color differentiation difficulty' },
  { id: 'low_vision', label: 'Low Vision Mode', desc: 'Large text, high contrast, enhanced labels' },
  { id: 'high_contrast', label: 'High Contrast Mode', desc: 'Maximum contrast for reduced contrast sensitivity' },
  { id: 'glare_reduction', label: 'Glare Reduction', desc: 'Dimmed interface for glare sensitivity' },
  { id: 'night_visibility', label: 'Night Visibility', desc: 'Optimized for low-light night driving' },
  { id: 'voice_first', label: 'Voice-First Mode', desc: 'Voice alerts take priority, simplified visuals' },
  { id: 'simplified', label: 'Simplified Dashboard', desc: 'Reduced visual elements for focus' },
];

export default function VisionTwin() {
  const { activeScenario } = useApp();
  const [selectedMode, setSelectedMode] = useState<VisionMode>('color_accessible');

  const scenario = activeScenario;
  const mainWarning = scenario.warnings[0];
  const mainObject = scenario.objects[0];

  // Standard presentation
  const StandardWarning = () => (
    <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,69,96,0.1)', border: '2px solid #ff4560' }}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="text-red-400 font-bold text-sm">
          {mainWarning?.title ?? 'WARNING'}
        </span>
      </div>
      <p className="text-slate-400 text-xs">{mainWarning?.detail ?? 'Standard alert detail'}</p>
      {mainWarning?.distance && <p className="text-red-400 text-xl font-bold">{mainWarning.distance}m</p>}
    </div>
  );

  // Adapted presentation based on mode
  const AdaptedWarning = () => {
    const risk = mainWarning?.risk ?? 'HIGH';
    const riskColor = { LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560' }[risk];
    const patternMap = { CRITICAL: '████', HIGH: '███░', MEDIUM: '██░░', LOW: '█░░░' };

    switch (selectedMode) {
      case 'low_vision':
        return (
          <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(0,0,0,0.6)', border: `3px solid ${riskColor}` }}>
            <div className="text-4xl">⚠</div>
            <div className="text-3xl font-black text-white">{mainWarning?.title}</div>
            {mainWarning?.distance && <div className="text-4xl font-black" style={{ color: riskColor }}>{mainWarning.distance} METERS</div>}
            <div className="text-2xl font-bold text-white">SLOW DOWN</div>
            <div className="text-xl font-bold px-3 py-1 rounded" style={{ background: riskColor + '30', color: riskColor }}>
              {risk} RISK
            </div>
          </div>
        );
      case 'color_accessible':
      case 'red_green':
      case 'blue_yellow':
        return (
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,140,0,0.1)', border: `2px solid ${riskColor}` }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠</span>
              <span className="font-bold text-white text-base">{mainWarning?.title}</span>
            </div>
            <p className="text-slate-300 text-sm">{mainWarning?.detail}</p>
            {mainWarning?.distance && <p className="text-xl font-bold" style={{ color: riskColor }}>{mainWarning.distance} m</p>}
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 rounded text-xs font-bold border" style={{ borderColor: riskColor, color: riskColor }}>
                [{risk} RISK]
              </span>
              <span className="px-2 py-1 rounded text-xs font-mono border border-slate-600 text-slate-400">
                {patternMap[risk as keyof typeof patternMap]}
              </span>
              <span className="px-2 py-1 rounded text-xs font-bold bg-slate-700 text-slate-300">
                SLOW DOWN
              </span>
            </div>
          </div>
        );
      case 'voice_first':
        return (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(26,107,255,0.08)', border: '2px solid #1a6bff' }}>
            <div className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-bold text-sm">VOICE ALERT ACTIVE</span>
            </div>
            <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-600/30">
              <p className="text-white text-sm italic">"{mainWarning?.voiceText}"</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠</span>
              <span className="font-bold text-white">{mainWarning?.title}</span>
            </div>
          </div>
        );
      case 'high_contrast':
        return (
          <div className="rounded-xl p-4 space-y-2" style={{ background: '#000', border: `3px solid #fff` }}>
            <div className="text-2xl">⚠</div>
            <div className="text-xl font-black text-white">{mainWarning?.title}</div>
            {mainWarning?.distance && <div className="text-2xl font-black text-white">{mainWarning.distance} m</div>}
            <div className="text-sm font-bold px-2 py-1 rounded" style={{ background: '#fff', color: '#000' }}>
              {risk} — REDUCE SPEED
            </div>
          </div>
        );
      case 'simplified':
        return (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,69,96,0.05)', border: '2px solid rgba(255,69,96,0.5)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠</span>
              <div>
                <div className="text-lg font-black text-white">{mainWarning?.title ?? 'ALERT'}</div>
                <div className="font-bold" style={{ color: riskColor }}>{risk}</div>
              </div>
            </div>
            {mainWarning?.distance && (
              <div className="text-2xl font-bold text-white text-center py-2 rounded-xl"
                style={{ background: riskColor + '20' }}>
                {mainWarning.distance} m
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="rounded-xl p-4 space-y-2" style={{ background: riskColor + '10', border: `2px solid ${riskColor}` }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠</span>
              <span className="font-bold text-white">{mainWarning?.title}</span>
            </div>
            <p className="text-slate-300 text-sm">{mainWarning?.detail}</p>
            {mainWarning?.distance && <p className="font-bold" style={{ color: riskColor }}>{mainWarning.distance} m</p>}
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: riskColor + '20', color: riskColor }}>{risk}</span>
              <span className="px-2 py-1 rounded text-xs font-mono text-slate-400 border border-slate-600">
                {patternMap[risk as keyof typeof patternMap]}
              </span>
            </div>
          </div>
        );
    }
  };

  const StandardCard = ({ label }: { label: string }) => (
    <div className="rounded-xl p-3 border border-drive-border" style={{ background: '#0f1628' }}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-medium text-white text-xs">Standard value</div>
    </div>
  );

  const AdaptedCard = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <div className="rounded-xl p-3 border" style={{ background: '#0f1628', borderColor: highlight ? '#1a6bff' : '#1e2d4a' }}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`font-bold text-sm ${highlight ? 'text-blue-400' : 'text-white'}`}>{value}</div>
    </div>
  );

  const adaptedProps = {
    standard: { textSize: 'Normal', contrast: 'Standard', icons: 'With color', labels: 'Compact', font: '14px' },
    color_accessible: { textSize: 'Normal', contrast: 'Standard', icons: 'Icon + Text + Shape', labels: 'With risk tags', font: '14px' },
    red_green: { textSize: 'Normal', contrast: 'Enhanced', icons: 'No red/green reliance', labels: 'Color-free labels', font: '14px' },
    blue_yellow: { textSize: 'Normal', contrast: 'Enhanced', icons: 'No blue/yellow reliance', labels: 'Color-free labels', font: '14px' },
    low_vision: { textSize: 'Extra Large', contrast: 'Maximum', icons: 'Large icons', labels: 'Expanded text', font: '19px' },
    high_contrast: { textSize: 'Large', contrast: 'Maximum', icons: 'White on black', labels: 'Bold labels', font: '16px' },
    glare_reduction: { textSize: 'Normal', contrast: 'Dimmed', icons: 'Standard', labels: 'Standard', font: '14px' },
    night_visibility: { textSize: 'Normal', contrast: 'Night-tuned', icons: 'Standard', labels: 'Standard', font: '14px' },
    voice_first: { textSize: 'Normal', contrast: 'Standard', icons: 'Minimal', labels: 'Voice primary', font: '14px' },
    simplified: { textSize: 'Large', contrast: 'Standard', icons: 'Large simple icons', labels: 'Key info only', font: '16px' },
  }[selectedMode] ?? { textSize: 'Normal', contrast: 'Standard', icons: 'Standard', labels: 'Standard', font: '14px' };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <GitCompare className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Vision Twin Simulator</h2>
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          BEFORE vs AFTER
        </span>
      </div>
      <p className="text-slate-400 text-sm">Select a vision accessibility mode to compare the standard interface against DriveIQ's adaptive interface.</p>

      {/* Mode selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setSelectedMode(m.id)}
            className={`p-2.5 rounded-xl text-left transition-all border text-xs ${selectedMode === m.id ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-drive-border text-slate-400 hover:border-blue-500/40'}`}>
            {selectedMode === m.id && <Check className="w-3 h-3 mb-1" />}
            <div className="font-semibold">{m.label}</div>
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-4 py-2 rounded-lg" style={{ background: 'rgba(26,107,255,0.07)', border: '1px solid rgba(26,107,255,0.2)' }}>
        <Eye className="w-4 h-4 text-blue-400 inline mr-2" />
        <span className="text-blue-300 text-sm font-medium">
          {MODES.find(m => m.id === selectedMode)?.desc}
        </span>
      </div>

      {/* Before / After comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* BEFORE */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-drive-border flex items-center gap-2"
            style={{ background: 'rgba(100,116,139,0.1)' }}>
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <span className="text-slate-300 font-bold text-sm">BEFORE ADAPTATION</span>
            <span className="text-xs text-slate-500 ml-auto">Standard Interface</span>
          </div>
          <div className="p-4 space-y-3">
            <StandardWarning />
            <div className="grid grid-cols-2 gap-2">
              <StandardCard label="Text Size" />
              <StandardCard label="Contrast" />
              <StandardCard label="Warning Style" />
              <StandardCard label="Font Size" />
            </div>
            <div className="text-xs text-slate-500 italic">Color alone communicates risk level. No voice. Dense interface.</div>
          </div>
        </div>

        {/* AFTER */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-drive-border flex items-center gap-2"
            style={{ background: 'rgba(26,107,255,0.1)' }}>
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-blue-300 font-bold text-sm">AFTER ADAPTATION</span>
            <span className="text-xs text-blue-500 ml-auto">DriveIQ Adapted</span>
          </div>
          <div className="p-4 space-y-3">
            <AdaptedWarning />
            <div className="grid grid-cols-2 gap-2">
              <AdaptedCard label="Text Size" value={adaptedProps.textSize} highlight={adaptedProps.textSize !== 'Normal'} />
              <AdaptedCard label="Contrast" value={adaptedProps.contrast} highlight={adaptedProps.contrast !== 'Standard'} />
              <AdaptedCard label="Warning Style" value={adaptedProps.icons} highlight />
              <AdaptedCard label="Font Size" value={adaptedProps.font} highlight={adaptedProps.font !== '14px'} />
            </div>
            <div className="text-xs text-slate-400 italic">
              {selectedMode === 'voice_first' ? 'Voice alerts speak the warning. Visual is secondary.'
                : selectedMode === 'low_vision' ? 'Extra-large text and high contrast highlight critical information.'
                  : selectedMode === 'color_accessible' || selectedMode === 'red_green' || selectedMode === 'blue_yellow'
                    ? 'Icons, text shapes, and pattern bars replace color-only signals.'
                    : selectedMode === 'high_contrast' ? 'Maximum contrast — white on black — for reduced contrast sensitivity.'
                      : selectedMode === 'simplified' ? 'Only the most critical information is shown.'
                        : 'Interface adapted to selected vision profile.'}
            </div>
          </div>
        </div>
      </div>

      {/* Feature summary */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-bold text-white mb-3">DriveIQ Adaptation Features Active</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: 'Color-Independent', active: ['color_accessible', 'red_green', 'blue_yellow'].includes(selectedMode) },
            { label: 'Large Text', active: ['low_vision', 'simplified'].includes(selectedMode) },
            { label: 'High Contrast', active: ['low_vision', 'high_contrast'].includes(selectedMode) },
            { label: 'Voice Alerts', active: selectedMode === 'voice_first' },
            { label: 'Simplified Layout', active: selectedMode === 'simplified' },
            { label: 'Enhanced Labels', active: ['low_vision', 'color_accessible', 'red_green'].includes(selectedMode) },
          ].map(f => (
            <div key={f.label} className={`p-2 rounded-lg text-center text-xs font-medium border ${f.active ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-drive-border text-slate-600'}`}>
              {f.active ? '✓ ' : ''}{f.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
