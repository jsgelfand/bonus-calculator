"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
  gravity: number;
}

const GOLD_COLORS = [
  "#FFD700",
  "#FFC107",
  "#FFB300",
  "#FFCA28",
  "#F9A825",
  "#FF8F00",
  "#FFE082",
  "#FFF176",
];

export default function GoldFireworks({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const prevTriggerRef = useRef(false);

  const createBurst = useCallback((cx: number, cy: number) => {
    const count = 90;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 3;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.004 + Math.random() * 0.004,
        size: 3 + Math.random() * 4,
        color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
        gravity: 0.02 + Math.random() * 0.015,
      });
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.01);

    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.alpha -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (particlesRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (trigger && !prevTriggerRef.current) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Create 3 bursts at different positions
      createBurst(cx, cy);
      setTimeout(() => {
        createBurst(cx - 60, cy - 30);
        createBurst(cx + 60, cy - 30);
      }, 150);

      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    }
    prevTriggerRef.current = trigger;
  }, [trigger, createBurst, animate]);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}
