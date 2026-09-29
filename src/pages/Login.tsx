import React, { useState } from 'react';
import { Eye, EyeOff, Car, Shield, Zap, ChevronRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { setPage, setIsLoggedIn, setDriver, profileComplete } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      if (profileComplete) {
        setPage('dashboard');
      } else {
        setPage('driver-profile');
      }
    }, 1200);
  };

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
      setDriver({
        name: 'Alex Rivera',
        age: '30–45',
        experience: '5–10 years',
        language: 'English',
        preferredVoice: 'Default',
        alertVolume: 75,
        units: 'kmh',
        navigationPreference: 'Visual + Voice',
      });
      setPage('driver-profile');
    }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #04070f 0%, #0a0e1a 40%, #0d1528 100%)' }}>
      {/* Left Panel – Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Background grid lines */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute border-t border-blue-400" style={{ top: `${i * 5.26}%`, left: 0, right: 0 }} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute border-l border-blue-400" style={{ left: `${i * 5.26}%`, top: 0, bottom: 0 }} />
          ))}
        </div>

        {/* Glowing circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1a6bff 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a6bff, #00c2ff)' }}>
              <Car className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-wide">DriveIQ</div>
              <div className="text-xs text-blue-400 tracking-widest uppercase">Autonomous Systems</div>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Intelligent Driving.<br />
              <span style={{ background: 'linear-gradient(90deg, #1a6bff, #00c2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Adapted to Every Vision.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              The autonomous driving system that adapts its interface and safety communication to every driver's visual accessibility needs.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, title: 'Vision-Adaptive Interface', desc: 'Interface adapts to your visual requirements in real time' },
              { icon: Zap, title: 'Multi-Modal Safety Alerts', desc: 'Visual, voice, and pattern-based warnings combined' },
              { icon: Car, title: 'Simulated Autonomous Driving', desc: 'Full perception, decision, and path planning simulation' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(26, 107, 255, 0.08)', border: '1px solid rgba(26, 107, 255, 0.2)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(26, 107, 255, 0.15)' }}>
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs">
            Academic Software Prototype · Simulation Only · No real vehicle control
          </p>
        </div>
      </div>

      {/* Right Panel – Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a6bff, #00c2ff)' }}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">DriveIQ</div>
              <div className="text-xs text-blue-400 tracking-widest uppercase">Autonomous Systems</div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8" style={{ background: 'rgba(15, 22, 40, 0.95)', border: '1px solid #1e2d4a', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-1">Sign In</h2>
              <p className="text-slate-400 text-sm">Access your DriveIQ driver profile</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm"
                style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.3)', color: '#ff4560' }}>
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email or Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="driver@driveiq.com"
                  className="drive-input"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="drive-input pr-12"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot Password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
                style={{ background: loading ? '#1e2d4a' : 'linear-gradient(135deg, #1a6bff, #0f4fd1)' }}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>Sign In <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: '#1e2d4a' }} />
              <span className="text-xs text-slate-500">OR</span>
              <div className="flex-1 h-px" style={{ background: '#1e2d4a' }} />
            </div>

            {/* Demo button */}
            <button onClick={handleDemo} disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-blue-400 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-blue-500/10 disabled:opacity-60"
              style={{ border: '1px solid rgba(26, 107, 255, 0.4)' }}>
              <Zap className="w-4 h-4" />
              Launch Demo Mode
            </button>

            {/* Create Profile */}
            <button onClick={() => { setIsLoggedIn(true); setPage('driver-profile'); }}
              className="w-full py-3 rounded-xl font-medium text-slate-400 flex items-center justify-center gap-2 transition-all duration-200 hover:text-white mt-3">
              <User className="w-4 h-4" />
              Create Driver Profile
            </button>

            {/* Privacy note */}
            <p className="text-center text-xs text-slate-600 mt-6 leading-relaxed">
              🔒 Your accessibility preferences are used to personalize the driving interface and are stored locally in this prototype.
            </p>
          </div>

          <p className="text-center text-xs text-slate-600 mt-4">
            DriveIQ v1.0 · Academic Prototype · Simulation Only
          </p>
        </div>
      </div>
    </div>
  );
}
