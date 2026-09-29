import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { analyticsData } from '../data/mockData';

const COLORS = ['#1a6bff', '#00c2ff', '#00d68f', '#ffb300', '#6c63ff'];

export default function Analytics() {
  const totalWarnings = analyticsData.warningFrequency.reduce((a, d) => a + d.info + d.caution + d.warning + d.critical, 0);
  const totalObjects = analyticsData.objectDetection.reduce((a, d) => a + d.value, 0);
  const totalAdaptations = analyticsData.accessibilityAdaptations.reduce((a, d) => a + d.count, 0);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Analytics</h2>
        </div>
        <span className="text-xs text-slate-500 italic">Prototype Simulation Data</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Objects Detected', value: totalObjects, color: '#1a6bff' },
          { label: 'Warnings Generated', value: totalWarnings, color: '#ffb300' },
          { label: 'Critical Warnings', value: analyticsData.warningFrequency.reduce((a, d) => a + d.critical, 0), color: '#ff4560' },
          { label: 'Accessibility Adaptations', value: totalAdaptations, color: '#00d68f' },
        ].map(c => (
          <div key={c.label} className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-black" style={{ color: c.color }}>{c.value}</div>
            <div className="text-xs text-slate-400 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Warning frequency chart */}
      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Warning Frequency by Day</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analyticsData.warningFrequency} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: '8px', color: '#e2e8f0' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <Bar dataKey="info" name="Info" stackId="a" fill="#6c63ff" radius={[0, 0, 0, 0]} />
            <Bar dataKey="caution" name="Caution" stackId="a" fill="#ffb300" />
            <Bar dataKey="warning" name="Warning" stackId="a" fill="#ff8c00" />
            <Bar dataKey="critical" name="Critical" stackId="a" fill="#ff4560" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Object detection pie */}
        <div className="glass-panel p-4 rounded-xl">
          <h3 className="text-sm font-bold text-white mb-4">Objects Detected by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={analyticsData.objectDetection} cx="50%" cy="50%"
                innerRadius={50} outerRadius={80} dataKey="value" nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {analyticsData.objectDetection.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: '8px', color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Accessibility adaptations bar */}
        <div className="glass-panel p-4 rounded-xl">
          <h3 className="text-sm font-bold text-white mb-4">Accessibility Adaptations Used</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.accessibilityAdaptations} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={90} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: '8px', color: '#e2e8f0' }} />
              <Bar dataKey="count" name="Count" fill="#1a6bff" radius={[0, 4, 4, 0]}>
                {analyticsData.accessibilityAdaptations.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario performance */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-bold text-white mb-4">Scenario Warning Count</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={analyticsData.scenarioPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="scenario" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
            <Tooltip contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: '8px', color: '#e2e8f0' }} />
            <Line type="monotone" dataKey="warnings" stroke="#00c2ff" strokeWidth={2} dot={{ fill: '#00c2ff', r: 4 }} name="Warnings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-600 text-center">
        ⓘ All metrics are prototype simulation data for demonstration purposes only.
      </p>
    </div>
  );
}
