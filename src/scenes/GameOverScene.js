import Phaser from 'phaser';
import { COLORS } from '../data/constants';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.stats = {
            time: data.time || 0,
            kills: data.kills || 0,
            level: data.level || 1,
            wave: data.wave || 1,
            score: data.score || 0,
        };
    }

    create() {
        const { width, height } = this.scale;

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x0a0a0f, 1);
        bg.fillRect(0, 0, width, height);

        // Grid effect
        bg.lineStyle(1, 0x151520, 0.3);
        for (let x = 0; x < width; x += 40) bg.lineBetween(x, 0, x, height);
        for (let y = 0; y < height; y += 40) bg.lineBetween(0, y, width, y);

        // Title
        const title = this.add.text(width / 2, height * 0.12, 'GAME OVER', {
            fontSize: '42px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#ff3344',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            alpha: { from: 0.6, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
        });

        // Stats panel
        const panelW = Math.min(300, width * 0.7);
        const panelH = 200;
        const panelX = (width - panelW) / 2;
        const panelY = height * 0.25;

        const panel = this.add.graphics();
        panel.fillStyle(COLORS.UI_BG, 0.9);
        panel.fillRoundedRect(panelX, panelY, panelW, panelH, 12);
        panel.lineStyle(2, COLORS.UI_BORDER, 0.6);
        panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 12);

        // Stats
        const seconds = Math.floor(this.stats.time / 1000);
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');

        const statsData = [
            { label: '⏱ Time', value: `${mins}:${secs}` },
            { label: '☠ Kills', value: this.stats.kills.toString() },
            { label: '⭐ Level', value: this.stats.level.toString() },
            { label: '🌊 Wave', value: this.stats.wave.toString() },
            { label: '🏆 Score', value: this.stats.score.toLocaleString() },
        ];

        statsData.forEach((stat, i) => {
            const sy = panelY + 20 + i * 36;

            this.add.text(panelX + 25, sy, stat.label, {
                fontSize: '15px',
                fontFamily: 'Arial, sans-serif',
                color: '#888899',
            });

            this.add.text(panelX + panelW - 25, sy, stat.value, {
                fontSize: '15px',
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
                fontStyle: 'bold',
            }).setOrigin(1, 0);
        });

        // Revive button (rewarded ad)
        this._createButton(width / 2, height * 0.65, '📺 REVIVE (Watch Ad)', async () => {
            window.soundManager?.play('select');
            const rewarded = await window.yandexSDK?.showRewarded();
            if (rewarded) {
                // Revive with 50% HP
                this.scene.start('GameScene');
            }
        }, 0xffcc00);

        // Retry button
        this._createButton(width / 2, height * 0.76, '🔄 PLAY AGAIN', () => {
            window.soundManager?.play('select');
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene');
            });
        }, COLORS.NEON_CYAN);

        // Menu button
        this._createButton(width / 2, height * 0.87, '🏠 MENU', () => {
            window.soundManager?.play('select');
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        }, 0x888899);

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    _createButton(x, y, text, callback, color = COLORS.NEON_CYAN) {
        const container = this.add.container(x, y);
        const btnW = 260;
        const btnH = 44;

        const bg = this.add.graphics();
        bg.fillStyle(COLORS.UI_BG, 0.9);
        bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);
        bg.lineStyle(2, color, 0.6);
        bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 8);

        const btnText = this.add.text(0, 0, text, {
            fontSize: '15px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
        }).setOrigin(0.5);

        container.add([bg, btnText]);
        container.setSize(btnW, btnH);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerover', () => {
            this.tweens.add({ targets: container, scaleX: 1.05, scaleY: 1.05, duration: 100 });
        });
        container.on('pointerout', () => {
            this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 });
        });
        container.on('pointerdown', callback);

        // Entry animation
        container.setAlpha(0);
        this.tweens.add({
            targets: container,
            alpha: 1,
            y: { from: y + 20, to: y },
            duration: 400,
            delay: 300 + (y * 0.5),
        });

        return container;
    }
}
