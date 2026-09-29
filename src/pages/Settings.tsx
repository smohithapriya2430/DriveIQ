import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Eye, Bell, Globe, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { DriverProfile } from '../types';

export default function Settings() {
  const { driver, setDriver, accessibility, setAccessibility, setPage } = useApp();
  const [localDriver, setLocalDriver] = useState<DriverProfile>(driver ?? {
    name: '', age: '', experience: '', language: 'English',
    preferredVoice: 'Default', alertVolume: 75, units: 'kmh', navigationPreference: 'Visual + Voice',
  });
  const [saved, setSaved] = useState(false);

  const setD = (k: keyof DriverProfile, v: string | number) => setLocalDriver(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    setDriver(localDriver);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetProfile = () => {
    setPage('vision-assessment');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Settings</h2>
        </div>
        {saved && (
          <span className="text-green-400 text-sm font-medium flex items-center gap-1">
            <Save className="w-4 h-4" /> Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Driver profile */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Driver Profile</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Name</label>
              <input type="text" value={localDriver.name} onChange={e => setD('name', e.target.value)} className="drive-input text-sm py-2" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Age Range</label>
              <select value={localDriver.age} onChange={e => setD('age', e.target.value)} className="drive-input text-sm py-2">
                {['Under 25', '25–30', '30–45', '45–60', '60–70', '70+'].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Units</label>
              <div className="flex gap-2">
                {(['kmh', 'mph'] as const).map(u => (
                  <button key={u} onClick={() => setD('units', u)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${localDriver.units === u ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400'}`}>
                    {u === 'kmh' ? 'km/h' : 'mph'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Alert Volume: {localDriver.alertVolume}%</label>
              <input type="range" min={0} max={100} step={5} value={localDriver.alertVolume}
                onChange={e => setD('alertVolume', parseInt(e.target.value))}
                className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Navigation Preference</label>
              <select value={localDriver.navigationPreference} onChange={e => setD('navigationPreference', e.target.value)} className="drive-input text-sm py-2">
                {['Visual + Voice', 'Visual Only', 'Voice Only', 'Simplified Visual', 'Large Map'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Display & Accessibility */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Display & Accessibility</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Text Size</label>
              <div className="flex gap-2">
                {(['normal', 'large', 'x-large'] as const).map(v => (
                  <button key={v} onClick={() => setAccessibility({ ...accessibility, textSize: v })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${accessibility.textSize === v ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400'}`}>
                    {v === 'normal' ? 'Normal' : v === 'large' ? 'Large' : 'X-Large'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Contrast</label>
              <div className="flex gap-2">
                {(['normal', 'high', 'max'] as const).map(v => (
                  <button key={v} onClick={() => setAccessibility({ ...accessibility, contrastMode: v })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${accessibility.contrastMode === v ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400'}`}>
                    {v === 'normal' ? 'Normal' : v === 'high' ? 'High' : 'Max'}
                  </button>
                ))}
              </div>
            </div>
            {[
              ['voiceEnabled', 'Voice Safety Alerts'],
              ['colorIndependentWarnings', 'Color-Independent Warnings'],
              ['simplifiedMode', 'Simplified Dashboard'],
              ['glareMode', 'Glare Reduction'],
              ['nightMode', 'Night Mode'],
            ].map(([field, label]) => (
              <div key={field} className="flex items-center justify-between p-3 rounded-xl border border-drive-border">
                <span className="text-sm text-slate-300">{label}</span>
                <div onClick={() => setAccessibility({ ...accessibility, [field]: !(accessibility[field as keyof typeof accessibility] as boolean) })}
                  className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${accessibility[field as keyof typeof accessibility] ? 'bg-blue-600' : 'bg-drive-border'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${accessibility[field as keyof typeof accessibility] ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleSave}
          className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #1a6bff, #0f4fd1)' }}>
          <Save className="w-4 h-4" /> Save Settings
        </button>
        <button onClick={handleResetProfile}
          className="flex-1 py-3 rounded-xl font-medium text-slate-300 flex items-center justify-center gap-2 border border-drive-border hover:border-blue-500/40">
          <RotateCcw className="w-4 h-4" /> Update Vision Profile
        </button>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Alert Priority</h3>
        </div>
        <div className="flex gap-2">
          {(['normal', 'high', 'critical-only'] as const).map(v => (
            <button key={v} onClick={() => setAccessibility({ ...accessibility, alertPriority: v })}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${accessibility.alertPriority === v ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400'}`}>
              {v === 'normal' ? 'All' : v === 'high' ? 'High Priority' : 'Critical Only'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">
        🔒 All settings are stored locally in this prototype. No data is transmitted externally.
      </p>
    </div>
  );
}
