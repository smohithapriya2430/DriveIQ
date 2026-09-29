import React, { useRef, useEffect } from 'react';
import { Crosshair, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ObjectDetection() {
  const { activeScenario, accessibility } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const riskColor: Record<string, string> = {
    LOW: '#00d68f', MEDIUM: '#ffb300', HIGH: '#ff8c00', CRITICAL: '#ff4560',
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background scene
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0d1528');
    bg.addColorStop(0.5, '#141c2e');
    bg.addColorStop(1, '#1a2035');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(26,107,255,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Road
    ctx.fillStyle = '#141c2e';
    ctx.fillRect(W * 0.2, H * 0.4, W * 0.6, H * 0.6);

    // Lane lines
    ctx.setLineDash([20, 15]);
    ctx.strokeStyle = '#2a3a5a';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2, H * 0.4); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.setLineDash([]);

    // Draw objects
    activeScenario.objects.forEach(obj => {
      const ox = (obj.x / 100) * W;
      const oy = (obj.y / 100) * H;
      const ow = (obj.width / 100) * W;
      const oh = (obj.height / 100) * H;
      const col = riskColor[obj.risk];
      const fontSize = accessibility.textSize === 'x-large' ? 13 : accessibility.textSize === 'large' ? 11 : 10;

      // Glow
      ctx.shadowColor = col;
      ctx.shadowBlur = accessibility.enhancedLabels ? 14 : 8;

      // Box
      ctx.strokeStyle = col;
      ctx.lineWidth = accessibility.enhancedLabels ? 3 : 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(ox, oy, ow, oh);
      ctx.setLineDash([]);

      ctx.shadowBlur = 0;

      // Fill
      ctx.fillStyle = col + '15';
      ctx.fillRect(ox, oy, ow, oh);

      // Corner marks
      const cs = 10;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      [[ox, oy], [ox + ow, oy], [ox, oy + oh], [ox + ow, oy + oh]].forEach(([cx, cy], idx) => {
        const dx = idx % 2 === 0 ? 1 : -1;
        const dy = idx < 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * cs); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * cs, cy);
        ctx.stroke();
      });

      // Label bg
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      const mainText = obj.label;
      const subText = `${obj.distance}m · ${obj.confidence}% · ${obj.risk}`;
      const tw1 = ctx.measureText(mainText).width;
      const tw2 = ctx.measureText(subText).width;
      const maxTw = Math.max(tw1, tw2);
      ctx.fillStyle = 'rgba(4, 7, 15, 0.92)';
      ctx.fillRect(ox, oy - (fontSize * 2 + 12), maxTw + 12, fontSize * 2 + 12);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillText(mainText, ox + 5, oy - fontSize - 3);
      ctx.fillStyle = col;
      ctx.font = `${fontSize - 1}px Inter, sans-serif`;
      ctx.fillText(subText, ox + 5, oy - 4);

      // Pattern indicator (color-independent)
      if (accessibility.colorIndependentWarnings) {
        const pattern = obj.risk === 'CRITICAL' ? '████' : obj.risk === 'HIGH' ? '███░' : obj.risk === 'MEDIUM' ? '██░░' : '█░░░';
        ctx.fillStyle = 'rgba(4,7,15,0.85)';
        ctx.fillRect(ox + ow - 50, oy + oh - 20, 50, 18);
        ctx.fillStyle = col;
        ctx.font = `bold 9px monospace`;
        ctx.fillText(pattern, ox + ow - 46, oy + oh - 6);
      }
    });

    // Ego vehicle indicator
    ctx.fillStyle = '#1a6bff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(10,14,26,0.8)';
    ctx.fillRect(W / 2 - 25, H - 32, 50, 22);
    ctx.fillStyle = '#1a6bff';
    ctx.fillText('EGO', W / 2 - 14, H - 16);

    // Watermark
    ctx.fillStyle = 'rgba(26,107,255,0.4)';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('SIMULATED PERCEPTION', 12, 22);
  }, [activeScenario, accessibility]);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Object Detection</h2>
        </div>
        <span className="px-2 py-0.5 rounded text-xs font-bold border"
          style={{ background: 'rgba(26,107,255,0.1)', borderColor: 'rgba(26,107,255,0.3)', color: '#60a5fa' }}>
          SIMULATED PERCEPTION
        </span>
      </div>

      <div className="glass-panel overflow-hidden rounded-xl">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-auto" style={{ display: 'block' }} />
      </div>

      {/* Object table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-drive-border flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">Detection Summary</span>
        </div>
        {activeScenario.objects.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No objects detected in current scenario.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#0f1628', borderBottom: '1px solid #1e2d4a' }}>
                  {['Object', 'Distance', 'Relative Speed', 'Risk', 'Confidence', 'Risk Indicator'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeScenario.objects.map((obj, i) => (
                  <tr key={obj.id} style={{ borderBottom: '1px solid #1e2d4a', background: i % 2 === 0 ? 'transparent' : 'rgba(26,107,255,0.02)' }}>
                    <td className="px-4 py-3 font-bold text-white">{obj.label}</td>
                    <td className="px-4 py-3 text-slate-300">{obj.distance} m</td>
                    <td className="px-4 py-3">
                      <span className={obj.relativeSpeed < 0 ? 'text-orange-400' : 'text-green-400'}>
                        {obj.relativeSpeed < 0 ? '▼' : '▲'} {Math.abs(obj.relativeSpeed)} km/h
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ background: (riskColor[obj.risk] ?? '#fff') + '20', color: riskColor[obj.risk] }}>
                        {obj.risk}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blue-400">{obj.confidence}%</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: riskColor[obj.risk] }}>
                      {obj.risk === 'CRITICAL' ? '████ CRITICAL' : obj.risk === 'HIGH' ? '███░ HIGH' : obj.risk === 'MEDIUM' ? '██░░ MEDIUM' : '█░░░ LOW'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
