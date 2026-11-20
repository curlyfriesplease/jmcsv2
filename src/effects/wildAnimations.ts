import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { playSound } from './sfx';

export const WILD_ANIMATIONS = [
  { id: 'confetti', name: 'Confetti Pop', detail: 'One cannon blast and a bounce' },
  { id: 'fireworks', name: 'Fireworks', detail: 'Three bursts from different corners' },
  { id: 'bubbles', name: 'Bubble Fountain', detail: 'A rush of rising bubbles' },
  { id: 'jelly', name: 'Jelly', detail: 'Everything squashes and springs back' },
  { id: 'sink', name: 'Kitchen Sink', detail: 'Confetti, bubbles, and a shake' },
  { id: 'shockwave', name: 'Shockwave', detail: 'Rings burst outward from the centre' },
  { id: 'meteors', name: 'Meteor Shower', detail: 'Streaks fall across the screen' },
  { id: 'yoyo', name: 'Yo-yo', detail: 'The screen drops and snaps back up' },
  { id: 'crossfire', name: 'Crossfire', detail: 'Cannons fire in from both sides' },
  { id: 'orbit', name: 'Orbit', detail: 'Sparks circle, then fly outward' },
] as const;

export type WildAnimationId = (typeof WILD_ANIMATIONS)[number]['id'];

function stage(): HTMLElement | null {
  return document.querySelector('.base-layer');
}

function shakeStage(
  steps: { x?: number; y?: number; scale?: number; scaleX?: number; scaleY?: number; rotation?: number; duration: number; ease?: string }[]
) {
  const el = stage();
  if (!el) return;
  gsap.killTweensOf(el);
  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(el, { clearProps: 'transform' });
    },
  });
  steps.forEach((step) => {
    timeline.to(el, step);
  });
}

function bubbleFountain() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:35;';
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  if (!context) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);

  const bubbles = Array.from({ length: 36 }, () => ({
    x: width * (0.2 + Math.random() * 0.6),
    y: height + Math.random() * 80,
    radius: 8 + Math.random() * 18,
    speed: 3.5 + Math.random() * 4.5,
    drift: (Math.random() - 0.5) * 1.6,
    hue: Math.floor(Math.random() * 360),
  }));

  let frame = 0;
  const draw = () => {
    frame += 1;
    context.clearRect(0, 0, width, height);
    bubbles.forEach((bubble) => {
      bubble.y -= bubble.speed;
      bubble.x += bubble.drift;
      context.beginPath();
      context.fillStyle = `hsla(${bubble.hue}, 95%, 62%, 0.75)`;
      context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      context.fill();
    });
    if (frame < 75) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  };
  draw();
}

function shockwave() {
  const rings = [0, 1, 2].map((index) => {
    const ring = document.createElement('div');
    ring.style.cssText =
      'position:fixed;left:50%;top:55%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid #fff;pointer-events:none;z-index:36;opacity:0.9;';
    ring.style.borderColor = ['#ff4fd8', '#ffe14a', '#4dfff3'][index];
    document.body.appendChild(ring);
    return ring;
  });
  rings.forEach((ring, index) => {
    gsap.to(ring, {
      scale: 18,
      opacity: 0,
      duration: 0.7,
      delay: index * 0.12,
      ease: 'power2.out',
      onComplete: () => ring.remove(),
    });
  });
}

function meteorShower() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:35;';
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  if (!context) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);

  const meteors = Array.from({ length: 36 }, () => ({
    x: Math.random() * width,
    y: -40 - Math.random() * height * 0.4,
    speed: 10 + Math.random() * 12,
    length: 28 + Math.random() * 36,
  }));

  let frame = 0;
  const draw = () => {
    frame += 1;
    context.clearRect(0, 0, width, height);
    meteors.forEach((meteor) => {
      meteor.x += meteor.speed * 0.45;
      meteor.y += meteor.speed;
      context.strokeStyle = 'rgba(255, 244, 214, 0.9)';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(meteor.x, meteor.y);
      context.lineTo(meteor.x - meteor.length * 0.45, meteor.y - meteor.length);
      context.stroke();
    });
    if (frame < 70) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  };
  draw();
}

