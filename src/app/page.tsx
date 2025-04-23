'use client';

import { useRef, useEffect } from 'react';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 画面リサイズ対応
  useEffect(() => {
    const canvas = canvasRef.current!;

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

    // 緑色のインク
    const color = '#2ecc71';
    const radius = 40 + Math.random() * 60;      // 大きさをランダムに

    drawSplat(ctx, x, y, radius, color);
  };

  // インクの"ブロブ"を描く関数
  function drawSplat(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    
    // より不規則な形状を生成
    const points = 12 + Math.floor(Math.random() * 8);
    const angleStep = (Math.PI * 2) / points;
    
    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      const randomRadius = radius * (0.5 + Math.random() * 0.8);
      const xOffset = Math.cos(angle) * randomRadius;
      const yOffset = Math.sin(angle) * randomRadius;
      
      if (i === 0) {
        ctx.moveTo(x + xOffset, y + yOffset);
      } else {
        // ベジェ曲線で滑らかな曲線を描く
        const prevAngle = (i - 1) * angleStep;
        const midAngle = (angle + prevAngle) / 2;
        const controlRadius = randomRadius * (0.8 + Math.random() * 0.4);
        const controlX = x + Math.cos(midAngle) * controlRadius;
        const controlY = y + Math.sin(midAngle) * controlRadius;
        
        ctx.quadraticCurveTo(controlX, controlY, x + xOffset, y + yOffset);
      }
    }
    
    ctx.closePath();
    ctx.fill();

    // 中心部分をより濃く
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // 小さな飛沫を追加
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (0.8 + Math.random() * 0.4);
      const splashX = x + Math.cos(angle) * distance;
      const splashY = y + Math.sin(angle) * distance;
      const splashRadius = radius * (0.1 + Math.random() * 0.15);
      
      ctx.beginPath();
      ctx.arc(splashX, splashY, splashRadius, 0, Math.PI * 2);
      ctx.fill();
    }
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
