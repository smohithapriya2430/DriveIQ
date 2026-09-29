import React, { useState } from 'react';
import { AlertTriangle, Shield, MapPin, Car, Activity, Phone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Emergency() {
  const { setPage, activeScenario, vehicle } = useApp();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-bold text-white">Emergency Safety Mode</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            SIMULATION ONLY
          </span>
          <button onClick={() => setPage('dashboard')} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl" style={{ background: 'rgba(255,179,0,0.1)', border: '1px solid rgba(255,179,0,0.4)' }}>
        <p className="text-amber-300 text-sm font-medium">
          ⚠ SIMULATION ONLY — This emergency interface is a software prototype for academic demonstration. No actual emergency services are contacted. No real vehicle control is performed.
        </p>
      </div>

      {/* Emergency status hero */}
      <div className="glass-panel p-6 rounded-2xl text-center warning-critical">
        <AlertTriangle className="w-14 h-14 text-red-400 mx-auto mb-3" />
        <div className="text-3xl font-black text-white mb-2">EMERGENCY SAFETY MODE</div>
        <div className="text-red-400 font-bold text-lg">SIMULATION ACTIVATED</div>
      </div>

      {!confirmed ? (
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <p className="text-slate-300 text-sm">This will simulate emergency safety protocol activation.</p>
          <div className="flex gap-3">
            <button onClick={() => setPage('dashboard')}
              className="flex-1 py-3 rounded-xl font-medium text-slate-400 border border-drive-border">
              Cancel
            </button>
            <button onClick={() => setConfirmed(true)}
              className="flex-1 py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #ff4560, #cc0030)' }}>
              Activate Emergency Simulation
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: MapPin, label: 'Simulated Location', value: '40.7128° N, 74.0060° W', status: 'ACQUIRED' },
              { icon: Car, label: 'Vehicle Status', value: vehicle.mode, status: vehicle.status },
              { icon: Activity, label: 'Current Speed', value: `${vehicle.speed} km/h`, status: 'MONITORING' },
              { icon: Shield, label: 'Active Hazards', value: `${activeScenario.warnings.filter(w => w.level >= 3).length} detected`, status: 'ALERT' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="glass-panel p-4 rounded-xl flex items-center gap-3">
                  <Icon className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-slate-400">{item.label}</div>
                    <div className="text-white font-medium text-sm">{item.value}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,69,96,0.2)', color: '#ff4560' }}>
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommended actions */}
          <div className="glass-panel p-4 rounded-xl">
            <h3 className="text-sm font-bold text-white mb-3">Recommended Safe Actions</h3>
            <div className="space-y-2">
              {[
                'Reduce speed and pull to a safe location',
                'Activate hazard warning lights',
                'Contact emergency services if required',
                'Stay in vehicle until help arrives',
                'Do not attempt manual vehicle control',
              ].map((action, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: '#0f1628' }}>
                  <span className="text-blue-400 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                  <span className="text-slate-300 text-sm">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency communication simulation */}
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-white">Emergency Communication</span>
              <span className="text-xs text-amber-400 ml-auto font-bold">SIMULATION ONLY</span>
            </div>
            <div className="space-y-2">
              {['Emergency Services (112 / 911)', 'Roadside Assistance', 'Vehicle Manufacturer Support'].map(service => (
                <div key={service} className="flex items-center justify-between p-3 rounded-xl border border-drive-border">
                  <span className="text-slate-300 text-sm">{service}</span>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-drive-border text-slate-500 cursor-not-allowed opacity-50">
                    SIMULATED
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => { setConfirmed(false); setPage('dashboard'); }}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #1a6bff, #0f4fd1)' }}>
            Exit Emergency Mode
          </button>
        </div>
      )}
    </div>
  );
}
