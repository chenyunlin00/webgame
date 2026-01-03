export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private bgmVolume: number = 0.5;
  private sfxVolume: number = 0.6;

  private constructor() {
    // Initialize AudioContext on user interaction if possible, 
    // but here we just prepare the class.
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = muted;
    }
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  public playBGM(url: string) {
    if (this.isMuted) return;

    // If already playing the same URL, do nothing
    if (this.bgmAudio && this.bgmAudio.src === url && !this.bgmAudio.paused) {
      return;
    }

    this.stopBGM();

    this.bgmAudio = new Audio(url);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this.bgmVolume;
    this.bgmAudio.muted = this.isMuted;
    
    this.bgmAudio.play().catch(e => {
      console.warn('BGM play failed (likely due to autoplay policy):', e);
    });
  }

  public stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
      this.bgmAudio = null;
    }
  }

  public fadeOutBGM(duration: number = 1000) {
    if (!this.bgmAudio) return;
    
    const originalVolume = this.bgmAudio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volStep = originalVolume / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      if (!this.bgmAudio) {
        clearInterval(interval);
        return;
      }
      
      currentStep++;
      const newVol = Math.max(0, originalVolume - (volStep * currentStep));
      this.bgmAudio.volume = newVol;

      if (currentStep >= steps) {
        clearInterval(interval);
        this.stopBGM();
      }
    }, stepTime);
  }

  // --- Procedural SFX using Web Audio API ---

  private ensureAudioContext() {
    if (!this.audioContext) return false;
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return true;
  }

  public playAttackSound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // "Swoosh" / Hit sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    
    gain.gain.setValueAtTime(this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playHitSound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // Punchy noise-like sound (approximated with square wave drop)
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    
    gain.gain.setValueAtTime(this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playFleeSound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // Rising pitch "Zip" sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.2);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.5, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.2);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  public playVictorySound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    
    // Arpeggio
    const notes = [440, 554, 659, 880]; // A Major
    notes.forEach((freq, i) => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext!.destination);

        const startTime = t + (i * 0.1);
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(this.sfxVolume * 0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
    });
  }

  public playDefeatSound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // Low sad tone
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(50, t + 1.0);
    
    gain.gain.setValueAtTime(this.sfxVolume, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 1.0);

    osc.start(t);
    osc.stop(t + 1.0);
  }

  public playEatSound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    
    // Simulate crunch with short noise bursts
    const bufferSize = this.audioContext.sampleRate * 0.1; // 0.1s
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    // Play 3 short bursts
    for(let i=0; i<3; i++) {
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        const gain = this.audioContext.createGain();
        
        // Lowpass filter to make it sound more like food crunch than static
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        const startTime = t + (i * 0.1);
        gain.gain.setValueAtTime(this.sfxVolume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
        
        noise.start(startTime);
        noise.stop(startTime + 0.05);
    }
  }

  public playDrinkSound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    
    // Simulate gulp with pitch dropping sine wave
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(300, t + 0.15);
    
    gain.gain.setValueAtTime(this.sfxVolume, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.15);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playHealSound() {
    if (this.isMuted || !this.ensureAudioContext()) return;
    if (!this.audioContext) return;

    const t = this.audioContext.currentTime;
    
    // Gentle ascending sine waves
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.5);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(this.sfxVolume, t + 0.1);
    gain.gain.linearRampToValueAtTime(0, t + 0.5);

    osc.start(t);
    osc.stop(t + 0.5);
  }
}

export const soundManager = SoundManager.getInstance();
