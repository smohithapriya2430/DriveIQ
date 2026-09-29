import React from 'react';
import { BarChart3, CheckCircle, X, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const metrics = [
  { feature: 'Text Scaling', standard: 0, driveiq: 3, max: 3 },
  { feature: 'Contrast Enhancement', standard: 1, driveiq: 3, max: 3 },
  { feature: 'Color-Independent Indicators', standard: 0, driveiq: 3, max: 3 },
  { feature: 'Voice Alerts', standard: 0, driveiq: 3, max: 3 },
  { feature: 'Warning Prioritization', standard: 1, driveiq: 3, max: 3 },
  { feature: 'Simplified Interface', standard: 0, driveiq: 3, max: 3 },
  { feature: 'Icon Support', standard: 1, driveiq: 3, max: 3 },
  { feature: 'Accessibility Profiles', standard: 0, driveiq: 3, max: 3 },
];

const features = [
  { category: 'Visual', label: 'Scalable Typography', standard: false, driveiq: true },
  { category: 'Visual', label: 'High Contrast Modes', standard: false, driveiq: true },
  { category: 'Visual', label: 'Color-Independent Warnings', standard: false, driveiq: true },
  { category: 'Visual', label: 'Icon + Text Warnings', standard: 'partial', driveiq: true },
  { category: 'Visual', label: 'Simplified Layout Mode', standard: false, driveiq: true },
  { category: 'Visual', label: 'Glare Reduction', standard: false, driveiq: true },
  { category: 'Visual', label: 'Night Visibility Mode', standard: false, driveiq: true },
  { category: 'Voice', label: 'Voice Safety Alerts', standard: false, driveiq: true },
  { category: 'Voice', label: 'Configurable Voice Speed', standard: false, driveiq: true },
  { category: 'Voice', label: 'Alert Priority Control', standard: false, driveiq: true },
  { category: 'Profile', label: 'Personalized Accessibility Profile', standard: false, driveiq: true },
  { category: 'Profile', label: 'Combined Multi-Condition Support', standard: false, driveiq: true },
  { category: 'Profile', label: 'Vision Twin Comparison', standard: false, driveiq: true },
  { category: 'Warning', label: 'Risk Level Text Labels', standard: 'partial', driveiq: true },
  { category: 'Warning', label: 'Pattern-Based Risk Indicators', standard: false, driveiq: true },
  { category: 'Warning', label: 'Multi-Modal Warning Delivery', standard: false, driveiq: true },
];

export default function AccessibilityEvaluation() {
  const driveiqScore = features.filter(f => f.driveiq).length;
  const standardScore = features.filter(f => f.standard === true).length;
  const partialScore = features.filter(f => f.standard === 'partial').length;

  const chartData = metrics.map(m => ({
    name: m.feature.length > 16 ? m.feature.slice(0, 16) + '…' : m.feature,
    fullName: m.feature,
    Standard: m.standard,
    DriveIQ: m.driveiq,
  }));

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Accessibility Evaluation</h2>
        </div>
        <span className="text-xs text-slate-500 italic">Prototype Simulation Metrics</span>
      </div>

      <p className="text-slate-400 text-sm">
        Comparison of accessibility features between a conventional driving interface and the DriveIQ Vision-Adaptive system.
        <strong className="text-slate-300"> These are prototype simulation metrics, not clinical measurements.</strong>
      </p>

      {/* Score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl text-center" style={{ border: '1px solid rgba(100,116,139,0.3)' }}>
          <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">Standard System</div>
          <div className="text-4xl font-black text-slate-300">{standardScore + partialScore}/{features.length}</div>
          <div className="text-slate-500 text-sm mt-1">({partialScore} partial)</div>
        </div>
        <div className="glass-panel p-5 rounded-xl text-center" style={{ border: '1px solid rgba(26,107,255,0.4)', background: 'rgba(26,107,255,0.05)' }}>
          <div className="text-blue-400 text-xs uppercase tracking-widest mb-2">DriveIQ System</div>
          <div className="text-4xl font-black text-blue-400">{driveiqScore}/{features.length}</div>
          <div className="text-green-400 text-sm mt-1 font-semibold">All features active</div>
        </div>
        <div className="glass-panel p-5 rounded-xl text-center" style={{ border: '1px solid rgba(0,214,143,0.3)' }}>
          <div className="text-green-400 text-xs uppercase tracking-widest mb-2">Improvement</div>
          <div className="text-4xl font-black text-green-400">+{driveiqScore - standardScore}</div>
          <div className="text-slate-400 text-sm mt-1">additional features</div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-bold text-white mb-4">Feature Score Comparison (0 = Not Present, 3 = Full Support)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} angle={-30} textAnchor="end" axisLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} domain={[0, 3]} ticks={[0, 1, 2, 3]} />
            <Tooltip
              contentStyle={{ background: '#0f1628', border: '1px solid #1e2d4a', borderRadius: '8px', color: '#e2e8f0' }}
              formatter={(value, name, props) => [value, name]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Bar dataKey="Standard" fill="#334155" radius={[4, 4, 0, 0]} />
            <Bar dataKey="DriveIQ" fill="#1a6bff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-drive-border flex items-center gap-2">
          <span className="text-sm font-bold text-white">Feature-by-Feature Comparison</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#0f1628', borderBottom: '1px solid #1e2d4a' }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Feature</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Standard</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-blue-400 uppercase">DriveIQ</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e2d4a', background: i % 2 === 0 ? 'transparent' : 'rgba(26,107,255,0.02)' }}>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-medium text-slate-400" style={{ background: '#1e2d4a' }}>{f.category}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{f.label}</td>
                  <td className="px-4 py-3 text-center">
                    {f.standard === true
                      ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                      : f.standard === 'partial'
                        ? <Minus className="w-4 h-4 text-amber-400 mx-auto" />
                        : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <CheckCircle className="w-4 h-4 text-blue-400 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-xl" style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)' }}>
        <p className="text-xs text-slate-400 leading-relaxed">
          ⓘ <strong className="text-slate-300">Disclaimer:</strong> All metrics are prototype simulation comparisons for academic demonstration. They do not represent clinical measurements, certified accessibility audits, or real-world system benchmarks. DriveIQ accessibility profiles are user-selected interface preferences, not medical assessments.
        </p>
      </div>
    </div>
  );
}
