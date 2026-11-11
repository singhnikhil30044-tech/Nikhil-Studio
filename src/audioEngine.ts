// Web Audio Engine for Real-Time Sound Generation & Track Visualizer

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentOscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeTrackTitle: string | null = null;
  private timerId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
      
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTrack(track: { title: string; bpm: number; synthToneFreq?: number; waveType?: OscillatorType }) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    this.isPlaying = true;
    this.activeTrackTitle = track.title;
    
    // Musical arpeggiator / chord progression generator based on base freq
    const baseFreq = track.synthToneFreq || 330;
    const intervals = [1, 1.25, 1.5, 1.875, 2]; // Major 7th arpeggio ratios
    const waveType: OscillatorType = track.waveType || 'sine';

    let step = 0;
    const tempoInterval = (60 / track.bpm) * 500; // 8th notes

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;

      // Stop previous
      this.currentOscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (_) {}
      });
      this.currentOscillators = [];

      const osc = this.ctx.createOscillator();
      const oscBass = this.ctx.createOscillator();
      const stepGain = this.ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(baseFreq * intervals[step % intervals.length], this.ctx.currentTime);

      oscBass.type = 'triangle';
      oscBass.frequency.setValueAtTime(baseFreq * 0.5, this.ctx.currentTime);

      stepGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      stepGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (tempoInterval / 1000) * 0.9);

      osc.connect(stepGain);
      oscBass.connect(stepGain);
      stepGain.connect(this.gainNode);

      osc.start();
      oscBass.start();
      osc.stop(this.ctx.currentTime + tempoInterval / 1000);
      oscBass.stop(this.ctx.currentTime + tempoInterval / 1000);

      this.currentOscillators.push(osc, oscBass);
      step++;

      this.timerId = window.setTimeout(playChordStep, tempoInterval);
    };

    playChordStep();
  }

  stop() {
    this.isPlaying = false;
    this.activeTrackTitle = null;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (_) {}
    });
    this.currentOscillators = [];
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getActiveTrackTitle(): string | null {
    return this.activeTrackTitle;
  }

  getFrequencyData(array: Uint8Array) {
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  playBeep(freq = 880, duration = 0.1) {
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

export const audioEngine = new StudioAudioEngine();
