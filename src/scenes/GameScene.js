import Phaser from 'phaser';
import { BALANCE, COLORS } from '../data/constants';
import { ENEMY_TYPES, BOSS_TYPES } from '../data/enemies';
import { WEAPON_TYPES, PASSIVE_UPGRADES } from '../data/weapons';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const { width, height } = this.scale;
        this.gameWidth = width;
        this.gameHeight = height;

        // Game state
        this.gameTime = 0;
        this.kills = 0;
        this.currentWave = 1;
        this.waveTimer = 0;
        this.spawnTimer = 0;
        this.spawnRate = BALANCE.ENEMY_SPAWN_RATE;
        this.isPaused = false;
        this.isGameOver = false;

        // World bounds
        const worldSize = BALANCE.GAME_AREA_SIZE;
        this.physics.world.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // Background
        this._createBackground(worldSize);

        // Player
        this._createPlayer();

        // Groups
        this.enemies = this.physics.add.group({ maxSize: BALANCE.ENEMY_MAX_COUNT });
        this.projectiles = this.physics.add.group({ maxSize: 200 });
        this.xpOrbs = this.physics.add.group({ maxSize: 300 });
        this.damageNumbers = this.add.group({ maxSize: 50 });

        // Weapon state
        this.weapons = {};
        this._addWeapon('energyBall');

        // Passive stats
        this.passives = {
            moveSpeed: 0,
            maxHp: 0,
            xpMagnet: 0,
            regen: 0,
            armor: 0,
            luck: 0,
        };
        this.passiveLevels = {};

        // Weapon timers
        this.weaponTimers = {};

        // Orbital objects
        this.orbitals = [];

        // Camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);

        // Physics overlaps
        this.physics.add.overlap(this.player, this.enemies, this._onPlayerHit, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this._onProjectileHit, null, this);
        this.physics.add.overlap(this.player, this.xpOrbs, this._onXPPickup, null, this);

        // HUD (fixed to camera via a separate scene-like approach with setScrollFactor)
        this._createHUD();

        // Touch controls
        this._createTouchControls();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);

        // Sound init
        window.soundManager?.init();

        // Resize handler
        this.scale.on('resize', (gameSize) => {
            this.gameWidth = gameSize.width;
            this.gameHeight = gameSize.height;
            this._repositionHUD();
        });
    }

    update(time, delta) {
        if (this.isGameOver || this.isPaused) return;

        const dt = delta / 1000;
        this.gameTime += delta;
        this.waveTimer += delta;
        this.spawnTimer += delta;

        // Update player movement
        this._updatePlayerMovement();

        // Player trail effect
        if (this.player.body.speed > 20) {
            if (!this._trailTimer) this._trailTimer = 0;
            this._trailTimer += delta;
            if (this._trailTimer > 50) {
                this._trailTimer = 0;
                const trail = this.add.circle(this.player.x, this.player.y + 5, 4, 0x00ffff, 0.3);
                trail.setDepth(1);
                this.tweens.add({
                    targets: trail,
                    alpha: 0,
                    scaleX: 0.2,
                    scaleY: 0.2,
                    duration: 300,
                    onComplete: () => trail.destroy(),
                });
            }
        }

        // Spawn enemies
        if (this.spawnTimer >= this.spawnRate) {
            this.spawnTimer = 0;
            this._spawnEnemy();
        }

        // Wave progression
        if (this.waveTimer >= BALANCE.WAVE_DURATION) {
            this.waveTimer = 0;
            this.currentWave++;
            this.spawnRate = Math.max(BALANCE.ENEMY_SPAWN_RATE_MIN,
                this.spawnRate * BALANCE.ENEMY_SPAWN_RATE_DECAY);

            // Boss wave
            if (this.currentWave % BALANCE.BOSS_WAVE_INTERVAL === 0) {
                this._spawnBoss();
            }

            this._showWaveText();
        }

        // Fire weapons
        this._updateWeapons(time);

        // Update orbitals
        this._updateOrbitals(time);

        // XP magnet
        this._updateXPMagnet();

        // Regen
        if (this.passives.regen > 0) {
            this.playerHP = Math.min(this.playerMaxHP, this.playerHP + this.passives.regen * dt);
        }

        // Update enemy HP bars
        this._updateEnemyHPBars();

        // Update HUD
        this._updateHUD();

        // Move enemies toward player
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;
            this.physics.moveToObject(enemy, this.player, enemy.getData('speed'));
        });
    }

    _updateEnemyHPBars() {
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;
            const hp = enemy.getData('hp');
            const maxHp = enemy.getData('maxHp');
            if (hp >= maxHp) return; // Don't show bar if full HP

            // Lazy create HP bar
            if (!enemy.hpBar) {
                enemy.hpBar = this.add.graphics();
                enemy.hpBar.setDepth(12);
            }

            const barWidth = enemy.getData('isBoss') ? 50 : 20;
            enemy.hpBar.clear();
            enemy.hpBar.fillStyle(0x000000, 0.5);
            enemy.hpBar.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.height / 2 - 8, barWidth, 4);
            enemy.hpBar.fillStyle(0xff3344, 0.9);
            enemy.hpBar.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.height / 2 - 8, barWidth * (hp / maxHp), 4);
        });
    }

    // === PLAYER ===

    _createPlayer() {
        this.player = this.physics.add.sprite(0, 0, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.player.setDamping(true);
        this.player.setDrag(0.9);

        this.playerHP = BALANCE.PLAYER_MAX_HP;
        this.playerMaxHP = BALANCE.PLAYER_MAX_HP;
        this.playerLevel = 1;
        this.playerXP = 0;
        this.playerXPToLevel = BALANCE.XP_BASE;
        this.playerSpeed = BALANCE.PLAYER_SPEED;
        this.lastDamageTime = 0;
    }

    _updatePlayerMovement() {
        let vx = 0, vy = 0;
        const speed = this.playerSpeed + this.passives.moveSpeed;

        // Keyboard
        if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
        if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;
        if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
        if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

        // Touch joystick
        if (this.touchActive && this.joystickDirection) {
            vx = this.joystickDirection.x;
            vy = this.joystickDirection.y;
        }

        // Normalize diagonal
        if (vx !== 0 && vy !== 0) {
            const len = Math.sqrt(vx * vx + vy * vy);
            vx /= len;
            vy /= len;
        }

        this.player.setVelocity(vx * speed, vy * speed);

        // Flip sprite based on direction
        if (vx < 0) this.player.setFlipX(true);
        else if (vx > 0) this.player.setFlipX(false);
    }

    // === ENEMIES ===

    _spawnEnemy() {
        if (this.enemies.countActive() >= BALANCE.ENEMY_MAX_COUNT) return;

        // Pick enemy type based on wave
        const available = Object.entries(ENEMY_TYPES).filter(([, e]) => e.minWave <= this.currentWave);
        const totalWeight = available.reduce((sum, [, e]) => sum + e.spawnWeight, 0);
        let rand = Math.random() * totalWeight;

        let selectedType = available[0];
        for (const entry of available) {
            rand -= entry[1].spawnWeight;
            if (rand <= 0) { selectedType = entry; break; }
        }

        const [typeKey, typeData] = selectedType;
        const angle = Math.random() * Math.PI * 2;
        const dist = BALANCE.ENEMY_SPAWN_DISTANCE;
        const x = this.player.x + Math.cos(angle) * dist;
        const y = this.player.y + Math.sin(angle) * dist;

        const enemy = this.enemies.get(x, y, `enemy_${typeKey}`);
        if (!enemy) return;

        enemy.setActive(true).setVisible(true);
        enemy.setPosition(x, y);
        enemy.body.enable = true;

        // Scale stats with wave
        const waveMultiplier = 1 + (this.currentWave - 1) * 0.1;
        enemy.setData('type', typeKey);
        enemy.setData('hp', typeData.hp * waveMultiplier);
        enemy.setData('maxHp', typeData.hp * waveMultiplier);
        enemy.setData('speed', typeData.speed);
        enemy.setData('damage', typeData.damage * waveMultiplier);
        enemy.setData('xpValue', typeData.xpValue);
        enemy.setData('color', typeData.color);
        enemy.setDepth(5);
    }

    _spawnBoss() {
        const bossKeys = Object.keys(BOSS_TYPES);
        const bossKey = bossKeys[Math.min(
            Math.floor((this.currentWave / BALANCE.BOSS_WAVE_INTERVAL) - 1),
            bossKeys.length - 1
        )];
        const bossData = BOSS_TYPES[bossKey];

        const angle = Math.random() * Math.PI * 2;
        const x = this.player.x + Math.cos(angle) * BALANCE.ENEMY_SPAWN_DISTANCE;
        const y = this.player.y + Math.sin(angle) * BALANCE.ENEMY_SPAWN_DISTANCE;

        const boss = this.enemies.get(x, y, `boss_${bossKey}`);
        if (!boss) return;

        boss.setActive(true).setVisible(true);
        boss.setPosition(x, y);
        boss.body.enable = true;

        const waveMultiplier = 1 + (this.currentWave - 1) * 0.08;
        boss.setData('type', bossKey);
        boss.setData('hp', bossData.hp * waveMultiplier);
        boss.setData('maxHp', bossData.hp * waveMultiplier);
        boss.setData('speed', bossData.speed);
        boss.setData('damage', bossData.damage);
        boss.setData('xpValue', bossData.xpValue);
        boss.setData('color', bossData.color);
        boss.setData('isBoss', true);
        boss.setDepth(6);

        window.soundManager?.play('boss');

        // Boss warning text
        this._showBossWarning(bossData.name);
    }

    _killEnemy(enemy) {
        const xpValue = enemy.getData('xpValue');
        const color = enemy.getData('color');
        const isBoss = enemy.getData('isBoss');

        // Spawn XP orbs
        const orbCount = isBoss ? 10 : 1;
        for (let i = 0; i < orbCount; i++) {
            const ox = enemy.x + Phaser.Math.Between(-15, 15);
            const oy = enemy.y + Phaser.Math.Between(-15, 15);
            this._spawnXPOrb(ox, oy, isBoss ? Math.ceil(xpValue / orbCount) : xpValue);
        }

        // Death particles
        this._spawnDeathParticles(enemy.x, enemy.y, color);

        // Screen effects
        if (isBoss) {
            this.cameras.main.shake(300, 0.01);
            this.cameras.main.flash(200, 255, 255, 255, 0.3);
            window.soundManager?.play('explosion');
        }

        window.soundManager?.play('kill');
        this.kills++;

        enemy.setActive(false).setVisible(false);
        enemy.body.enable = false;
    }

    // === WEAPONS ===

    _addWeapon(weaponKey) {
        if (this.weapons[weaponKey]) {
            // Level up existing weapon
            this.weapons[weaponKey].level++;
            return;
        }

        this.weapons[weaponKey] = {
            ...WEAPON_TYPES[weaponKey],
            level: 1,
            key: weaponKey,
        };
    }

    _updateWeapons(time) {
        Object.entries(this.weapons).forEach(([key, weapon]) => {
            if (!this.weaponTimers[key]) this.weaponTimers[key] = 0;

            const fireRate = this._getWeaponStat(weapon, 'fireRate');
            if (time - this.weaponTimers[key] >= fireRate) {
                this.weaponTimers[key] = time;
                this._fireWeapon(key, weapon);
            }
        });
    }

    _getWeaponStat(weapon, stat) {
        const base = WEAPON_TYPES[weapon.key][stat];
        const upgrade = WEAPON_TYPES[weapon.key].upgrades[stat];
        if (upgrade === undefined) return base;
        const val = base + upgrade * (weapon.level - 1);
        if (stat === 'fireRate') return Math.max(100, val);
        return val;
    }

    _fireWeapon(key, weapon) {
        const nearest = this._findNearestEnemy(this._getWeaponStat(weapon, 'range'));

        switch (weapon.type) {
            case 'projectile':
                this._fireProjectile(weapon, nearest);
                break;
            case 'chain':
                this._fireLightning(weapon, nearest);
                break;
            case 'aura':
                this._fireAura(weapon);
                break;
            case 'orbital':
                this._updateOrbitalWeapon(weapon);
                break;
            case 'aoe':
                this._fireMeteor(weapon);
                break;
        }
    }

    _fireProjectile(weapon, target) {
        if (!target) return;
        const count = this._getWeaponStat(weapon, 'projectileCount') || 1;
        const speed = this._getWeaponStat(weapon, 'speed');
        const damage = this._getWeaponStat(weapon, 'damage');
        const pierce = this._getWeaponStat(weapon, 'pierce') || 1;

        for (let i = 0; i < count; i++) {
            const proj = this.projectiles.get(this.player.x, this.player.y, 'proj_energyBall');
            if (!proj) continue;

            proj.setActive(true).setVisible(true);
            proj.body.enable = true;
            proj.setData('damage', damage);
            proj.setData('pierce', pierce);
            proj.setData('hits', 0);
            proj.setDepth(8);

            const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y);
            const spread = count > 1 ? (i - (count - 1) / 2) * 0.15 : 0;

            this.physics.velocityFromRotation(angle + spread, speed, proj.body.velocity);

            // Auto-destroy after range
            this.time.delayedCall(2000, () => {
                if (proj.active) {
                    proj.setActive(false).setVisible(false);
                    proj.body.enable = false;
                }
            });
        }

        window.soundManager?.play('shoot');
    }

    _fireLightning(weapon, target) {
        if (!target) return;
        const damage = this._getWeaponStat(weapon, 'damage');
        const chainCount = this._getWeaponStat(weapon, 'chainCount');
        const chainRange = weapon.chainRange || 120;

        let currentTarget = target;
        const hitTargets = new Set();

        for (let i = 0; i < chainCount; i++) {
            if (!currentTarget || !currentTarget.active) break;
            hitTargets.add(currentTarget);

            // Draw lightning line
            this._drawLightning(
                i === 0 ? this.player.x : currentTarget.x,
                i === 0 ? this.player.y : currentTarget.y,
                currentTarget.x, currentTarget.y
            );

            // Damage
            this._damageEnemy(currentTarget, damage);

            // Find next chain target
            let nearest = null;
            let nearestDist = chainRange;
            this.enemies.getChildren().forEach(e => {
                if (!e.active || hitTargets.has(e)) return;
                const d = Phaser.Math.Distance.Between(currentTarget.x, currentTarget.y, e.x, e.y);
                if (d < nearestDist) {
                    nearestDist = d;
                    nearest = e;
                }
            });
            currentTarget = nearest;
        }

        window.soundManager?.play('lightning');
    }

    _drawLightning(x1, y1, x2, y2) {
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0xffff00, 0.8);
        graphics.beginPath();
        graphics.moveTo(x1, y1);

        // Jagged line
        const segments = 5;
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const mx = Phaser.Math.Linear(x1, x2, t) + Phaser.Math.Between(-10, 10);
            const my = Phaser.Math.Linear(y1, y2, t) + Phaser.Math.Between(-10, 10);
            graphics.lineTo(mx, my);
        }
        graphics.lineTo(x2, y2);
        graphics.strokePath();
        graphics.setDepth(9);

        // Fade out
        this.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 150,
            onComplete: () => graphics.destroy(),
        });
    }

    _fireAura(weapon) {
        const damage = this._getWeaponStat(weapon, 'damage');
        const range = this._getWeaponStat(weapon, 'range');

        // Visual aura pulse
        const aura = this.add.circle(this.player.x, this.player.y, range, 0xff4400, 0.15);
        aura.setDepth(3);
        this.tweens.add({
            targets: aura,
            alpha: 0,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            onComplete: () => aura.destroy(),
        });

        // Damage nearby enemies
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (dist <= range) {
                this._damageEnemy(enemy, damage);
            }
        });
    }

    _updateOrbitalWeapon(weapon) {
        const count = this._getWeaponStat(weapon, 'orbitCount') || 2;

        // Ensure correct number of orbitals
        while (this.orbitals.length < count) {
            const orb = this.add.sprite(0, 0, 'proj_shield');
            orb.setDepth(9);
            orb.setData('damage', this._getWeaponStat(weapon, 'damage'));
            orb.setData('angle', (this.orbitals.length / count) * Math.PI * 2);
            this.orbitals.push(orb);
        }
    }

    _updateOrbitals(time) {
        if (this.orbitals.length === 0) return;
        const weapon = this.weapons.orbitShield;
        if (!weapon) return;

        const radius = this._getWeaponStat(weapon, 'orbitRadius') || 80;
        const speed = weapon.orbitSpeed || 3;
        const damage = this._getWeaponStat(weapon, 'damage');

        this.orbitals.forEach((orb, i) => {
            const angle = orb.getData('angle') + speed * time / 1000;
            orb.setData('angle', angle);
            orb.x = this.player.x + Math.cos(angle) * radius;
            orb.y = this.player.y + Math.sin(angle) * radius;

            // Check collision with enemies
            this.enemies.getChildren().forEach(enemy => {
                if (!enemy.active) return;
                const dist = Phaser.Math.Distance.Between(orb.x, orb.y, enemy.x, enemy.y);
                if (dist < 20) {
                    this._damageEnemy(enemy, damage * 0.1); // tick damage
                }
            });
        });
    }

    _fireMeteor(weapon) {
        const damage = this._getWeaponStat(weapon, 'damage');
        const meteorCount = this._getWeaponStat(weapon, 'meteorCount') || 1;
        const aoeRadius = this._getWeaponStat(weapon, 'aoeRadius') || 60;

        for (let i = 0; i < meteorCount; i++) {
            // Find cluster of enemies
            let targetX, targetY;
            const enemies = this.enemies.getChildren().filter(e => e.active);
            if (enemies.length > 0) {
                const target = Phaser.Utils.Array.GetRandom(enemies);
                targetX = target.x + Phaser.Math.Between(-30, 30);
                targetY = target.y + Phaser.Math.Between(-30, 30);
            } else {
                return;
            }

            // Meteor falling animation
            const meteor = this.add.sprite(targetX, targetY - 200, 'proj_meteor');
            meteor.setDepth(11);
            meteor.setAlpha(0.8);

            // Shadow/target indicator
            const shadow = this.add.circle(targetX, targetY, aoeRadius * 0.5, 0xff4400, 0.2);
            shadow.setDepth(2);

            this.tweens.add({
                targets: shadow,
                alpha: 0.4,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 500,
                yoyo: true,
            });

            this.tweens.add({
                targets: meteor,
                y: targetY,
                alpha: 1,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 500,
                ease: 'Quad.easeIn',
                onComplete: () => {
                    meteor.destroy();
                    shadow.destroy();

                    // Explosion
                    const explosion = this.add.circle(targetX, targetY, aoeRadius, 0xff6600, 0.5);
                    explosion.setDepth(7);
                    this.tweens.add({
                        targets: explosion,
                        alpha: 0,
                        scaleX: 1.5,
                        scaleY: 1.5,
                        duration: 300,
                        onComplete: () => explosion.destroy(),
                    });

                    // Damage enemies in radius
                    this.enemies.getChildren().forEach(enemy => {
                        if (!enemy.active) return;
                        const dist = Phaser.Math.Distance.Between(targetX, targetY, enemy.x, enemy.y);
                        if (dist <= aoeRadius) {
                            this._damageEnemy(enemy, damage);
                        }
                    });

                    this.cameras.main.shake(100, 0.005);
                    window.soundManager?.play('explosion');
                },
            });
        }
    }

    // === COMBAT ===

    _findNearestEnemy(range) {
        let nearest = null;
        let nearestDist = range || 999999;

        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;
            const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (d < nearestDist) {
                nearestDist = d;
                nearest = enemy;
            }
        });

        return nearest;
    }

    _damageEnemy(enemy, damage) {
        if (!enemy.active) return;

        let hp = enemy.getData('hp') - damage;
        enemy.setData('hp', hp);

        // Flash white
        enemy.setTint(0xffffff);
        this.time.delayedCall(50, () => {
            if (enemy.active) enemy.clearTint();
        });

        // Damage number
        this._spawnDamageNumber(enemy.x, enemy.y - 15, Math.round(damage));

        // Knockback
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
        enemy.body.velocity.x += Math.cos(angle) * 100;
        enemy.body.velocity.y += Math.sin(angle) * 100;

        window.soundManager?.play('hit');

        if (hp <= 0) {
            this._killEnemy(enemy);
        }
    }

    _onPlayerHit(player, enemy) {
        if (!enemy.active) return;
        const now = this.time.now;
        if (now - this.lastDamageTime < BALANCE.PLAYER_IFRAMES) return;
        this.lastDamageTime = now;

        let damage = enemy.getData('damage') - this.passives.armor;
        damage = Math.max(1, damage);

        this.playerHP -= damage;

        // Visual feedback
        this.cameras.main.shake(100, 0.005);
        player.setTint(0xff0000);
        this.time.delayedCall(100, () => player.clearTint());

        // Flash player (iframes visual)
        this.tweens.add({
            targets: player,
            alpha: { from: 0.3, to: 1 },
            duration: 100,
            repeat: 4,
        });

        if (this.playerHP <= 0) {
            this.playerHP = 0;
            this._gameOver();
        }
    }

    _onProjectileHit(projectile, enemy) {
        if (!projectile.active || !enemy.active) return;

        const damage = projectile.getData('damage');
        this._damageEnemy(enemy, damage);

        const hits = projectile.getData('hits') + 1;
        const pierce = projectile.getData('pierce');

        if (hits >= pierce) {
            projectile.setActive(false).setVisible(false);
            projectile.body.enable = false;
        } else {
            projectile.setData('hits', hits);
        }
    }

    // === XP & LEVELING ===

    _spawnXPOrb(x, y, value) {
        const orb = this.xpOrbs.get(x, y, 'xp_orb');
        if (!orb) return;

        orb.setActive(true).setVisible(true);
        orb.body.enable = true;
        orb.setData('value', value);
        orb.setDepth(4);
        orb.setAlpha(0.9);

        // Slight bounce on spawn
        this.tweens.add({
            targets: orb,
            scaleX: { from: 0, to: 1 },
            scaleY: { from: 0, to: 1 },
            duration: 200,
            ease: 'Back.easeOut',
        });
    }

    _onXPPickup(player, orb) {
        if (!orb.active) return;

        const value = orb.getData('value');
        this.playerXP += value;

        orb.setActive(false).setVisible(false);
        orb.body.enable = false;

        window.soundManager?.play('pickup');

        // Check level up
        while (this.playerXP >= this.playerXPToLevel) {
            this.playerXP -= this.playerXPToLevel;
            this.playerLevel++;
            this.playerXPToLevel = Math.floor(BALANCE.XP_BASE * Math.pow(BALANCE.XP_GROWTH, this.playerLevel - 1));
            this._onLevelUp();
        }
    }

    _updateXPMagnet() {
        const range = BALANCE.PLAYER_XP_MAGNET_RANGE + this.passives.xpMagnet;

        this.xpOrbs.getChildren().forEach(orb => {
            if (!orb.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, orb.x, orb.y);
            if (dist <= range) {
                this.physics.moveToObject(orb, this.player, BALANCE.XP_ORB_SPEED);
            }
        });
    }

    _onLevelUp() {
        window.soundManager?.play('levelup');

        // Flash effect
        this.cameras.main.flash(200, 0, 255, 255, 0.2);

        // Show level up text
        const text = this.add.text(this.player.x, this.player.y - 40, 'LEVEL UP!', {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: text,
            y: text.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy(),
        });

        // Pause and show upgrade selection
        this.isPaused = true;
        this.physics.pause();
        this.time.delayedCall(300, () => {
            this.scene.launch('UpgradeScene', {
                weapons: this.weapons,
                passiveLevels: this.passiveLevels,
                luck: this.passives.luck,
                callback: (choice) => {
                    this._applyUpgrade(choice);
                    this.isPaused = false;
                    this.physics.resume();
                },
            });
        });
    }

    _applyUpgrade(choice) {
        if (choice.type === 'weapon') {
            this._addWeapon(choice.key);
        } else if (choice.type === 'passive') {
            const passive = PASSIVE_UPGRADES[choice.key];
            if (!this.passiveLevels[choice.key]) this.passiveLevels[choice.key] = 0;
            this.passiveLevels[choice.key]++;
            this.passives[passive.stat] += passive.valuePerLevel;

            // Apply max HP immediately
            if (passive.stat === 'maxHp') {
                this.playerMaxHP = BALANCE.PLAYER_MAX_HP + this.passives.maxHp;
                this.playerHP = Math.min(this.playerHP + passive.valuePerLevel, this.playerMaxHP);
            }
        }
    }

    // === VISUAL EFFECTS ===

    _spawnDeathParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const p = this.add.circle(x, y, Phaser.Math.Between(2, 4), color, 0.8);
            p.setDepth(7);
            const angle = (i / 8) * Math.PI * 2;
            const dist = Phaser.Math.Between(20, 50);

            this.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: Phaser.Math.Between(200, 400),
                onComplete: () => p.destroy(),
            });
        }
    }

    _spawnDamageNumber(x, y, damage) {
        const text = this.add.text(x, y, damage.toString(), {
            fontSize: damage >= 30 ? '16px' : '12px',
            fontFamily: 'Arial, sans-serif',
            color: damage >= 30 ? '#ffcc00' : '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5).setDepth(15);

        this.tweens.add({
            targets: text,
            y: y - 30,
            alpha: 0,
            duration: 600,
            ease: 'Quad.easeOut',
            onComplete: () => text.destroy(),
        });
    }

    _showWaveText() {
        const text = this.add.text(this.player.x, this.player.y - 80, `WAVE ${this.currentWave}`, {
            fontSize: '28px',
            fontFamily: 'Arial Black, Arial, sans-serif',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: text,
            scaleX: { from: 0.5, to: 1.2 },
            scaleY: { from: 0.5, to: 1.2 },
            duration: 300,
            yoyo: true,
            hold: 500,
            onComplete: () => {
                this.tweens.add({
                    targets: text,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => text.destroy(),
                });
            },
        });
    }

    _showBossWarning(name) {
        const text = this.add.text(this.player.x, this.player.y - 100,
            `⚠ BOSS: ${name} ⚠`, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ff4444',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: text,
            alpha: { from: 0, to: 1 },
            duration: 200,
            yoyo: true,
            repeat: 3,
            hold: 200,
            onComplete: () => text.destroy(),
        });
    }

    // === HUD ===

    _createHUD() {
        this.hudContainer = this.add.container(0, 0);
        this.hudContainer.setDepth(100);
        this.hudContainer.setScrollFactor(0);

        const w = this.gameWidth;

        // HP bar background
        this.hpBarBg = this.add.graphics();
        this.hpBarBg.fillStyle(COLORS.HP_BG, 0.8);
        this.hpBarBg.fillRoundedRect(20, 15, 200, 16, 4);

        // HP bar fill
        this.hpBarFill = this.add.graphics();

        // XP bar background
        this.xpBarBg = this.add.graphics();
        this.xpBarBg.fillStyle(0x112222, 0.8);
        this.xpBarBg.fillRoundedRect(20, 35, 200, 8, 2);

        // XP bar fill
        this.xpBarFill = this.add.graphics();

        // Level text
        this.levelText = this.add.text(22, 46, 'Lv.1', {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            color: '#44ffaa',
            fontStyle: 'bold',
        });

        // Timer
        this.timerText = this.add.text(w / 2, 15, '00:00', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#ffffff',
        }).setOrigin(0.5, 0);

        // Wave text
        this.waveText = this.add.text(w / 2, 36, 'Wave 1', {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            color: '#888899',
        }).setOrigin(0.5, 0);

        // Kill counter
        this.killText = this.add.text(w - 20, 15, '☠ 0', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            color: '#ff6666',
        }).setOrigin(1, 0);

        this.hudContainer.add([
            this.hpBarBg, this.hpBarFill,
            this.xpBarBg, this.xpBarFill,
            this.levelText, this.timerText,
            this.waveText, this.killText,
        ]);
    }

    _updateHUD() {
        // HP bar
        this.hpBarFill.clear();
        const hpPercent = Math.max(0, this.playerHP / this.playerMaxHP);
        const hpColor = hpPercent > 0.5 ? 0x44ff44 : hpPercent > 0.25 ? 0xffaa00 : 0xff3344;
        this.hpBarFill.fillStyle(hpColor, 0.9);
        this.hpBarFill.fillRoundedRect(21, 16, 198 * hpPercent, 14, 3);

        // XP bar
        this.xpBarFill.clear();
        const xpPercent = this.playerXP / this.playerXPToLevel;
        this.xpBarFill.fillStyle(COLORS.XP_COLOR, 0.8);
        this.xpBarFill.fillRoundedRect(21, 36, 198 * xpPercent, 6, 2);

        // Texts
        this.levelText.setText(`Lv.${this.playerLevel}`);

        const seconds = Math.floor(this.gameTime / 1000);
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        this.timerText.setText(`${mins}:${secs}`);

        this.waveText.setText(`Wave ${this.currentWave}`);
        this.killText.setText(`☠ ${this.kills}`);
    }

    _repositionHUD() {
        if (!this.timerText) return;
        const w = this.gameWidth;
        this.timerText.setX(w / 2);
        this.waveText.setX(w / 2);
        this.killText.setX(w - 20);
    }

    // === TOUCH CONTROLS ===

    _createTouchControls() {
        this.touchActive = false;
        this.joystickDirection = null;
        this.joystickBase = null;
        this.joystickThumb = null;

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x < this.gameWidth / 2) {
                // Left side = joystick
                this.touchActive = true;
                this.joystickStartX = pointer.x;
                this.joystickStartY = pointer.y;

                if (!this.joystickBase) {
                    this.joystickBase = this.add.circle(pointer.x, pointer.y, 50, 0xffffff, 0.1)
                        .setScrollFactor(0).setDepth(99);
                    this.joystickThumb = this.add.circle(pointer.x, pointer.y, 20, 0xffffff, 0.3)
                        .setScrollFactor(0).setDepth(99);
                } else {
                    this.joystickBase.setPosition(pointer.x, pointer.y).setVisible(true);
                    this.joystickThumb.setPosition(pointer.x, pointer.y).setVisible(true);
                }
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (!this.touchActive) return;
            const dx = pointer.x - this.joystickStartX;
            const dy = pointer.y - this.joystickStartY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 40;

            if (dist > 5) {
                const clampedDist = Math.min(dist, maxDist);
                const angle = Math.atan2(dy, dx);
                this.joystickDirection = {
                    x: Math.cos(angle),
                    y: Math.sin(angle),
                };
                if (this.joystickThumb) {
                    this.joystickThumb.setPosition(
                        this.joystickStartX + Math.cos(angle) * clampedDist,
                        this.joystickStartY + Math.sin(angle) * clampedDist
                    );
                }
            } else {
                this.joystickDirection = null;
            }
        });

        this.input.on('pointerup', () => {
            this.touchActive = false;
            this.joystickDirection = null;
            if (this.joystickBase) this.joystickBase.setVisible(false);
            if (this.joystickThumb) this.joystickThumb.setVisible(false);
        });
    }

    // === BACKGROUND ===

    _createBackground(worldSize) {
        const half = worldSize / 2;
        const bg = this.add.graphics();
        bg.fillStyle(COLORS.BG_DARK, 1);
        bg.fillRect(-half, -half, worldSize, worldSize);

        // Grid
        const gridSize = 60;
        bg.lineStyle(1, COLORS.BG_GRID, 0.3);
        for (let x = -half; x <= half; x += gridSize) {
            bg.lineBetween(x, -half, x, half);
        }
        for (let y = -half; y <= half; y += gridSize) {
            bg.lineBetween(-half, y, half, y);
        }

        bg.setDepth(0);
    }

    // === GAME OVER ===

    _gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        window.soundManager?.play('death');
        this.physics.pause();

        // Camera effects
        this.cameras.main.shake(500, 0.02);

        // Slow motion effect
        this.time.delayedCall(500, () => {
            // Submit score
            const score = Math.floor(this.gameTime / 1000) * this.kills;
            window.yandexSDK?.submitScore('highscore', score);

            // Show interstitial ad
            window.yandexSDK?.showInterstitial();

            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                // Clean up orbitals
                this.orbitals.forEach(o => o.destroy());
                this.orbitals = [];

                this.scene.start('GameOverScene', {
                    time: this.gameTime,
                    kills: this.kills,
                    level: this.playerLevel,
                    wave: this.currentWave,
                    score: score,
                });
            });
        });
    }
}