function orbit() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:35;';
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  if (!context) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.scale(dpr, dpr);
  const cx = width / 2;
  const cy = height * 0.55;
  const sparks = Array.from({ length: 16 }, (_, index) => ({
    angle: (index / 16) * Math.PI * 2,
    hue: Math.floor((index / 16) * 360),
  }));

  const reach = Math.hypot(width / 2, height / 2);
  const frames = 84;
  let frame = 0;
  const draw = () => {
    frame += 1;
    const spin = frame * 0.2;
    const radius = 20 + (frame / frames) * reach;
    context.clearRect(0, 0, width, height);
    sparks.forEach((spark) => {
      const angle = spark.angle + spin;
      context.beginPath();
      context.fillStyle = `hsl(${spark.hue}, 95%, 62%)`;
      context.arc(
        cx + Math.cos(angle) * radius,
        cy + Math.sin(angle) * radius,
        5,
        0,
        Math.PI * 2
      );
      context.fill();
    });
    if (frame < frames) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  };
  draw();
}

const runners: Record<WildAnimationId, () => void> = {
  confetti: () => {
    playSound('pop');
    confetti({
      particleCount: 140,
      spread: 80,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.65 },
      scalar: 1.1,
      zIndex: 35,
      disableForReducedMotion: false,
    });
    shakeStage([
      { scale: 1.08, duration: 0.12, ease: 'power2.out' },
      { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)' },
    ]);
  },
  fireworks: () => {
    playSound('whizz');
    const origins = [
      { x: 0.2, y: 0.7 },
      { x: 0.8, y: 0.65 },
      { x: 0.5, y: 0.35 },
    ];
    origins.forEach((origin, index) => {
      window.setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 360,
          startVelocity: 30,
          origin,
          ticks: 90,
          gravity: 0.7,
          colors: ['#ff4fd8', '#ffe14a', '#4dfff3', '#ffffff'],
          zIndex: 35,
          disableForReducedMotion: false,
        });
        if (index === origins.length - 1) playSound('bang');
      }, index * 160);
    });
  },
  bubbles: () => {
    playSound('pop');
    window.setTimeout(() => playSound('pop'), 120);
    window.setTimeout(() => playSound('pop'), 240);
    bubbleFountain();
  },
  jelly: () => {
    playSound('boing');
    shakeStage([
      { scaleX: 1.5, scaleY: 0.55, duration: 0.1, ease: 'power2.out' },
      { scaleX: 0.68, scaleY: 1.45, duration: 0.12, ease: 'power2.inOut' },
      { scaleX: 1.28, scaleY: 0.78, duration: 0.1 },
      { scaleX: 0.88, scaleY: 1.16, duration: 0.1 },
      { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1.8, 0.28)' },
    ]);
  },
  sink: () => {
    playSound('whizz');
    window.setTimeout(() => playSound('bang'), 180);
    window.setTimeout(() => playSound('pop'), 280);
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { x: 0.5, y: 0.7 },
      zIndex: 35,
      disableForReducedMotion: false,
    });
    bubbleFountain();
    shakeStage([
      { x: -12, rotation: -4, duration: 0.06 },
      { x: 12, rotation: 4, duration: 0.06 },
      { x: 0, rotation: 0, scale: 1.05, duration: 0.1 },
      { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' },
    ]);
  },
  shockwave: () => {
    playSound('bang');
    shockwave();
    shakeStage([
      { scale: 0.94, duration: 0.08 },
      { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.55)' },
    ]);
  },
  meteors: () => {
    playSound('whizz');
    meteorShower();
  },
  yoyo: () => {
    playSound('boing');
    shakeStage([
      { y: 90, duration: 0.18, ease: 'power2.in' },
      { y: -28, duration: 0.22, ease: 'power2.out' },
      { y: 10, duration: 0.14 },
      { y: 0, duration: 0.28, ease: 'elastic.out(1, 0.45)' },
    ]);
  },
  crossfire: () => {
    playSound('pop');
    window.setTimeout(() => playSound('pop'), 140);
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.65 },
      startVelocity: 55,
      zIndex: 35,
      disableForReducedMotion: false,
    });
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.65 },
      startVelocity: 55,
      zIndex: 35,
      disableForReducedMotion: false,
    });
  },
  orbit: () => {
    playSound('whizz');
    window.setTimeout(() => playSound('pop'), 420);
    orbit();
  },
};

export function runWildAnimation(id: WildAnimationId) {
  runners[id]();
}

export function playRandomWildAnimation() {
  const index = Math.floor(Math.random() * WILD_ANIMATIONS.length);
  runWildAnimation(WILD_ANIMATIONS[index].id);
}
