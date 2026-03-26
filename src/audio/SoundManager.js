/**
 * Procedural sound effects using ZzFX-style Web Audio API synthesis
 */
export class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.3;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio not supported');
            this.enabled = false;
        }
    }

    ensureContext() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type) {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        switch (type) {
            case 'shoot': this._shoot(); break;
            case 'hit': this._hit(); break;
            case 'kill': this._kill(); break;
            case 'pickup': this._pickup(); break;
            case 'levelup': this._levelUp(); break;
            case 'death': this._death(); break;
            case 'boss': this._boss(); break;
            case 'select': this._select(); break;
            case 'explosion': this._explosion(); break;
            case 'lightning': this._lightning(); break;
            default: break;
        }
    }

    _createOsc(freq, type, duration, vol = 1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(this.volume * vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    _createNoise(duration, vol = 1) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.volume * vol * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
    }

    _shoot() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    _hit() {
        this._createNoise(0.05, 0.4);
        this._createOsc(200, 'square', 0.05, 0.2);
    }

    _kill() {
        this._createNoise(0.15, 0.5);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    _pickup() {
        this._createOsc(600, 'sine', 0.08, 0.3);
        setTimeout(() => this._createOsc(900, 'sine', 0.08, 0.3), 50);
    }

    _levelUp() {
        const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
            setTimeout(() => this._createOsc(freq, 'sine', 0.15, 0.4), i * 80);
        });
    }

    _death() {
        this._createNoise(0.5, 0.6);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.8);
    }

    _boss() {
        const notes = [150, 120, 100, 80];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this._createOsc(freq, 'sawtooth', 0.3, 0.5);
                this._createNoise(0.1, 0.3);
            }, i * 200);
        });
    }

    _select() {
        this._createOsc(440, 'sine', 0.05, 0.2);
        setTimeout(() => this._createOsc(660, 'sine', 0.05, 0.2), 30);
    }

    _explosion() {
        this._createNoise(0.4, 0.7);
        this._createOsc(80, 'sine', 0.3, 0.5);
    }

    _lightning() {
        this._createNoise(0.08, 0.6);
        this._createOsc(2000, 'square', 0.03, 0.2);
        setTimeout(() => {
            this._createNoise(0.06, 0.4);
            this._createOsc(1500, 'square', 0.03, 0.15);
        }, 50);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}
