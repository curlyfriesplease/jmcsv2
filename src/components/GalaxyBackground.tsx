import React, { useEffect, useRef } from 'react';

interface GalaxyBackgroundProps {
  isActive: boolean;
}

const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const linesRef = useRef<Line[]>([]);
  const starsRef = useRef<Star[]>([]);
  const tickRef = useRef(0);

  const opts = {
    lineCount: 80,
    starCount: 25,
    radVel: 0.01,
    lineBaseVel: 0.1,
    lineAddedVel: 0.1,
    lineBaseLife: 0.1,
    lineAddedLife: 0.05,
    starBaseLife: 10,
    starAddedLife: 10,
    ellipseTilt: -0.3,
    ellipseBaseRadius: 0.15,
    ellipseAddedRadius: 0.02,
    ellipseAxisMultiplierX: 2,
    ellipseAxisMultiplierY: 2,
    repaintAlpha: 0,
  };

  class Line {
    rad: number = 0;
    len: number = 0;
    lenVel: number = 0;
    x: number = 0;
    y: number = 0;
    px: number = 0;
    py: number = 0;
    life: number = 0;
    originalLife: number = 0;
    alpha: number = 0;

    reset(w: number) {
      this.rad = Math.random() * Math.PI * 2;
      this.len =
        w * (opts.ellipseBaseRadius + Math.random() * opts.ellipseAddedRadius);
      this.lenVel = opts.lineBaseVel + Math.random() * opts.lineAddedVel;

      this.x = this.px = Math.cos(this.rad) * this.len;
      this.y = this.py = Math.sin(this.rad) * this.len;

      this.life = this.originalLife =
        w * (opts.lineBaseLife + Math.random() * opts.lineAddedLife);
      this.alpha = 0.2 + Math.random() * 0.8;
    }

    step() {
      --this.life;

      this.px = this.x;
      this.py = this.y;

      this.rad += opts.radVel;
      this.len -= this.lenVel;

      this.x = Math.cos(this.rad) * this.len;
      this.y = Math.sin(this.rad) * this.len;

      if (this.life <= 0) {
        this.reset(canvasRef.current?.width || 800);
      }
    }

    draw(ctx: CanvasRenderingContext2D, w: number) {
      const ratio = Math.abs(this.life / this.originalLife - 1 / 2);

      ctx.lineWidth = ratio * 5;
      ctx.strokeStyle = ctx.shadowColor = `hsla(${
        tickRef.current +
        (this.x / (w * (opts.ellipseBaseRadius + opts.ellipseAddedRadius))) *
          100
      }, 80%, ${75 - ratio * 150}%, ${this.alpha})`;

      ctx.beginPath();
      ctx.moveTo(this.px, this.py);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
  }

  class Star {
    x: number = 0;
    y: number = 0;
    life: number = 0;

    reset(w: number, h: number) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.life = opts.starBaseLife + Math.random() * opts.starAddedLife;
    }

    step(w: number, h: number) {
      --this.life;

      if (this.life <= 0) {
        this.reset(w, h);
      }
    }

    draw(ctx: CanvasRenderingContext2D, w: number) {
      ctx.fillStyle = ctx.shadowColor = `hsla(${
        tickRef.current + (this.x / w) * 100
      }, 80%, 50%, 0.2)`;
      ctx.shadowBlur = this.life;
      ctx.fillRect(this.x, this.y, 1, 1);
    }
  }

  const step = (w: number, h: number) => {
    tickRef.current += 0.5;

    if (linesRef.current.length < opts.lineCount && Math.random() < 0.8) {
      const line = new Line();
      line.reset(w);
      linesRef.current.push(line);
    }

    if (starsRef.current.length < opts.starCount) {
      const star = new Star();
      star.reset(w, h);
      starsRef.current.push(star);
    }

    linesRef.current.forEach((line) => line.step());
    starsRef.current.forEach((star) => star.step(w, h));
  };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';

    // Completely clear the canvas each frame (no trails at all)
    ctx.clearRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'lighter';

    const ellipseCX = w / 2;
    const ellipseCY = h / 2;

    ctx.translate(ellipseCX, ellipseCY);
    ctx.rotate(opts.ellipseTilt);
    ctx.scale(opts.ellipseAxisMultiplierX, opts.ellipseAxisMultiplierY);

    linesRef.current.forEach((line) => line.draw(ctx, w));

    ctx.scale(1 / opts.ellipseAxisMultiplierX, 1 / opts.ellipseAxisMultiplierY);
    ctx.rotate(-opts.ellipseTilt);
    ctx.translate(-ellipseCX, -ellipseCY);

    starsRef.current.forEach((star) => star.draw(ctx, w));
  };

  const loop = () => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    step(canvas.width, canvas.height);
    draw(ctx, canvas.width, canvas.height);

    animationRef.current = requestAnimationFrame(loop);
  };

  const init = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    linesRef.current = [];
    starsRef.current = [];

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (isActive) {
      init();
      animationRef.current = requestAnimationFrame(loop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, loop]);

  useEffect(() => {
    const handleResize = () => {
      if (isActive) {
        init();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
};

export default GalaxyBackground;
