import Phaser from 'phaser';
import { COLORS } from '../data/constants';
import { SoundManager } from '../audio/SoundManager';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        window.soundManager = new SoundManager();

        const { width, height } = this.scale;
        const barWidth = Math.min(400, width * 0.6);
        const barY = height / 2;

        this.add.text(width / 2, barY - 60, 'BUG KITCHEN', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            color: COLORS.TEXT_ACCENT,
            fontStyle: 'bold',
        }).setOrigin(0.5);

        const loadingText = this.add.text(width / 2, barY - 20, 'Preparing the kitchen...', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#888888',
        }).setOrigin(0.5);

        const barBg = this.add.graphics();
        barBg.fillStyle(0x3d2a1a, 1);
        barBg.fillRoundedRect((width - barWidth) / 2, barY, barWidth, 16, 4);

        this._generateTextures();
    }

    _generateTextures() {
        // === PLAYER — kitchen defender ===
        this._drawPlayer();

        // === ENEMIES (Bug Kitchen) ===
        this._drawCockroach();
        this._drawFly();
        this._drawMoth();
        this._drawBeetle();
        this._drawHornet();

        // === BOSSES ===
        this._drawBoss('boss_cockroachQueen', 50, 0x8b4513, 0x6b3410);
        this._drawBoss('boss_giantMutantFly', 55, 0x3d6b35, 0x2d5025);
        this._drawBoss('boss_fridgeMonster', 60, 0xd0d0d0, 0xa0a0a0);

        // === PROJECTILES ===
        this._drawProjectile('proj_sprayCan', 6, 0x7ab648);
        this._drawProjectile('proj_bugZapper', 5, 0xf2c94c);
        this._drawProjectile('proj_steam', 7, 0xdedede);
        this._drawSlipper(); // custom drawn signature hook
        this._drawProjectile('proj_poisonBomb', 14, 0x9b59b6);

        // === CRUMB PICKUP ===
        this._drawCrumb();

        // === PARTICLES ===
        this._drawParticle('particle', 4, 0xffffff);
        this._drawParticle('particle_small', 2, 0xffffff);

        // === UI ===
        this._createRectTexture('button', 200, 50, COLORS.UI_BG, COLORS.UI_BORDER);
        this._createRectTexture('card_bg', 180, 240, COLORS.UI_BG, COLORS.UI_BORDER);
    }

    _drawPlayer() {
        const s = 40;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Body (apron / torso)
        g.fillStyle(0xf5e6c8, 1); // skin tone
        g.fillRoundedRect(cx - 7, cy - 6, 14, 14, 3);

        // Apron overlay
        g.fillStyle(0xffffff, 0.9);
        g.fillRoundedRect(cx - 5, cy - 2, 10, 10, 2);
        // Apron pocket
        g.fillStyle(0xe8e8e8, 0.8);
        g.fillRoundedRect(cx - 3, cy + 2, 6, 4, 1);

        // Head
        g.fillStyle(0xf0c8a0, 1); // skin
        g.fillCircle(cx, cy - 8, 5);

        // Hair
        g.fillStyle(0x5c3a1e, 1);
        g.fillEllipse(cx, cy - 11, 10, 5);

        // Eyes
        g.fillStyle(0x000000, 1);
        g.fillCircle(cx - 2, cy - 8, 1.2);
        g.fillCircle(cx + 2, cy - 8, 1.2);

        // Arms
        g.fillStyle(0xf0c8a0, 1);
        g.fillRoundedRect(cx - 11, cy - 3, 4, 10, 2);
        g.fillRoundedRect(cx + 7, cy - 3, 4, 10, 2);

        // Legs
        g.fillStyle(0x4a6741, 1); // pants
        g.fillRoundedRect(cx - 5, cy + 8, 4, 5, 2);
        g.fillRoundedRect(cx + 1, cy + 8, 4, 5, 2);

        // Slippers!
        g.fillStyle(0xd94f3d, 1); // red slippers
        g.fillRoundedRect(cx - 6, cy + 13, 5, 3, 1);
        g.fillRoundedRect(cx + 1, cy + 13, 5, 3, 1);

        g.generateTexture('player', s, s);
        g.destroy();
    }

    _drawCockroach() {
        const s = 28;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Body — much flatter/longer to look like a fast running roach
        g.fillStyle(0x6b4226, 1);
        g.fillEllipse(cx, cy, 22, 14);

        // Darker shell
        g.fillStyle(0x4a2e1a, 0.7);
        g.fillEllipse(cx, cy - 1, 18, 10);

        // Antennae
        g.lineStyle(1.5, 0x4a2e1a, 0.8);
        g.lineBetween(cx - 4, cy - 6, cx - 9, cy - 12);
        g.lineBetween(cx + 4, cy - 6, cx + 9, cy - 12);

        // Legs (3 per side)
        g.lineStyle(1, 0x4a2e1a, 0.7);
        g.lineBetween(cx - 11, cy - 2, cx - 14, cy - 5);
        g.lineBetween(cx - 12, cy, cx - 15, cy);
        g.lineBetween(cx - 11, cy + 2, cx - 14, cy + 5);
        g.lineBetween(cx + 11, cy - 2, cx + 14, cy - 4);
        g.lineBetween(cx + 12, cy, cx + 15, cy);
        g.lineBetween(cx + 11, cy + 2, cx + 14, cy + 5);

        // Eyes (small dots)
        g.fillStyle(0x000000, 1);
        g.fillCircle(cx - 4, cy - 5, 1);
        g.fillCircle(cx + 4, cy - 5, 1);

        g.generateTexture('enemy_cockroach', s, s);
        g.destroy();
    }

    _drawFly() {
        const s = 30;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Wings (translucent, much wider for buzzing look)
        g.fillStyle(0xaaccee, 0.4);
        g.fillEllipse(cx - 8, cy - 2, 12, 10);
        g.fillEllipse(cx + 8, cy - 2, 12, 10);

        // Body — small round
        g.fillStyle(0x4a6741, 1);
        g.fillEllipse(cx, cy, 8, 12);

        // Head
        g.fillStyle(0x3a5531, 1);
        g.fillCircle(cx, cy - 7, 4);

        // Big compound eyes
        g.fillStyle(0xcc3333, 0.9);
        g.fillCircle(cx - 3, cy - 8, 2.5);
        g.fillCircle(cx + 3, cy - 8, 2.5);

        // Highlights on eyes
        g.fillStyle(0xffffff, 0.4);
        g.fillCircle(cx - 3.5, cy - 8.5, 1);
        g.fillCircle(cx + 2.5, cy - 8.5, 1);

        g.generateTexture('enemy_fly', s, s);
        g.destroy();
    }

    _drawMoth() {
        const s = 28;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Wings — huge and drifting
        g.fillStyle(0xc9b896, 0.6);
        g.fillEllipse(cx - 10, cy, 16, 18);
        g.fillEllipse(cx + 10, cy, 16, 18);

        // Wing pattern dots
        g.fillStyle(0xa09070, 0.5);
        g.fillCircle(cx - 7, cy - 2, 3);
        g.fillCircle(cx + 7, cy - 2, 3);

        // Body — thin  
        g.fillStyle(0x8a7a60, 1);
        g.fillEllipse(cx, cy, 5, 12);

        // Antennae (feathery)
        g.lineStyle(1, 0x8a7a60, 0.6);
        g.lineBetween(cx - 1, cy - 6, cx - 5, cy - 12);
        g.lineBetween(cx + 1, cy - 6, cx + 5, cy - 12);

        // Eyes
        g.fillStyle(0x000000, 0.8);
        g.fillCircle(cx - 1, cy - 5, 1);
        g.fillCircle(cx + 1, cy - 5, 1);

        g.generateTexture('enemy_moth', s, s);
        g.destroy();
    }

    _drawBeetle() {
        const s = 36;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Large bulky shell (tank identity)
        g.fillStyle(0x2d2d2d, 1);
        g.fillEllipse(cx, cy, 26, 24);

        // Shell line (center)
        g.lineStyle(1.5, 0x1a1a1a, 0.6);
        g.lineBetween(cx, cy - 8, cx, cy + 8);

        // Shell sheen
        g.fillStyle(0x444444, 0.4);
        g.fillEllipse(cx - 3, cy - 2, 8, 10);

        // Head
        g.fillStyle(0x222222, 1);
        g.fillCircle(cx, cy - 10, 5);

        // Mandibles
        g.fillStyle(0x3d3d3d, 1);
        g.fillTriangle(cx - 4, cy - 11, cx - 7, cy - 15, cx - 1, cy - 13);
        g.fillTriangle(cx + 4, cy - 11, cx + 7, cy - 15, cx + 1, cy - 13);

        // Eyes
        g.fillStyle(0xffffff, 0.7);
        g.fillCircle(cx - 3, cy - 10, 1.5);
        g.fillCircle(cx + 3, cy - 10, 1.5);

        // Legs
        g.lineStyle(1.5, 0x2d2d2d, 0.8);
        g.lineBetween(cx - 8, cy - 3, cx - 14, cy - 7);
        g.lineBetween(cx - 9, cy, cx - 15, cy);
        g.lineBetween(cx - 8, cy + 3, cx - 14, cy + 7);
        g.lineBetween(cx + 8, cy - 3, cx + 14, cy - 7);
        g.lineBetween(cx + 9, cy, cx + 15, cy);
        g.lineBetween(cx + 8, cy + 3, cx + 14, cy + 7);

        g.generateTexture('enemy_beetle', s, s);
        g.destroy();
    }

    _drawHornet() {
        const s = 30;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Wings
        g.fillStyle(0xddeeff, 0.35);
        g.fillEllipse(cx - 7, cy - 4, 10, 12);
        g.fillEllipse(cx + 7, cy - 4, 10, 12);

        // Body segments — yellow and black stripes
        g.fillStyle(0xe8b520, 1);
        g.fillEllipse(cx, cy, 10, 16);

        // Black stripes
        g.fillStyle(0x222222, 0.9);
        g.fillRect(cx - 5, cy - 3, 10, 2);
        g.fillRect(cx - 5, cy + 1, 10, 2);
        g.fillRect(cx - 4, cy + 5, 8, 2);

        // Head
        g.fillStyle(0xe8b520, 1);
        g.fillCircle(cx, cy - 8, 4);

        // Eyes
        g.fillStyle(0x000000, 1);
        g.fillCircle(cx - 2, cy - 9, 1.5);
        g.fillCircle(cx + 2, cy - 9, 1.5);

        // Stinger
        g.fillStyle(0x222222, 1);
        g.fillTriangle(cx, cy + 8, cx - 1, cy + 12, cx + 1, cy + 12);

        g.generateTexture('enemy_hornet', s, s);
        g.destroy();
    }

    _drawBoss(key, radius, color1, color2) {
        const s = radius * 2 + 20;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Aura layers
        g.fillStyle(color1, 0.05);
        g.fillCircle(cx, cy, radius + 8);
        g.fillStyle(color1, 0.1);
        g.fillCircle(cx, cy, radius + 4);
        g.fillStyle(color1, 0.15);
        g.fillCircle(cx, cy, radius);

        // Core body
        g.fillStyle(color2, 1);
        g.fillRoundedRect(cx - radius * 0.6, cy - radius * 0.5, radius * 1.2, radius * 1.1, radius * 0.2);

        // Shell
        g.fillStyle(color1, 0.7);
        g.fillRoundedRect(cx - radius * 0.4, cy - radius * 0.35, radius * 0.8, radius * 0.8, radius * 0.15);

        // Antennae / horns
        g.fillStyle(color2, 1);
        g.fillTriangle(cx - radius * 0.3, cy - radius * 0.5, cx - radius * 0.5, cy - radius * 0.9, cx - radius * 0.1, cy - radius * 0.6);
        g.fillTriangle(cx + radius * 0.3, cy - radius * 0.5, cx + radius * 0.5, cy - radius * 0.9, cx + radius * 0.1, cy - radius * 0.6);

        // Eyes
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - radius * 0.15, cy - radius * 0.1, radius * 0.1);
        g.fillCircle(cx + radius * 0.15, cy - radius * 0.1, radius * 0.1);
        g.fillStyle(0xff0000, 1);
        g.fillCircle(cx - radius * 0.15, cy - radius * 0.1, radius * 0.05);
        g.fillCircle(cx + radius * 0.15, cy - radius * 0.1, radius * 0.05);

        // Mandibles
        g.fillStyle(0x000000, 0.5);
        g.fillRoundedRect(cx - radius * 0.2, cy + radius * 0.05, radius * 0.4, radius * 0.15, 3);

        // Legs/arms
        g.fillStyle(color2, 0.9);
        g.fillRoundedRect(cx - radius * 0.9, cy - radius * 0.2, radius * 0.3, radius * 0.7, 5);
        g.fillRoundedRect(cx + radius * 0.6, cy - radius * 0.2, radius * 0.3, radius * 0.7, 5);

        g.generateTexture(key, s, s);
        g.destroy();
    }

    _drawProjectile(key, size, color) {
        const s = size * 4;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Outer glow
        g.fillStyle(color, 0.1);
        g.fillCircle(cx, cy, size * 1.8);
        g.fillStyle(color, 0.2);
        g.fillCircle(cx, cy, size * 1.3);

        // Core
        g.fillStyle(color, 0.9);
        g.fillCircle(cx, cy, size);

        // Bright center
        g.fillStyle(0xffffff, 0.7);
        g.fillCircle(cx, cy, size * 0.4);

        g.generateTexture(key, s, s);
        g.destroy();
    }

    _drawSlipper() {
        const s = 30;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Big bouncy red slipper
        g.fillStyle(0xd94f3d, 1);
        g.fillRoundedRect(cx - 8, cy - 12, 16, 24, 6);

        // Dark sole edge
        g.fillStyle(0x8a2f22, 0.8);
        g.fillRoundedRect(cx - 8, cy + 10, 16, 4, 2);

        // Slipper strap
        g.fillStyle(0xffffff, 0.9);
        g.fillRoundedRect(cx - 9, cy - 4, 18, 6, 2);

        // Star / shine effect
        g.fillStyle(0xffffff, 0.6);
        g.fillCircle(cx - 4, cy - 8, 2);

        g.generateTexture('proj_slipper', s, s);
        g.destroy();
    }

    _drawCrumb() {
        const s = 16;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Glow
        g.fillStyle(0xf2c94c, 0.15);
        g.fillCircle(cx, cy, 7);

        // Crumb shape (irregular small blob)
        g.fillStyle(0xf2c94c, 0.9);
        g.fillCircle(cx - 1, cy, 3);
        g.fillCircle(cx + 1, cy - 1, 2.5);
        g.fillCircle(cx, cy + 1, 2);

        // Highlight
        g.fillStyle(0xffffff, 0.4);
        g.fillCircle(cx - 1, cy - 1, 1.5);

        g.generateTexture('xp_orb', s, s);
        g.destroy();
    }

    _drawParticle(key, size, color) {
        const s = size * 3;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(color, 0.3);
        g.fillCircle(s / 2, s / 2, size * 1.2);
        g.fillStyle(color, 0.8);
        g.fillCircle(s / 2, s / 2, size);
        g.generateTexture(key, s, s);
        g.destroy();
    }

    _createRectTexture(key, w, h, fillColor, borderColor) {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(fillColor, 0.9);
        g.fillRoundedRect(0, 0, w, h, 8);
        g.lineStyle(2, borderColor, 1);
        g.strokeRoundedRect(0, 0, w, h, 8);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    create() {
        this.scene.start('MenuScene');
    }
}
