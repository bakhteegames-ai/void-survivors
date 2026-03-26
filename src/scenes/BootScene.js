import Phaser from 'phaser';
import { COLORS } from '../data/constants';
import { SoundManager } from '../audio/SoundManager';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Initialize sound manager
        window.soundManager = new SoundManager();

        // Create loading bar
        const { width, height } = this.scale;
        const barWidth = Math.min(400, width * 0.6);
        const barHeight = 20;
        const barX = (width - barWidth) / 2;
        const barY = height / 2;

        // Title
        this.add.text(width / 2, barY - 60, 'VOID SURVIVORS', {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            color: COLORS.TEXT_GLOW,
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Loading text
        const loadingText = this.add.text(width / 2, barY - 20, 'Loading...', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#888888',
        }).setOrigin(0.5);

        // Progress bar background
        const barBg = this.add.graphics();
        barBg.fillStyle(0x222233, 1);
        barBg.fillRoundedRect(barX, barY, barWidth, barHeight, 4);

        // Progress bar fill
        const barFill = this.add.graphics();

        this.load.on('progress', (value) => {
            barFill.clear();
            barFill.fillStyle(COLORS.NEON_CYAN, 1);
            barFill.fillRoundedRect(barX + 2, barY + 2, (barWidth - 4) * value, barHeight - 4, 3);
            loadingText.setText(`Loading... ${Math.round(value * 100)}%`);
        });

        // Generate all textures programmatically
        this._generateTextures();
    }

    _generateTextures() {
        // Player texture
        this._createCircleTexture('player', 16, 0x00ffff, true);

        // Enemy textures
        this._createCircleTexture('enemy_slime', 12, 0x44ff44);
        this._createCircleTexture('enemy_skeleton', 13, 0xcccccc);
        this._createCircleTexture('enemy_ghost', 11, 0x8888ff);
        this._createCircleTexture('enemy_golem', 18, 0x886633);
        this._createCircleTexture('enemy_demon', 14, 0xff4444);

        // Boss textures
        this._createCircleTexture('boss_voidLord', 30, 0xff00ff, true);
        this._createCircleTexture('boss_deathKnight', 32, 0x8800aa, true);
        this._createCircleTexture('boss_ancientDragon', 38, 0xff8800, true);

        // Projectile textures
        this._createCircleTexture('proj_energyBall', 5, 0x00ffff);
        this._createCircleTexture('proj_lightning', 4, 0xffff00);
        this._createCircleTexture('proj_fireball', 6, 0xff4400);
        this._createCircleTexture('proj_shield', 8, 0x4488ff);
        this._createCircleTexture('proj_meteor', 12, 0xff8800);

        // XP orb
        this._createCircleTexture('xp_orb', 5, 0x44ffaa);

        // Particles
        this._createCircleTexture('particle', 3, 0xffffff);
        this._createCircleTexture('particle_small', 2, 0xffffff);

        // UI elements
        this._createRectTexture('button', 200, 50, 0x1a1a2e, 0x333366);
        this._createRectTexture('card_bg', 180, 240, 0x1a1a2e, 0x333366);
    }

    _createCircleTexture(key, radius, color, glow = false) {
        const size = radius * 2 + (glow ? 8 : 4);
        const graphics = this.add.graphics();

        if (glow) {
            // Outer glow
            graphics.fillStyle(color, 0.15);
            graphics.fillCircle(size / 2, size / 2, radius + 4);
            graphics.fillStyle(color, 0.3);
            graphics.fillCircle(size / 2, size / 2, radius + 2);
        }

        // Main circle
        graphics.fillStyle(color, 1);
        graphics.fillCircle(size / 2, size / 2, radius);

        // Inner highlight
        graphics.fillStyle(0xffffff, 0.3);
        graphics.fillCircle(size / 2 - radius * 0.2, size / 2 - radius * 0.2, radius * 0.4);

        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }

    _createRectTexture(key, w, h, fillColor, borderColor) {
        const graphics = this.add.graphics();
        graphics.fillStyle(fillColor, 0.9);
        graphics.fillRoundedRect(0, 0, w, h, 8);
        graphics.lineStyle(2, borderColor, 1);
        graphics.strokeRoundedRect(0, 0, w, h, 8);
        graphics.generateTexture(key, w, h);
        graphics.destroy();
    }

    create() {
        this.scene.start('MenuScene');
    }
}
