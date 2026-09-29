import React, { useState } from 'react';
import { Eye, ChevronRight, ChevronLeft, Car, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { VisionCondition } from '../types';
import { buildProfileFromConditions } from '../modules/visionAdaptation/VisionAdaptationEngine';

const CONDITIONS: { id: VisionCondition; label: string; desc: string; emoji: string }[] = [
  { id: 'none', label: 'No Visual Accessibility Requirement', desc: 'Standard interface is suitable for me', emoji: '✓' },
  { id: 'color_general', label: 'Difficulty Distinguishing Certain Colors', desc: 'Some colors are hard to tell apart', emoji: '🎨' },
  { id: 'red_green', label: 'Red-Green Color Differentiation Difficulty', desc: 'Red and green look similar to me', emoji: '🔴🟢' },
  { id: 'blue_yellow', label: 'Blue-Yellow Color Differentiation Difficulty', desc: 'Blue and yellow look similar to me', emoji: '🔵🟡' },
  { id: 'small_text', label: 'Difficulty Seeing Small Text', desc: 'Small fonts are hard to read clearly', emoji: 'Aa' },
  { id: 'low_vision', label: 'Difficulty Seeing Objects Clearly', desc: 'Objects or details appear unclear', emoji: '👁' },
  { id: 'low_contrast', label: 'Reduced Contrast Sensitivity', desc: 'Low contrast elements are hard to see', emoji: '◑' },
  { id: 'glare', label: 'Difficulty in Bright Glare', desc: 'Bright screens or sunlight affect my vision', emoji: '☀' },
  { id: 'night', label: 'Difficulty Seeing at Night / Low-Light', desc: 'Night driving visibility is reduced', emoji: '🌙' },
  { id: 'slow_recognition', label: 'Difficulty Quickly Recognizing Visual Warnings', desc: 'Warnings need more time to process', emoji: '⚠' },
  { id: 'voice_prefer', label: 'Prefer Voice Assistance', desc: 'Spoken alerts are easier for me', emoji: '🔊' },
  { id: 'simplified', label: 'Prefer Simplified Visual Information', desc: 'Less cluttered interface preferred', emoji: '⊡' },
  { id: 'other', label: 'Other Accessibility Requirement', desc: 'I have other visual preferences not listed', emoji: '⋯' },
];

export default function VisionAssessment() {
  const { setPage, setAccessibility } = useApp();
  const [selected, setSelected] = useState<VisionCondition[]>([]);
  const [step, setStep] = useState<'conditions' | 'questions'>('conditions');
  const [answers, setAnswers] = useState({
    colorDifficulty: [] as string[],
    textSizeDifficulty: '',
    glareSensitivity: '',
    voicePreference: '',
    simplifiedDashboard: false as boolean | null,
    warningRecognitionDifficulty: '',
  });
  const [error, setError] = useState('');

  const toggle = (id: VisionCondition) => {
    if (id === 'none') {
      setSelected(s => s.includes('none') ? [] : ['none']);
      return;
    }
    setSelected(s => {
      const filtered = s.filter(x => x !== 'none');
      return filtered.includes(id) ? filtered.filter(x => x !== id) : [...filtered, id];
    });
  };

  const handleConditionsNext = () => {
    if (selected.length === 0) { setError('Please select at least one option.'); return; }
    setError('');
    setStep('questions');
  };

  const handleFinish = () => {
    const profile = buildProfileFromConditions(selected, {
      colorDifficulty: answers.colorDifficulty,
      textSizeDifficulty: answers.textSizeDifficulty,
      glareSensitivity: answers.glareSensitivity,
      voicePreference: answers.voicePreference,
      simplifiedDashboard: answers.simplifiedDashboard === true,
      warningRecognitionDifficulty: answers.warningRecognitionDifficulty,
    });
    setAccessibility(profile);
    setPage('vision-profile-summary');
  };

  const setAnswer = (k: keyof typeof answers, v: string | boolean | string[]) =>
    setAnswers(prev => ({ ...prev, [k]: v }));

  const toggleColor = (c: string) => setAnswers(prev => {
    const arr = prev.colorDifficulty;
    return { ...prev, colorDifficulty: arr.includes(c) ? arr.filter(x => x !== c) : [...arr, c] };
  });

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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= 1 ? 'bg-blue-500 text-white' : 'bg-drive-border text-slate-500'}`}>{i + 1}</div>
                <span className={`text-xs mt-1 hidden sm:block ${i <= 1 ? 'text-blue-400' : 'text-slate-600'}`}>{s}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 ${i < 1 ? 'bg-blue-500' : 'bg-drive-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(15, 22, 40, 0.95)', border: '1px solid #1e2d4a' }}>
          {step === 'conditions' ? (
            <>
              <div className="flex items-start gap-3 mb-2">
                <Eye className="w-7 h-7 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Tell us how you see</h2>
                  <p className="text-slate-400 mt-1">DriveIQ uses this information to adapt the interface and safety alerts specifically for you.</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-3 rounded-lg mb-6 mt-4"
                style={{ background: 'rgba(108, 99, 255, 0.08)', border: '1px solid rgba(108, 99, 255, 0.2)' }}>
                <Info className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-indigo-400">Select the visual conditions that affect how information is easiest for you to perceive.</strong>
                  {' '}You may select multiple options. DriveIQ accessibility profiles are user-selected interface preferences. They do not diagnose, measure, or medically assess vision.
                </p>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONDITIONS.map(c => {
                  const isActive = selected.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => toggle(c.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-200 border ${isActive
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-drive-border hover:border-blue-500/50 text-slate-300 hover:text-white'
                      }`}>
                      <span className="text-xl flex-shrink-0 w-8">{c.emoji}</span>
                      <div>
                        <div className="font-medium text-sm">{c.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{c.desc}</div>
                      </div>
                      {isActive && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-600 mt-4">You can select multiple conditions — for example, color differentiation difficulty + small text + voice preference.</p>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setPage('driver-profile')}
                  className="flex-1 py-3 rounded-xl font-medium text-slate-400 border border-drive-border hover:border-blue-500/50 flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleConditionsNext}
                  className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1a6bff, #0f4fd1)' }}>
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">A few more questions</h2>
                  <p className="text-slate-400 text-sm">This helps DriveIQ fine-tune your profile.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Color difficulty */}
                {(selected.includes('color_general') || selected.includes('red_green') || selected.includes('blue_yellow')) && (
                  <Question label="Which colors are difficult for you to distinguish?">
                    <div className="flex flex-wrap gap-2">
                      {['Red', 'Green', 'Red and Green', 'Blue', 'Yellow', 'Multiple colors', 'Not sure'].map(c => (
                        <button key={c} onClick={() => toggleColor(c)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${answers.colorDifficulty.includes(c) ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400 hover:border-blue-500/50'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </Question>
                )}

                <Question label="Do you find small dashboard text difficult to read?">
                  <Options value={answers.textSizeDifficulty} onChange={v => setAnswer('textSizeDifficulty', v)}
                    options={['Never', 'Sometimes', 'Often', 'Almost always']} />
                </Question>

                <Question label="Do bright screens make information harder to see?">
                  <Options value={answers.glareSensitivity} onChange={v => setAnswer('glareSensitivity', v)}
                    options={['Yes', 'No', 'Sometimes']} />
                </Question>

                <Question label="Do you prefer information to be spoken aloud?">
                  <Options value={answers.voicePreference} onChange={v => setAnswer('voicePreference', v)}
                    options={['Always', 'For important warnings', 'Only when requested', 'No']} />
                </Question>

                <Question label="Would you prefer a simplified dashboard with fewer visual elements?">
                  <Options value={answers.simplifiedDashboard === true ? 'Yes' : answers.simplifiedDashboard === false ? 'No' : ''}
                    onChange={v => setAnswer('simplifiedDashboard', v === 'Yes')}
                    options={['Yes', 'No']} />
                </Question>

                <Question label="Do you have difficulty distinguishing warnings when several visual elements appear together?">
                  <Options value={answers.warningRecognitionDifficulty} onChange={v => setAnswer('warningRecognitionDifficulty', v)}
                    options={['Yes', 'No', 'Sometimes']} />
                </Question>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep('conditions')}
                  className="flex-1 py-3 rounded-xl font-medium text-slate-400 border border-drive-border hover:border-blue-500/50 flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1a6bff, #0f4fd1)' }}>
                  Generate My Profile <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Question({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'rgba(26,107,255,0.04)', border: '1px solid #1e2d4a' }}>
      <p className="text-sm font-semibold text-slate-200 mb-3">{label}</p>
      {children}
    </div>
  );
}

function Options({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${value === o ? 'bg-blue-600 border-blue-500 text-white' : 'border-drive-border text-slate-400 hover:border-blue-500/50'}`}>
          {o}
        </button>
      ))}
    </div>
  );
}
