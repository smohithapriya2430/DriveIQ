import React, { useState } from 'react';
import { User, ChevronRight, Car, Globe, Volume2, Gauge, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { DriverProfile as DP } from '../types';

export default function DriverProfile() {
  const { setPage, setDriver, driver } = useApp();
  const [form, setForm] = useState<DP>(driver ?? {
    name: '',
    age: '',
    experience: '',
    language: 'English',
    preferredVoice: 'Default',
    alertVolume: 75,
    units: 'kmh',
    navigationPreference: 'Visual + Voice',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DP, string>>>({});

  const set = (k: keyof DP, v: string | number) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.age) e.age = 'Please select your age range.';
    if (!form.experience) e.experience = 'Please select experience level.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    setDriver(form);
    setPage('vision-assessment');
  };

  const inputCls = 'drive-input';
  const selectCls = 'drive-input appearance-none cursor-pointer';

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'linear-gradient(135deg, #04070f 0%, #0a0e1a 100%)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a6bff, #00c2ff)' }}>
              <Car className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">DriveIQ</div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to DriveIQ</h1>
          <p className="text-slate-400 text-lg">Let's personalize your driving experience.</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {['Driver Profile', 'Vision Assessment', 'Your Profile', 'Dashboard'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i === 0 ? 'bg-blue-500 text-white' : 'bg-drive-border text-slate-500'}`}>{i + 1}</div>
                <span className={`text-xs mt-1 hidden sm:block ${i === 0 ? 'text-blue-400' : 'text-slate-600'}`}>{step}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 ${i < 0 ? 'bg-blue-500' : 'bg-drive-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(15, 22, 40, 0.95)', border: '1px solid #1e2d4a' }}>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Driver Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Enter your name" className={inputCls} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Age Range *</label>
              <select value={form.age} onChange={e => set('age', e.target.value)} className={selectCls}>
                <option value="">Select age range</option>
                {['Under 25', '25–30', '30–45', '45–60', '60–70', '70+'].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Driving Experience *</label>
              <select value={form.experience} onChange={e => set('experience', e.target.value)} className={selectCls}>
                <option value="">Select experience</option>
                {['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10–20 years', '20+ years'].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience}</p>}
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Globe className="inline w-4 h-4 mr-1" />Preferred Language
              </label>
              <select value={form.language} onChange={e => set('language', e.target.value)} className={selectCls}>
                {['English', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Hindi', 'Japanese', 'Chinese'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Voice */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Volume2 className="inline w-4 h-4 mr-1" />Preferred Voice
              </label>
              <select value={form.preferredVoice} onChange={e => set('preferredVoice', e.target.value)} className={selectCls}>
                {['Default', 'Natural Female', 'Natural Male', 'Standard', 'Enhanced'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Alert Volume */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Volume2 className="inline w-4 h-4 mr-1" />Alert Volume: {form.alertVolume}%
              </label>
              <input type="range" min={0} max={100} step={5} value={form.alertVolume}
                onChange={e => set('alertVolume', parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Mute</span><span>Low</span><span>Medium</span><span>High</span><span>Max</span>
              </div>
            </div>

            {/* Units */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Gauge className="inline w-4 h-4 mr-1" />Speed Units
              </label>
              <div className="flex gap-3">
                {(['kmh', 'mph'] as const).map(u => (
                  <button key={u} onClick={() => set('units', u)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all text-sm ${form.units === u ? 'bg-blue-600 text-white' : 'bg-drive-panel border border-drive-border text-slate-400 hover:border-blue-500'}`}>
                    {u === 'kmh' ? 'km/h' : 'mph'}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <MapPin className="inline w-4 h-4 mr-1" />Navigation Preference
              </label>
              <select value={form.navigationPreference} onChange={e => set('navigationPreference', e.target.value)} className={selectCls}>
                {['Visual + Voice', 'Visual Only', 'Voice Only', 'Simplified Visual', 'Large Map'].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-drive-border">
            <button onClick={handleContinue}
              className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 text-lg transition-all duration-200 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #1a6bff, #0f4fd1)' }}>
              Continue to Vision Assessment
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-slate-600 mt-4">
              Next: Tell us how you see — so DriveIQ can adapt to your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
