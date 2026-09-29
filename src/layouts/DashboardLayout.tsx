import React, { useState } from 'react';
import {
  Car, LayoutDashboard, Activity, Eye, GitCompare, Map, Crosshair,
  Route, Brain, Shield, Headphones, BarChart3, Settings, AlertTriangle,
  Bell, Menu, X, Wifi, Clock, User, ChevronRight, Zap, Volume2, VolumeX
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AppPage } from '../types';

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'live-simulation', label: 'Live Simulation', icon: Activity },
  { id: 'vision-twin', label: 'Vision Twin', icon: GitCompare },
  { id: 'object-detection', label: 'Object Detection', icon: Crosshair },
  { id: 'path-planning', label: 'Path Planning', icon: Route },
  { id: 'decision-center', label: 'Decision Center', icon: Brain },
  { id: 'scenario-simulation', label: 'Scenarios', icon: Map },
  { id: 'safety-center', label: 'Safety Center', icon: Shield },
  { id: 'accessibility-center', label: 'Accessibility', icon: Eye },
  { id: 'voice-copilot', label: 'Voice Co-Pilot', icon: Headphones },
  { id: 'accessibility-evaluation', label: 'Evaluation', icon: BarChart3 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'demo-mode', label: 'Demo Mode', icon: Zap, badge: 'DEMO' },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { page, setPage, driver, accessibility, emergencyActive, setEmergencyActive,
    voiceMuted, setVoiceMuted, activeScenario } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hasWarnings = activeScenario.warnings.some(w => w.level >= 3);

  const visionModeLabel = accessibility.visionMode
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0e1a' }}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#0f1628', borderRight: '1px solid #1e2d4a' }}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-drive-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a6bff, #00c2ff)' }}>
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">DriveIQ</div>
              <div className="text-blue-400 text-xs">Autonomous Systems</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver info */}
        <div className="px-4 py-3 border-b border-drive-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1a6bff40, #1a6bff20)', border: '1px solid #1a6bff40' }}>
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">{driver?.name ?? 'Driver'}</div>
              <div className="text-xs truncate" style={{ color: '#1a6bff' }}>{visionModeLabel}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full ${active ? 'nav-item-active' : 'nav-item'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">{item.badge}</span>
                )}
                {active && <ChevronRight className="w-3 h-3 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Emergency button */}
        <div className="p-3 border-t border-drive-border">
          <button onClick={() => setPage('emergency')}
            className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{ background: emergencyActive ? '#ff4560' : 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.4)', color: '#ff4560' }}>
            <AlertTriangle className="w-4 h-4" />
            Emergency Safety
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-drive-border"
          style={{ background: '#0f1628', minHeight: '60px' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-white font-semibold text-sm hidden sm:block">
                {NAV_ITEMS.find(n => n.id === page)?.label ?? 'DriveIQ'}
              </span>
            </div>
          </div>

          {/* Center status */}
          <div className="flex items-center gap-4">
            {/* Vision Mode Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(26,107,255,0.1)', border: '1px solid rgba(26,107,255,0.2)' }}>
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">{visionModeLabel}</span>
            </div>

            {/* Simulation status */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 blink-slow" />
              <span className="text-green-400 text-xs font-medium">SIM ACTIVE</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Clock */}
            <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            {/* Connection */}
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <Wifi className="w-4 h-4" />
            </div>

            {/* Warnings */}
            {hasWarnings && (
              <button onClick={() => setPage('safety-center')}
                className="relative flex items-center gap-1 px-2 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,69,96,0.1)', border: '1px solid rgba(255,69,96,0.3)' }}>
                <Bell className="w-4 h-4 text-red-400" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5" />
              </button>
            )}

            {/* Voice mute */}
            <button onClick={() => setVoiceMuted(!voiceMuted)}
              className={`p-1.5 rounded-lg transition-all ${voiceMuted ? 'text-red-400' : 'text-slate-400 hover:text-white'}`}>
              {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
