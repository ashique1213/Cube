// Procedural sound synthesizer for Rubik's Cube interactions using Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic mechanical plastic click / friction swish
  playTurn() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;

      // 1. Noise burst for plastic sliding friction
      const bufferSize = this.ctx.sampleRate * 0.05; // 50ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(3.0, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(t);

      // 2. Tactile "thud/snap" detent at the end
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.04);

      oscGain.gain.setValueAtTime(0.25, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // AudioContext might be blocked before first user interaction
    }
  }

  // Celebratory melodic chime for step 10 completion
  playVictory() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      const t = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const noteTime = t + index * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.6);
      });
    } catch {
      // ignored
    }
  }
}

export const soundEngine = new SoundEngine();
