import React, { useEffect, useRef, useState } from 'react';
import { Activity, Pause, Play, SkipForward, AlertTriangle, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LiveSimulation() {
  const { activeScenario, accessibility, vehicle, environment } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [running, setRunning] = useState(true);
  const [frame, setFrame] = useState(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      if (!running) return;
      offsetRef.current = (offsetRef.current + 3) % 80;
      const o = offsetRef.current;
      ctx.clearRect(0, 0, W, H);

      // Sky / environment background
      const isDark = activeScenario.environment.timeOfDay === 'Night'
        || activeScenario.environment.weather === 'Night';
      const skyTop = isDark ? '#04060f' : accessibility.nightMode ? '#060a12' : '#0d1a2e';
      const skyBtm = isDark ? '#0a0e18' : '#1a2845';
      const grad = ctx.createLinearGradient(0, 0, 0, H * 0.55);
      grad.addColorStop(0, skyTop);
      grad.addColorStop(1, skyBtm);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H * 0.55);

      // Road
      const roadGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
      roadGrad.addColorStop(0, '#1a2035');
      roadGrad.addColorStop(1, '#141c2e');
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.5);
      ctx.lineTo(W, H * 0.5);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.fill();

      // Lane markings – animated
      const laneW = 6;
      ctx.fillStyle = '#2a3a5a';
      // left edge
      drawPerspectiveLine(ctx, W * 0.25, H * 0.5, W * 0.05, H, laneW, o);
      // right edge
      drawPerspectiveLine(ctx, W * 0.75, H * 0.5, W * 0.95, H, laneW, o);
      // center dashes
      ctx.setLineDash([30, 20]);
      ctx.strokeStyle = '#f0d060';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(W / 2, H * 0.5);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Fog overlay
      if (activeScenario.environment.weather === 'Fog' || activeScenario.environment.visibility === 'Poor') {
        ctx.fillStyle = 'rgba(180,190,220,0.18)';
        ctx.fillRect(0, 0, W, H);
      }

      // Rain effect
      if (activeScenario.environment.weather === 'Heavy Rain') {
        for (let i = 0; i < 60; i++) {
          const rx = (Math.sin(i * 137 + o * 0.1) * 0.5 + 0.5) * W;
          const ry = ((i * 23 + o * 4) % H);
          ctx.strokeStyle = 'rgba(150,180,220,0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 15);
          ctx.stroke();
        }
      }

      // Objects on road (simple shapes)
      activeScenario.objects.forEach((obj, idx) => {
        const ox = (obj.x / 100) * W;
        const oy = (obj.y / 100) * H;
        const ow = (obj.width / 100) * W;
        const oh = (obj.height / 100) * H;

        const riskColor: Record<string, string> = {
          LOW: '#00d68f',
          MEDIUM: '#ffb300',
          HIGH: '#ff8c00',
          CRITICAL: '#ff4560',
        };
        const col = riskColor[obj.risk] ?? '#ffffff';

        // Bounding box
        ctx.strokeStyle = col;
        ctx.lineWidth = accessibility.enhancedLabels ? 3 : 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(ox, oy, ow, oh);
        ctx.setLineDash([]);

        // Fill
        ctx.fillStyle = col + '18';
        ctx.fillRect(ox, oy, ow, oh);

        // Label background
        ctx.fillStyle = 'rgba(10,14,26,0.85)';
        const fontSize = accessibility.textSize === 'x-large' ? 14 : accessibility.textSize === 'large' ? 12 : 10;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const labelText = `${obj.label} · ${obj.distance}m`;
        const textW = ctx.measureText(labelText).width;
        ctx.fillRect(ox, oy - fontSize - 6, textW + 10, fontSize + 8);

        // Label text
        ctx.fillStyle = col;
        ctx.fillText(labelText, ox + 5, oy - 4);

        // Risk badge (color-independent)
        if (accessibility.colorIndependentWarnings) {
          const badge = `[${obj.risk}]`;
          ctx.fillStyle = 'rgba(10,14,26,0.9)';
          const bw = ctx.measureText(badge).width + 8;
          ctx.fillRect(ox + ow - bw - 2, oy + 2, bw, fontSize + 4);
          ctx.fillStyle = col;
          ctx.fillText(badge, ox + ow - bw, oy + fontSize + 2);
        }
      });

      // Ego vehicle
      const ex = W / 2 - 22;
      const ey = H * 0.72;
      drawEgoCar(ctx, ex, ey, 44, 28, isDark ? '#2a4a8a' : '#1a3a6a');

      // Perception arcs (sensor visualization)
      ctx.save();
      ctx.globalAlpha = 0.12;
      const arcGrad = ctx.createRadialGradient(W / 2, ey + 14, 0, W / 2, ey + 14, W * 0.45);
      arcGrad.addColorStop(0, '#1a6bff');
      arcGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = arcGrad;
      ctx.beginPath();
      ctx.arc(W / 2, ey + 14, W * 0.45, Math.PI * 1.1, Math.PI * 1.9);
      ctx.fill();
      ctx.restore();

      // Radar sweep
      const sweepAngle = (o / 80) * Math.PI * 2 - Math.PI / 2;
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#1a6bff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, ey + 14);
      ctx.lineTo(W / 2 + Math.cos(sweepAngle) * 160, ey + 14 + Math.sin(sweepAngle) * 160);
      ctx.stroke();
      ctx.restore();

      // Simulation label
      ctx.fillStyle = 'rgba(10,14,26,0.7)';
      ctx.fillRect(8, 8, 160, 26);
      ctx.fillStyle = '#1a6bff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('◉ SIMULATED PERCEPTION', 16, 26);

      setFrame(f => f + 1);
      if (running) animRef.current = requestAnimationFrame(draw);
    };

    if (running) animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, activeScenario, accessibility]);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Live Simulation</h2>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            SIMULATED
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setRunning(r => !r)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: '#1e2d4a', color: running ? '#ffb300' : '#00d68f' }}>
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="glass-panel overflow-hidden rounded-xl relative">
        <canvas ref={canvasRef} width={800} height={480}
          className="w-full h-auto" style={{ display: 'block', maxHeight: '60vh' }} />

        {/* Overlay HUD */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid #1e2d4a', color: '#00d68f' }}>
            AUTONOMOUS MODE
          </div>
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid #1e2d4a', color: '#60a5fa' }}>
            {activeScenario.name.toUpperCase()}
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="px-3 py-2 rounded-lg"
            style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid #1e2d4a' }}>
            <div className="text-slate-400 text-xs">Scenario</div>
            <div className="text-white text-sm font-bold">{activeScenario.name}</div>
          </div>
          <div className="px-3 py-2 rounded-lg"
            style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid #1e2d4a' }}>
            <div className="text-slate-400 text-xs">Objects</div>
            <div className="text-white text-sm font-bold">{activeScenario.objects.length} detected</div>
          </div>
          <div className="px-3 py-2 rounded-lg"
            style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid #1e2d4a' }}>
            <div className="text-slate-400 text-xs">Decision</div>
            <div className="text-white text-sm font-bold">{activeScenario.decision.action}</div>
          </div>
        </div>
      </div>

      {/* Warnings shown below */}
      {activeScenario.warnings.map(w => (
        <div key={w.id} className={w.level === 4 ? 'warning-critical' : w.level === 3 ? 'warning-medium' : 'warning-low'}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${w.level === 4 ? 'text-red-400' : 'text-amber-400'}`} />
            <div>
              <div className="font-bold text-white">{w.title}</div>
              <div className="text-slate-300 text-sm">{w.detail}</div>
            </div>
            {w.distance && (
              <div className="ml-auto text-2xl font-black" style={{ color: w.risk === 'CRITICAL' ? '#ff4560' : '#ffb300' }}>
                {w.distance}m
              </div>
            )}
          </div>
        </div>
      ))}

      <p className="text-xs text-slate-600 text-center">
        ⓘ This is a software simulation. No real vehicle, camera, LiDAR, or hardware is involved.
      </p>
    </div>
  );
}

function drawPerspectiveLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  w: number, offset: number
) {
  for (let i = 0; i < 10; i++) {
    const t = ((i / 10) + offset / 80) % 1;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const segW = w * (0.3 + t * 0.7);
    const segH = 20 * (0.3 + t * 0.7);
    ctx.fillStyle = `rgba(42, 58, 90, ${0.3 + t * 0.5})`;
    ctx.fillRect(x - segW / 2, y, segW, segH);
  }
}

function drawEgoCar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 4);
  ctx.fill();
  ctx.strokeStyle = '#4a7adf';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // windshield
  ctx.fillStyle = 'rgba(100,180,255,0.3)';
  ctx.fillRect(x + 6, y + 3, w - 12, h * 0.45);
  // headlights
  ctx.fillStyle = '#fffbe0';
  ctx.fillRect(x + 3, y, 7, 4);
  ctx.fillRect(x + w - 10, y, 7, 4);
}
