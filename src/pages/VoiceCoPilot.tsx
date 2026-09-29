import React, { useState, useEffect } from 'react';
import { Headphones, Play, Square, Volume2, VolumeX, RefreshCw, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { voiceService } from '../modules/voice/VoiceService';

const SAMPLE_ALERTS = [
  { category: 'Navigation', text: 'Navigation active. Following planned route to destination.', level: 1 },
  { category: 'Speed', text: 'Speed limit is sixty kilometers per hour. Please maintain safe speed.', level: 1 },
  { category: 'Vehicle', text: 'Caution. Vehicle approaching from ahead. Maintain safe following distance.', level: 2 },
  { category: 'Pedestrian', text: 'Warning. Pedestrian crossing detected ahead. Distance eighteen meters. Reducing speed.', level: 3 },
  { category: 'Obstacle', text: 'Critical alert. Obstacle detected in lane. Emergency braking activated.', level: 4 },
  { category: 'Lane', text: 'Caution. Lane change in progress. Monitoring adjacent lane.', level: 2 },
  { category: 'Emergency', text: 'Emergency vehicle approaching from behind. Yielding and pulling to side of road.', level: 4 },
  { category: 'Weather', text: 'Warning. Poor visibility due to fog. Speed reduced. Enhanced detection active.', level: 3 },
  { category: 'Curve', text: 'Caution. Sharp curve ahead. Reducing speed for safe navigation.', level: 2 },
  { category: 'Night', text: 'Night driving mode active. Enhanced sensor range enabled.', level: 1 },
];

export default function VoiceCoPilot() {
  const { accessibility, setAccessibility, voiceMuted, setVoiceMuted, activeScenario } = useApp();
  const [isSupported] = useState(() => voiceService.isSupported());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const load = () => setVoices(voiceService.getVoices().filter(v => v.lang.startsWith('en')));
    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, []);

  const speak = (text: string) => {
    if (!isSupported || voiceMuted) return;
    voiceService.setEnabled(true);
    voiceService.setRate(accessibility.voiceSpeed);
    voiceService.setVolume(0.8);
    voiceService.speak(text, true);
    setLastSpoken(text);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), text.length * 60 + 500);
  };

  const stop = () => {
    voiceService.stop();
    setIsSpeaking(false);
  };

  const levelColor = (l: number) => l === 4 ? '#ff4560' : l === 3 ? '#ff8c00' : l === 2 ? '#ffb300' : '#00d68f';
  const levelLabel = (l: number) => l === 4 ? 'CRITICAL' : l === 3 ? 'WARNING' : l === 2 ? 'CAUTION' : 'INFO';

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Headphones className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Voice Co-Pilot</h2>
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${accessibility.voiceEnabled && !voiceMuted ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
          {accessibility.voiceEnabled && !voiceMuted ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>

      {!isSupported && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm">
          ⚠ Speech Synthesis is not available in this browser. Try Chrome or Edge.
        </div>
      )}

      {/* Main controls */}
      <div className="glass-panel p-5 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#0f1628', border: '1px solid #1e2d4a' }}>
            <div>
              <div className="text-sm font-semibold text-white">Voice Assistance</div>
              <div className="text-xs text-slate-500">Spoken safety alerts</div>
            </div>
            <div onClick={() => setAccessibility({ ...accessibility, voiceEnabled: !accessibility.voiceEnabled })}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer ${accessibility.voiceEnabled ? 'bg-blue-600' : 'bg-drive-border'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${accessibility.voiceEnabled ? 'left-7' : 'left-1'}`} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#0f1628', border: '1px solid #1e2d4a' }}>
            <div>
              <div className="text-sm font-semibold text-white">Mute</div>
              <div className="text-xs text-slate-500">Silence all voice alerts</div>
            </div>
            <button onClick={() => setVoiceMuted(!voiceMuted)}
              className={`p-2 rounded-lg transition-all ${voiceMuted ? 'bg-red-500/20 text-red-400' : 'bg-drive-border text-slate-400 hover:text-white'}`}>
              {voiceMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Voice speed */}
        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1.5">
            Voice Speed: {accessibility.voiceSpeed <= 0.7 ? 'Very Slow' : accessibility.voiceSpeed <= 0.9 ? 'Slow' : accessibility.voiceSpeed <= 1.1 ? 'Normal' : accessibility.voiceSpeed <= 1.3 ? 'Fast' : 'Very Fast'}
          </label>
          <input type="range" min={0.5} max={1.5} step={0.1} value={accessibility.voiceSpeed}
            onChange={e => setAccessibility({ ...accessibility, voiceSpeed: parseFloat(e.target.value) })}
            className="w-full accent-blue-500" />
        </div>

        {/* Voice selection */}
        {voices.length > 0 && (
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Voice</label>
            <select className="drive-input text-sm py-2"
              onChange={e => voiceService.setVoiceName(e.target.value)}>
              <option value="">Default</option>
              {voices.slice(0, 8).map(v => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Status */}
      {isSpeaking && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(26,107,255,0.1)', border: '1px solid rgba(26,107,255,0.3)' }}>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="w-1 bg-blue-400 rounded-full"
                style={{ height: `${8 + Math.random() * 16}px`, animation: `pulse ${0.4 + i * 0.1}s ease-in-out infinite` }} />
            ))}
          </div>
          <span className="text-blue-300 text-sm font-medium">Speaking...</span>
          <button onClick={stop} className="ml-auto text-slate-400 hover:text-white">
            <Square className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current scenario alerts */}
      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-white">Current Scenario Alerts</span>
          <span className="text-xs text-slate-500">{activeScenario.name}</span>
        </div>
        <div className="space-y-2">
          {activeScenario.warnings.map(w => (
            <div key={w.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#0f1628', border: '1px solid #1e2d4a' }}>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{w.title}</div>
                <div className="text-slate-500 text-xs truncate italic">"{w.voiceText.slice(0, 60)}..."</div>
              </div>
              <button onClick={() => speak(w.voiceText)} disabled={voiceMuted || !accessibility.voiceEnabled}
                className="ml-3 p-2 rounded-lg flex-shrink-0 transition-all hover:bg-blue-600/20 disabled:opacity-40"
                style={{ border: '1px solid #1e2d4a' }}>
                <Play className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sample alerts */}
      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Mic className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-white">Sample Alerts Library</span>
        </div>
        <div className="space-y-2">
          {SAMPLE_ALERTS.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#0f1628', border: '1px solid #1e2d4a' }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                  style={{ background: levelColor(a.level) + '20', color: levelColor(a.level) }}>
                  {levelLabel(a.level)}
                </span>
                <span className="text-slate-300 text-xs truncate">{a.text}</span>
              </div>
              <button onClick={() => speak(a.text)} disabled={voiceMuted || !accessibility.voiceEnabled}
                className="ml-2 p-2 rounded-lg flex-shrink-0 transition-all hover:bg-blue-600/20 disabled:opacity-40"
                style={{ border: '1px solid #1e2d4a' }}>
                <Play className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {lastSpoken && (
        <div className="p-3 rounded-xl" style={{ background: 'rgba(26,107,255,0.05)', border: '1px solid #1e2d4a' }}>
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Last spoken</span>
            <button onClick={() => speak(lastSpoken)} disabled={voiceMuted}
              className="ml-auto text-xs text-blue-400 hover:text-blue-300 disabled:opacity-40">
              Replay
            </button>
          </div>
          <p className="text-slate-300 text-xs italic">"{lastSpoken}"</p>
        </div>
      )}
    </div>
  );
}
