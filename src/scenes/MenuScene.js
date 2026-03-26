import Phaser from 'phaser';
import { COLORS } from '../data/constants';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;

        // Background with grid
        this._createBackground(width, height);

        // Title with glow effect
        const title = this.add.text(width / 2, height * 0.2, 'BUG\nKITCHEN', {
            fontSize: '64px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#3d2a1a',
            align: 'center',
            lineSpacing: 8,
            stroke: '#e8913a',
            strokeThickness: 2,
        }).setOrigin(0.5);

        // Pulsing glow on title
        this.tweens.add({
            targets: title,
            alpha: { from: 0.8, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Subtitle
        this.add.text(width / 2, height * 0.38, 'Grab your slippers. The bugs are coming.', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#654b33',
            align: 'center',
        }).setOrigin(0.5);

        // Play button
        this._createButton(width / 2, height * 0.55, '▶  PLAY', () => {
            window.soundManager?.play('select');
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene');
            });
        });

        // Leaderboard button
        this._createButton(width / 2, height * 0.65, '🏆  LEADERBOARD', async () => {
            window.soundManager?.play('select');
            const entries = await window.yandexSDK?.getLeaderboard('highscore', 10);
            if (entries && entries.length > 0) {
                this._showLeaderboard(entries);
            }
        }, 0.8);

        // Sound toggle
        const soundBtn = this.add.text(width - 20, 20, '🔊', {
            fontSize: '28px',
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

        soundBtn.on('pointerdown', () => {
            const enabled = window.soundManager?.toggle();
            soundBtn.setText(enabled ? '🔊' : '🔇');
        });

        // Version
        this.add.text(width / 2, height - 20, 'v0.1 | Bug Kitchen 🪳', {
            fontSize: '11px',
            fontFamily: 'Arial, sans-serif',
            color: '#8b6f47',
        }).setOrigin(0.5);

        // Floating particles in menu
        this._createMenuParticles(width, height);

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Initialize sound on first interaction
        this.input.once('pointerdown', () => {
            window.soundManager?.init();
        });
    }

    _createBackground(w, h) {
        // Kitchen floor background
        const bg = this.add.graphics();
        bg.fillStyle(COLORS.BG_FLOOR, 1);
        bg.fillRect(0, 0, w, h);

        // Tile grid lines
        const gridSize = 40;
        bg.lineStyle(1, COLORS.BG_TILE, 0.5);
        for (let x = 0; x < w; x += gridSize) {
            bg.lineBetween(x, 0, x, h);
        }
        for (let y = 0; y < h; y += gridSize) {
            bg.lineBetween(0, y, w, y);
        }
    }

    _createButton(x, y, text, callback, scale = 1) {
        const container = this.add.container(x, y);

        // Button background
        const bg = this.add.graphics();
        const btnW = 260 * scale;
        const btnH = 50;
        bg.fillStyle(COLORS.UI_BG, 0.9);
        bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
        bg.lineStyle(2, COLORS.KITCHEN_ORANGE, 0.6);
        bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);

        // Button text
        const btnText = this.add.text(0, 0, text, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);

        container.add([bg, btnText]);
        container.setSize(btnW, btnH);
        container.setInteractive({ useHandCursor: true });

        // Hover effects
        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0x5d4a3a, 0.9);
            bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            bg.lineStyle(2, COLORS.KITCHEN_ORANGE, 1);
            bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
            });
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(COLORS.UI_BG, 0.9);
            bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            bg.lineStyle(2, COLORS.KITCHEN_ORANGE, 0.6);
            bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });

        container.on('pointerdown', callback);

        return container;
    }

    _createMenuParticles(w, h) {
        // Floating dots in the background
        for (let i = 0; i < 30; i++) {
            const dot = this.add.circle(
                Phaser.Math.Between(0, w),
                Phaser.Math.Between(0, h),
                Phaser.Math.Between(1, 3),
                COLORS.KITCHEN_ORANGE,
                Phaser.Math.FloatBetween(0.1, 0.3)
            );

            this.tweens.add({
                targets: dot,
                y: dot.y - Phaser.Math.Between(20, 60),
                alpha: 0,
                duration: Phaser.Math.Between(2000, 5000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 3000),
            });
        }
    }

    _showLeaderboard(entries) {
        // Simple overlay leaderboard
        const { width, height } = this.scale;
        const overlay = this.add.graphics();
        overlay.fillStyle(0x3d2a1a, 0.95);
        overlay.fillRect(0, 0, width, height);
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

        const title = this.add.text(width / 2, 60, '🏆 LEADERBOARD', {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffcc00',
        }).setOrigin(0.5);

        const items = entries.map((e, i) => {
            return this.add.text(width / 2, 120 + i * 35, `${e.rank}. ${e.name} — ${e.score}`, {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: i < 3 ? '#ffcc00' : '#ffffff',
            }).setOrigin(0.5);
        });

        const closeBtn = this.add.text(width / 2, height - 60, 'CLOSE', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            color: COLORS.TEXT_ACCENT,
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', () => {
            overlay.destroy();
            title.destroy();
            items.forEach(i => i.destroy());
            closeBtn.destroy();
        });
    }
}
