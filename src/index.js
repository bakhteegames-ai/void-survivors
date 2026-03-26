import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { UpgradeScene } from './scenes/UpgradeScene';
import { GameOverScene } from './scenes/GameOverScene';
import { YandexSDK } from './sdk/YandexSDK';

// Initialize Yandex SDK
window.yandexSDK = new YandexSDK();
window.yandexSDK.init().then(() => {
    console.log('Yandex SDK ready');
}).catch(() => {
    console.log('Running without Yandex SDK (local dev)');
});

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#0a0a0f',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [BootScene, MenuScene, GameScene, UpgradeScene, GameOverScene],
    render: {
        pixelArt: false,
        antialias: true,
    },
    input: {
        activePointers: 3,
    },
};

const game = new Phaser.Game(config);

// Handle visibility change (pause/resume for ads)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        game.scene.scenes.forEach(scene => {
            if (scene.scene.isActive() && scene.scene.key === 'GameScene') {
                scene.scene.pause();
            }
        });
    } else {
        game.scene.scenes.forEach(scene => {
            if (scene.scene.isPaused() && scene.scene.key === 'GameScene') {
                scene.scene.resume();
            }
        });
    }
});
