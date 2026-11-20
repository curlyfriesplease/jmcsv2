import { Howl, Howler } from 'howler';

type SoundName = 'pop' | 'whizz' | 'bang' | 'boing' | 'tick';

const SAMPLE_RATE = 22050;

function encodeWav(samples: Float32Array): string {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const write = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  write(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1, offset += 2) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function tone(
  seconds: number,
  sampleAt: (time: number) => number
): string {
  const length = Math.floor(SAMPLE_RATE * seconds);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    samples[i] = sampleAt(i / SAMPLE_RATE);
  }
  return encodeWav(samples);
}

const sources: Record<SoundName, string> = {
  pop: tone(0.14, (t) => {
    const env = Math.exp(-t * 28);
    return Math.sin(2 * Math.PI * (680 - t * 2400) * t) * env * 0.8;
  }),
  whizz: tone(0.38, (t) => {
    const env = Math.sin(Math.PI * Math.min(1, t / 0.38)) * Math.exp(-t * 3);
    const freq = 240 + t * 4200;
    return (Math.sin(2 * Math.PI * freq * t) * 0.55 + (Math.random() * 2 - 1) * 0.15) * env;
  }),
  bang: tone(0.42, (t) => {
    const env = Math.exp(-t * 8);
    const noise = Math.random() * 2 - 1;
    return (noise * 0.85 + Math.sin(2 * Math.PI * 70 * t) * 0.45) * env;
  }),
  boing: tone(0.45, (t) => {
    const env = Math.exp(-t * 5);
    const freq = 180 + Math.sin(t * 42) * 90 + (1 - Math.min(1, t / 0.45)) * 220;
    return Math.sin(2 * Math.PI * freq * t) * env * 0.75;
  }),
  tick: tone(0.06, (t) => {
    const env = Math.exp(-t * 60);
    return (Math.random() * 2 - 1) * env * 0.7;
  }),
};

const library: Record<SoundName, Howl> = {
  pop: new Howl({ src: [sources.pop], format: ['wav'], volume: 0.45 }),
  whizz: new Howl({ src: [sources.whizz], format: ['wav'], volume: 0.35 }),
  bang: new Howl({ src: [sources.bang], format: ['wav'], volume: 0.5 }),
  boing: new Howl({ src: [sources.boing], format: ['wav'], volume: 0.4 }),
  tick: new Howl({ src: [sources.tick], format: ['wav'], volume: 0.3 }),
};

let unlocked = false;

function unlock() {
  if (unlocked) return;
  unlocked = true;
  const ctx = Howler.ctx;
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume();
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { passive: true });
}

export function playSound(name: SoundName) {
  unlock();
  library[name].play();
}
