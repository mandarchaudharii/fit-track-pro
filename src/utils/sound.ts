let ctx: AudioContext | null = null;

export function playBeep({
  frequency = 880,
  durationMs = 180,
  volume = 0.15,
}: {
  frequency?: number;
  durationMs?: number;
  volume?: number;
} = {}) {
  try {
    ctx = ctx ?? new (window.AudioContext || (window as any).webkitAudioContext)();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;

    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.start(now);
    osc.stop(now + durationMs / 1000);

    // quick fade-out to avoid clicks
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  } catch {
    // ignore audio errors (e.g. autoplay policies)
  }
}
