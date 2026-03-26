// Game balance constants
export const BALANCE = {
    // Player
    PLAYER_SPEED: 200,
    PLAYER_MAX_HP: 100,
    PLAYER_IFRAMES: 1000, // invincibility frames in ms
    PLAYER_XP_MAGNET_RANGE: 80,

    // XP & Leveling
    XP_BASE: 10,
    XP_GROWTH: 1.15, // each level needs 15% more XP
    XP_ORB_VALUE: 1,
    XP_ORB_SPEED: 300,

    // Enemies
    ENEMY_SPAWN_RATE: 1500, // ms between spawns
    ENEMY_SPAWN_RATE_MIN: 300,
    ENEMY_SPAWN_RATE_DECAY: 0.97, // gets faster each wave
    ENEMY_SPAWN_DISTANCE: 500, // spawn distance from player
    ENEMY_MAX_COUNT: 150,

    // Waves
    WAVE_DURATION: 30000, // 30 sec per wave
    BOSS_WAVE_INTERVAL: 4, // boss every 4 waves

    // Game
    GAME_AREA_SIZE: 3000, // world size
};

export const COLORS = {
    NEON_CYAN: 0x00ffff,
    NEON_PINK: 0xff00ff,
    NEON_GREEN: 0x00ff88,
    NEON_YELLOW: 0xffff00,
    NEON_ORANGE: 0xff8800,
    NEON_RED: 0xff3344,
    NEON_BLUE: 0x4488ff,
    NEON_PURPLE: 0xaa44ff,
    XP_COLOR: 0x44ffaa,
    HP_COLOR: 0xff3344,
    HP_BG: 0x331111,
    BG_DARK: 0x0a0a0f,
    BG_GRID: 0x151520,
    UI_BG: 0x1a1a2e,
    UI_BORDER: 0x333366,
    TEXT_WHITE: '#ffffff',
    TEXT_GLOW: '#00ffff',
};
