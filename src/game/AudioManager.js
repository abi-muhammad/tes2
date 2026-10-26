/**
 * AudioManager
 * Pure Web Audio API procedural sound synthesizer and Web Speech API Indonesian teacher voice.
 * Requires 0 external audio files, completely self-contained and zero latency!
 */
export class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmInterval = null;
    this.speechAvailable = 'speechSynthesis' in window;
    this.teacherVoice = null;

    if (this.speechAvailable) {
      this.initVoices();
    }
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initVoices() {
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for Indonesian male or generic Indonesian voice
      this.teacherVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID')) || null;
    };

    pickVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgmPlaying) {
      this.stopBGM();
    } else if (!this.isMuted && !this.bgmPlaying) {
      this.startBGM();
    }
    return this.isMuted;
  }

  playCoinSound() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playJumpSound() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playSlideSound() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // White noise swoosh for sliding on tiles
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  playHitSound() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  playPowerupSound() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = now + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playGameOverSound() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Sad comedic trombone slide
    const notes = [311.13, 293.66, 277.18, 261.63]; // Eb4, D4, Db4, C4
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = now + idx * 0.25;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  /**
   * Indonesian Teacher voice line shouts!
   */
  shoutTeacher(text) {
    if (this.isMuted) return;

    if (this.speechAvailable && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'id-ID';
      utter.rate = 1.25; // Energetic chase pace
      utter.pitch = 0.85; // Deep teacher voice
      if (this.teacherVoice) {
        utter.voice = this.teacherVoice;
      }
      window.speechSynthesis.speak(utter);
    } else {
      // Fallback whistle/shout tone
      this.playHitSound();
    }
  }

  /**
   * Procedural Upbeat Comedy Arcade BGM (132 BPM Indonesian school vibe)
   */
  startBGM() {
    if (this.isMuted || this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;

    // Bassline and melody notes (C Major pentatonic comedy bounce)
    const melodyNotes = [
      523.25, 587.33, 659.25, 783.99,
      659.25, 587.33, 523.25, 392.00,
      523.25, 659.25, 783.99, 880.00,
      783.99, 659.25, 587.33, 523.25
    ];

    const bassNotes = [
      130.81, 130.81, 164.81, 164.81,
      174.61, 174.61, 196.00, 196.00
    ];

    let step = 0;
    const intervalMs = (60 / 132 / 2) * 1000; // Sixteenth note pace

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.bgmPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Drum / Hi-hat click
      if (step % 2 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(120, now);
        kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
        kickGain.gain.setValueAtTime(0.2, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.09);
      }

      // 2. Bass note
      if (step % 4 === 0) {
        const bassFreq = bassNotes[(step / 4) % bassNotes.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassGain.gain.setValueAtTime(0.18, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.18);
      }

      // 3. Cheerful Marimba / Synth Melody
      const melFreq = melodyNotes[step % melodyNotes.length];
      const melOsc = this.ctx.createOscillator();
      const melGain = this.ctx.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(melFreq, now);
      melGain.gain.setValueAtTime(0.1, now);
      melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      melOsc.connect(melGain);
      melGain.connect(this.ctx.destination);
      melOsc.start(now);
      melOsc.stop(now + 0.12);

      step++;
    }, intervalMs);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}
