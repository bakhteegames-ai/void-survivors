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

        this.add.text(width / 2, barY - 60, 'VOID SURVIVORS', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            color: COLORS.TEXT_GLOW,
            fontStyle: 'bold',
        }).setOrigin(0.5);

        const loadingText = this.add.text(width / 2, barY - 20, 'Generating world...', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#888888',
        }).setOrigin(0.5);

        const barBg = this.add.graphics();
        barBg.fillStyle(0x222233, 1);
        barBg.fillRoundedRect((width - barWidth) / 2, barY, barWidth, 16, 4);

        this._generateTextures();
    }

    _generateTextures() {
        // === PLAYER — cyber warrior ===
        this._drawPlayer();

        // === ENEMIES ===
        this._drawSlime();
        this._drawSkeleton();
        this._drawGhost();
        this._drawGolem();
        this._drawDemon();

        // === BOSSES ===
        this._drawBoss('boss_voidLord', 50, 0xff00ff, 0xcc00cc);
        this._drawBoss('boss_deathKnight', 55, 0x8800aa, 0x6600aa);
        this._drawBoss('boss_ancientDragon', 60, 0xff8800, 0xcc5500);

        // === PROJECTILES ===
        this._drawProjectile('proj_energyBall', 6, 0x00ffff);
        this._drawProjectile('proj_lightning', 5, 0xffff00);
        this._drawProjectile('proj_fireball', 7, 0xff4400);
        this._drawProjectile('proj_shield', 10, 0x4488ff);
        this._drawProjectile('proj_meteor', 14, 0xff8800);

        // === XP ORB — diamond shape with glow ===
        this._drawXPOrb();

        // === PARTICLES ===
        this._drawParticle('particle', 4, 0xffffff);
        this._drawParticle('particle_small', 2, 0xffffff);

        // === UI ===
        this._createRectTexture('button', 200, 50, 0x1a1a2e, 0x333366);
        this._createRectTexture('card_bg', 180, 240, 0x1a1a2e, 0x333366);
    }

    _drawPlayer() {
        const s = 40;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Outer glow
        g.fillStyle(0x00ffff, 0.08);
        g.fillCircle(cx, cy, 18);
        g.fillStyle(0x00ffff, 0.15);
        g.fillCircle(cx, cy, 14);

        // Body (rounded rectangle torso)
        g.fillStyle(0x115577, 1);
        g.fillRoundedRect(cx - 7, cy - 6, 14, 14, 3);

        // Armor overlay
        g.fillStyle(0x00cccc, 0.8);
        g.fillRoundedRect(cx - 5, cy - 4, 10, 10, 2);

        // Energy core (center glow)
        g.fillStyle(0x00ffff, 1);
        g.fillCircle(cx, cy + 1, 3);
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(cx, cy + 1, 1.5);

        // Head
        g.fillStyle(0x00dddd, 1);
        g.fillCircle(cx, cy - 8, 5);

        // Eyes (two bright dots)
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - 2, cy - 9, 1.2);
        g.fillCircle(cx + 2, cy - 9, 1.2);

        // Arms
        g.fillStyle(0x00aaaa, 1);
        g.fillRoundedRect(cx - 11, cy - 3, 4, 10, 2);
        g.fillRoundedRect(cx + 7, cy - 3, 4, 10, 2);

        // Legs
        g.fillStyle(0x006688, 1);
        g.fillRoundedRect(cx - 5, cy + 8, 4, 7, 2);
        g.fillRoundedRect(cx + 1, cy + 8, 4, 7, 2);

        // Energy trail hint
        g.fillStyle(0x00ffff, 0.3);
        g.fillCircle(cx, cy + 16, 3);
        g.fillStyle(0x00ffff, 0.15);
        g.fillCircle(cx, cy + 19, 2);

        g.generateTexture('player', s, s);
        g.destroy();
    }

    _drawSlime() {
        const s = 28;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2 + 2;

        // Body — blob shape (ellipse)
        g.fillStyle(0x22aa22, 1);
        g.fillEllipse(cx, cy, 20, 16);

        // Highlights
        g.fillStyle(0x44ff44, 0.6);
        g.fillEllipse(cx - 2, cy - 3, 10, 6);

        // Shine
        g.fillStyle(0xffffff, 0.3);
        g.fillCircle(cx - 3, cy - 4, 2);

        // Eyes
        g.fillStyle(0x000000, 1);
        g.fillCircle(cx - 3, cy - 1, 2);
        g.fillCircle(cx + 3, cy - 1, 2);

        // Pupils
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - 2.5, cy - 1.5, 0.8);
        g.fillCircle(cx + 3.5, cy - 1.5, 0.8);

        // Mouth
        g.lineStyle(1, 0x000000, 0.5);
        g.beginPath();
        g.arc(cx, cy + 2, 3, 0, Math.PI, false);
        g.strokePath();

        g.generateTexture('enemy_slime', s, s);
        g.destroy();
    }

    _drawSkeleton() {
        const s = 30;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Skull
        g.fillStyle(0xddddcc, 1);
        g.fillCircle(cx, cy - 5, 6);

        // Eye sockets
        g.fillStyle(0x000000, 1);
        g.fillCircle(cx - 2.5, cy - 6, 2);
        g.fillCircle(cx + 2.5, cy - 6, 2);

        // Red eyes
        g.fillStyle(0xff0000, 0.8);
        g.fillCircle(cx - 2.5, cy - 6, 1);
        g.fillCircle(cx + 2.5, cy - 6, 1);

        // Jaw
        g.fillStyle(0xccccbb, 1);
        g.fillRect(cx - 4, cy - 1, 8, 3);

        // Teeth
        g.fillStyle(0x000000, 1);
        for (let i = -3; i <= 3; i += 2) {
            g.fillRect(cx + i, cy - 1, 1, 2);
        }

        // Ribcage body
        g.fillStyle(0xbbbbaa, 1);
        g.fillRect(cx - 1, cy + 2, 2, 8);
        // Ribs
        g.lineStyle(1.5, 0xccccbb, 0.8);
        for (let i = 0; i < 3; i++) {
            g.lineBetween(cx - 5, cy + 3 + i * 3, cx + 5, cy + 3 + i * 3);
        }

        // Arms (bones)
        g.lineStyle(2, 0xccccbb, 1);
        g.lineBetween(cx - 5, cy + 3, cx - 9, cy + 9);
        g.lineBetween(cx + 5, cy + 3, cx + 9, cy + 9);

        // Legs
        g.lineBetween(cx - 2, cy + 10, cx - 4, cy + 15);
        g.lineBetween(cx + 2, cy + 10, cx + 4, cy + 15);

        g.generateTexture('enemy_skeleton', s, s);
        g.destroy();
    }

    _drawGhost() {
        const s = 28;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Ghost body — translucent
        g.fillStyle(0x6666ff, 0.15);
        g.fillCircle(cx, cy, 13);

        g.fillStyle(0x8888ff, 0.4);
        g.fillEllipse(cx, cy - 2, 18, 16);

        // Wavy bottom
        g.fillStyle(0x8888ff, 0.35);
        for (let i = -3; i <= 3; i++) {
            g.fillCircle(cx + i * 3, cy + 7, 3);
        }

        // Inner glow
        g.fillStyle(0xaaaaff, 0.3);
        g.fillEllipse(cx, cy - 2, 12, 10);

        // Eyes
        g.fillStyle(0xffffff, 0.9);
        g.fillCircle(cx - 3, cy - 3, 3);
        g.fillCircle(cx + 3, cy - 3, 3);

        // Pupils
        g.fillStyle(0x000033, 1);
        g.fillCircle(cx - 2.5, cy - 3, 1.5);
        g.fillCircle(cx + 3.5, cy - 3, 1.5);

        // Mouth
        g.fillStyle(0x000033, 0.6);
        g.fillEllipse(cx, cy + 2, 4, 3);

        g.generateTexture('enemy_ghost', s, s);
        g.destroy();
    }

    _drawGolem() {
        const s = 36;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Large body
        g.fillStyle(0x665533, 1);
        g.fillRoundedRect(cx - 10, cy - 6, 20, 18, 4);

        // Stone texture cracks
        g.lineStyle(1, 0x443322, 0.5);
        g.lineBetween(cx - 5, cy - 4, cx - 2, cy + 5);
        g.lineBetween(cx + 3, cy - 2, cx + 6, cy + 7);
        g.lineBetween(cx - 7, cy + 3, cx + 1, cy + 2);

        // Head
        g.fillStyle(0x776644, 1);
        g.fillRoundedRect(cx - 7, cy - 14, 14, 10, 3);

        // Glowing eyes
        g.fillStyle(0xff6600, 1);
        g.fillCircle(cx - 3, cy - 10, 2);
        g.fillCircle(cx + 3, cy - 10, 2);
        g.fillStyle(0xffaa00, 0.5);
        g.fillCircle(cx - 3, cy - 10, 3);
        g.fillCircle(cx + 3, cy - 10, 3);

        // Arms (thick)
        g.fillStyle(0x665533, 1);
        g.fillRoundedRect(cx - 15, cy - 4, 6, 14, 3);
        g.fillRoundedRect(cx + 9, cy - 4, 6, 14, 3);

        // Fists
        g.fillStyle(0x776644, 1);
        g.fillCircle(cx - 12, cy + 11, 4);
        g.fillCircle(cx + 12, cy + 11, 4);

        // Legs
        g.fillStyle(0x554422, 1);
        g.fillRoundedRect(cx - 8, cy + 12, 6, 6, 2);
        g.fillRoundedRect(cx + 2, cy + 12, 6, 6, 2);

        g.generateTexture('enemy_golem', s, s);
        g.destroy();
    }

    _drawDemon() {
        const s = 30;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Wings
        g.fillStyle(0x880000, 0.6);
        g.fillTriangle(cx - 12, cy - 2, cx - 5, cy - 8, cx - 3, cy + 2);
        g.fillTriangle(cx + 12, cy - 2, cx + 5, cy - 8, cx + 3, cy + 2);

        // Body
        g.fillStyle(0xcc2222, 1);
        g.fillRoundedRect(cx - 6, cy - 4, 12, 12, 3);

        // Dark chest
        g.fillStyle(0x880000, 0.5);
        g.fillRoundedRect(cx - 4, cy - 2, 8, 6, 2);

        // Head
        g.fillStyle(0xdd3333, 1);
        g.fillCircle(cx, cy - 7, 5);

        // Horns
        g.fillStyle(0x440000, 1);
        g.fillTriangle(cx - 5, cy - 9, cx - 8, cy - 16, cx - 3, cy - 11);
        g.fillTriangle(cx + 5, cy - 9, cx + 8, cy - 16, cx + 3, cy - 11);

        // Eyes
        g.fillStyle(0xffff00, 1);
        g.fillCircle(cx - 2, cy - 8, 1.5);
        g.fillCircle(cx + 2, cy - 8, 1.5);

        // Mouth
        g.fillStyle(0xff6600, 0.8);
        g.fillTriangle(cx - 3, cy - 4, cx + 3, cy - 4, cx, cy - 2);

        // Legs
        g.fillStyle(0xaa1111, 1);
        g.fillRoundedRect(cx - 5, cy + 8, 4, 6, 2);
        g.fillRoundedRect(cx + 1, cy + 8, 4, 6, 2);

        // Fire aura
        g.fillStyle(0xff4400, 0.1);
        g.fillCircle(cx, cy, 14);

        g.generateTexture('enemy_demon', s, s);
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

        // Armor plates
        g.fillStyle(color1, 0.7);
        g.fillRoundedRect(cx - radius * 0.4, cy - radius * 0.35, radius * 0.8, radius * 0.8, radius * 0.15);

        // Crown / Horns
        g.fillStyle(color2, 1);
        g.fillTriangle(cx - radius * 0.3, cy - radius * 0.5, cx - radius * 0.5, cy - radius * 0.9, cx - radius * 0.1, cy - radius * 0.6);
        g.fillTriangle(cx + radius * 0.3, cy - radius * 0.5, cx + radius * 0.5, cy - radius * 0.9, cx + radius * 0.1, cy - radius * 0.6);
        g.fillTriangle(cx, cy - radius * 0.5, cx, cy - radius, cx + radius * 0.1, cy - radius * 0.6);

        // Eyes
        g.fillStyle(0xffffff, 1);
        g.fillCircle(cx - radius * 0.15, cy - radius * 0.1, radius * 0.1);
        g.fillCircle(cx + radius * 0.15, cy - radius * 0.1, radius * 0.1);
        g.fillStyle(0xff0000, 1);
        g.fillCircle(cx - radius * 0.15, cy - radius * 0.1, radius * 0.05);
        g.fillCircle(cx + radius * 0.15, cy - radius * 0.1, radius * 0.05);

        // Mouth
        g.fillStyle(0x000000, 0.6);
        g.fillRoundedRect(cx - radius * 0.2, cy + radius * 0.05, radius * 0.4, radius * 0.15, 3);

        // Arms
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

    _drawXPOrb() {
        const s = 16;
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        const cx = s / 2, cy = s / 2;

        // Glow
        g.fillStyle(0x44ffaa, 0.15);
        g.fillCircle(cx, cy, 7);

        // Diamond shape
        g.fillStyle(0x44ffaa, 0.9);
        g.fillTriangle(cx, cy - 5, cx + 4, cy, cx, cy + 5);
        g.fillTriangle(cx, cy - 5, cx - 4, cy, cx, cy + 5);

        // Highlight
        g.fillStyle(0xffffff, 0.5);
        g.fillTriangle(cx, cy - 3, cx - 2, cy, cx, cy + 1);

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
