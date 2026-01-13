import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const FlowFieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;

    // Configuration
    const particleCount = 500;
    const speed = 2; // Base speed

    const isDark = resolvedTheme === 'dark';

    // Theme-based colors
    const palette = isDark
      ? [
          '#8AB4F8', // Lighter Blue for visibility on dark
          '#8AB4F8',
          '#E8EAED', // Light Grey/White
          '#BDC1C6', // Grey
        ]
      : [
          '#4285F4', // Blue
          '#4285F4',
          '#202124', // Dark
          '#9AA0A6', // LIGHT GREY
        ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      history: Array<{ x: number; y: number }>;
      color: string;
      maxLength: number;
      age: number;
      lifespan: number;
      lineWidth: number;
      radiusMod: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = 0;
        this.vy = 0;
        this.history = [];
        this.maxLength = 10 + Math.random() * 20;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.age = Math.random() * 100;
        this.lifespan = 400 + Math.random() * 200;
        this.lineWidth = 1.0 + Math.random() * 1.5;
        this.radiusMod = 0.5 + Math.random();
      }

      update(w: number, h: number) {
        this.age++;

        // Calculate distance and angle from center
        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

        // Base orbit angle (tangent to radius)
        let angle = Math.atan2(dy, dx) + Math.PI / 2;

        // Add subtle wave/noise to make it "flow"
        const noiseScale = 0.01;
        const noise = Math.sin(distanceFromCenter * noiseScale - this.age * 0.01) * 0.3;
        angle += noise;

        const currentSpeed = speed * this.radiusMod;

        this.vx = Math.cos(angle) * currentSpeed;
        this.vy = Math.sin(angle) * currentSpeed;

        this.x += this.vx;
        this.y += this.vy;

        const margin = 50;
        if (this.x < -margin || this.x > w + margin || this.y < -margin || this.y > h + margin) {
            this.reset(w, h);
        }

        // Maintain tail
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxLength) {
          this.history.shift();
        }
      }

      reset(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.history = [];
        this.age = 0;
      }

      draw(context: CanvasRenderingContext2D) {
        if (this.history.length < 2) return;

        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);

        // Quadratic bezier curve for smoother lines
        for (let i = 1; i < this.history.length - 1; i++) {
            const xc = (this.history[i].x + this.history[i + 1].x) / 2;
            const yc = (this.history[i].y + this.history[i + 1].y) / 2;
            context.quadraticCurveTo(this.history[i].x, this.history[i].y, xc, yc);
        }
        // Connect the last point
        const last = this.history[this.history.length - 1];
        context.lineTo(last.x, last.y);

        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
      }
    }

    const init = () => {
      // High DPI Canvas Setup
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;

      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        centerX = width / 2;
        centerY = height / 2;

        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        // Normalize coordinate system to use css pixels
        ctx.scale(dpr, dpr);

        // Reset styling width/height
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    init();
    animate();

    const handleResize = () => {
        init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]); // Re-run when theme changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        backgroundColor: resolvedTheme === 'dark' ? '#121212' : '#FFFFFF',
        transition: 'background-color 0.3s ease',
      }}
    />
  );
};

export default FlowFieldBackground;
