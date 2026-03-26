import Phaser from 'phaser';
import { WEAPON_TYPES, PASSIVE_UPGRADES } from '../data/weapons';
import { COLORS } from '../data/constants';

export class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
    }

    init(data) {
        this.weapons = data.weapons || {};
        this.passiveLevels = data.passiveLevels || {};
        this.luck = data.luck || 0;
        this.callback = data.callback;
    }

    create() {
        const { width, height } = this.scale;

        // Dim overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x3d2a1a, 0.85);
        overlay.fillRect(0, 0, width, height);

        // Title
        this.add.text(width / 2, height * 0.1, 'CHOOSE UPGRADE', {
            fontSize: '28px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#e8913a',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);

        // Generate 3 random upgrade options
        const options = this._generateOptions();

        // Create cards
        const cardWidth = Math.min(160, (width - 80) / 3);
        const gap = 15;
        const totalWidth = options.length * cardWidth + (options.length - 1) * gap;
        const startX = (width - totalWidth) / 2 + cardWidth / 2;

        options.forEach((option, i) => {
            this._createCard(
                startX + i * (cardWidth + gap),
                height * 0.5,
                cardWidth,
                option
            );
        });
    }

    _generateOptions() {
        const options = [];
        const pool = [];

        // Add new weapon options
        Object.entries(WEAPON_TYPES).forEach(([key, weapon]) => {
            if (!this.weapons[key]) {
                pool.push({
                    type: 'weapon',
                    key: key,
                    name: weapon.name,
                    description: weapon.description,
                    level: 'NEW',
                    color: weapon.color,
                    rarity: 'rare',
                });
            } else if (this.weapons[key].level < weapon.maxLevel) {
                pool.push({
                    type: 'weapon',
                    key: key,
                    name: weapon.name,
                    description: `Upgrade to Lv.${this.weapons[key].level + 1}`,
                    level: `Lv.${this.weapons[key].level + 1}`,
                    color: weapon.color,
                    rarity: 'common',
                });
            }
        });

        // Add passive options
        Object.entries(PASSIVE_UPGRADES).forEach(([key, passive]) => {
            const currentLevel = this.passiveLevels[key] || 0;
            if (currentLevel < passive.maxLevel) {
                pool.push({
                    type: 'passive',
                    key: key,
                    name: passive.name,
                    description: passive.description,
                    level: `Lv.${currentLevel + 1}`,
                    icon: passive.icon,
                    color: COLORS.KITCHEN_GREEN,
                    rarity: 'common',
                });
            }
        });

        // Shuffle and pick 3 (higher luck = more rare options appear first)
        Phaser.Utils.Array.Shuffle(pool);

        // Sort rare items to front based on luck
        if (this.luck > 0) {
            pool.sort((a, b) => {
                if (a.rarity === 'rare' && b.rarity !== 'rare') return -1;
                if (b.rarity === 'rare' && a.rarity !== 'rare') return 1;
                return 0;
            });
        }

        // Force Slipper Orbit or Spray Can to the front for the first level up hooks
        pool.sort((a, b) => {
            if (a.key === 'slipperOrbit' && !this.weapons['slipperOrbit']) return -1;
            if (b.key === 'slipperOrbit' && !this.weapons['slipperOrbit']) return 1;
            return 0;
        });

        for (let i = 0; i < Math.min(3, pool.length); i++) {
            options.push(pool[i]);
        }

        // If no options available, add a heal option
        if (options.length === 0) {
            options.push({
                type: 'heal',
                key: 'heal',
                name: 'Full Heal',
                description: 'Restore all HP',
                level: '',
                color: 0xff4444,
                rarity: 'common',
            });
        }

        return options;
    }

    _createCard(x, y, cardWidth, option) {
        const cardHeight = 220;
        const container = this.add.container(x, y);

        // Card background
        const bg = this.add.graphics();
        const isRare = option.rarity === 'rare';
        const borderColor = isRare ? 0xffcc00 : COLORS.UI_BORDER;

        bg.fillStyle(COLORS.UI_BG, 0.95);
        bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);
        bg.lineStyle(2, borderColor, isRare ? 1 : 0.6);
        bg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);

        // Rarity glow
        if (isRare) {
            bg.fillStyle(0xffcc00, 0.05);
            bg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);
        }

        // Type icon or weapon indicator
        const iconSize = 40;
        const iconBg = this.add.graphics();
        iconBg.fillStyle(option.color || 0x444444, 0.3);
        iconBg.fillCircle(0, -cardHeight / 2 + 50, iconSize / 2);
        iconBg.lineStyle(2, option.color || 0x444444, 0.6);
        iconBg.strokeCircle(0, -cardHeight / 2 + 50, iconSize / 2);

        // Icon text (emoji or symbol)
        const iconText = option.icon || (option.type === 'weapon' ? '🐛' : '✨');
        this.add.text(0, -cardHeight / 2 + 50, iconText, {
            fontSize: '22px',
        }).setOrigin(0.5);

        // Level badge
        if (option.level) {
            const badgeText = this.add.text(cardWidth / 2 - 12, -cardHeight / 2 + 8, option.level, {
                fontSize: '10px',
                fontFamily: 'Arial, sans-serif',
                color: isRare ? '#ffcc00' : '#88ff88',
                fontStyle: 'bold',
            }).setOrigin(1, 0);
            container.add(badgeText);
        }

        // Name
        const nameText = this.add.text(0, -cardHeight / 2 + 90, option.name, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: cardWidth - 20 },
        }).setOrigin(0.5);

        // Description
        const descText = this.add.text(0, -cardHeight / 2 + 120, option.description, {
            fontSize: '11px',
            fontFamily: 'Arial, sans-serif',
            color: '#999999',
            align: 'center',
            wordWrap: { width: cardWidth - 20 },
            lineSpacing: 2,
        }).setOrigin(0.5, 0);

        container.add([bg, iconBg, nameText, descText]);
        container.setSize(cardWidth, cardHeight);
        container.setInteractive({ useHandCursor: true });

        // Hover effect
        container.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.08,
                scaleY: 1.08,
                duration: 100,
            });
        });

        container.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
            });
        });

        // Select
        container.on('pointerdown', () => {
            window.soundManager?.play('select');

            // Flash selected card
            this.cameras.main.flash(100, 242, 201, 76, 0.2);

            this.time.delayedCall(150, () => {
                if (this.callback) {
                    this.callback(option);
                }
                this.scene.stop();
            });
        });

        // Entry animation
        container.setAlpha(0);
        container.setScale(0.5);
        this.tweens.add({
            targets: container,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            delay: container.x * 0.3, // stagger
        });
    }
}
