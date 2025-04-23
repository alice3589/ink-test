'use client';

import { useRef, useEffect } from 'react';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 画面リサイズ対応
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ポインター操作でインクを描画
  const handlePointerDown: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Splatoonっぽいカラーパレット
    const colors = ['#00d8ff', '#ffde00', '#ff3f34', '#32ff7e'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const radius = 50 + Math.random() * 70;      // 大きさをランダムに

    drawSplat(ctx, x, y, radius, color);
  };

  // インクの“ブロブ”を描く関数
  function drawSplat(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const spikes = 8 + Math.floor(Math.random() * 6);  // トゲの数
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.4);
      ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fill();

    // 中心にもう一度丸を描いて“インクの濃い部分”を表現
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        cursor: 'crosshair',
        zIndex: 9999,
      }}
    />
  );
}
