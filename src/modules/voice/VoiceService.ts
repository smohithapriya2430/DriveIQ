// ============================================================
// DriveIQ – Voice Co-Pilot Service
// Uses browser SpeechSynthesis API
// ============================================================

export class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private enabled: boolean = true;
  private volume: number = 0.8;
  private rate: number = 1.0;
  private pitch: number = 1.0;
  private lang: string = 'en-US';
  private voiceName: string = '';
  private queue: string[] = [];
  private speaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  setEnabled(v: boolean) { this.enabled = v; }
  setVolume(v: number) { this.volume = Math.max(0, Math.min(1, v)); }
  setRate(r: number) { this.rate = Math.max(0.5, Math.min(2, r)); }
  setPitch(p: number) { this.pitch = Math.max(0.5, Math.min(2, p)); }
  setLang(l: string) { this.lang = l; }
  setVoiceName(n: string) { this.voiceName = n; }

  speak(text: string, priority: boolean = false) {
    if (!this.enabled || !this.synth) return;

    if (priority) {
      this.synth.cancel();
      this.queue = [];
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.volume;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.lang = this.lang;

    // Try to find requested voice
    if (this.voiceName) {
      const voices = this.synth.getVoices();
      const found = voices.find(v => v.name.includes(this.voiceName));
      if (found) utterance.voice = found;
    }

    utterance.onend = () => {
      this.speaking = false;
      this.processQueue();
    };

    if (priority || !this.speaking) {
      this.speaking = true;
      this.synth.speak(utterance);
    } else {
      this.queue.push(text);
    }
  }

  private processQueue() {
    if (this.queue.length === 0) return;
    const next = this.queue.shift()!;
    this.speak(next);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.queue = [];
      this.speaking = false;
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synth?.getVoices() ?? [];
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }
}

// Singleton instance
export const voiceService = new VoiceService();
