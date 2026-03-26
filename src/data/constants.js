// Game balance constants
export const BALANCE = {
    // Player
    PLAYER_SPEED: 200,
    PLAYER_MAX_HP: 100,
    PLAYER_IFRAMES: 1000, // invincibility frames in ms
    PLAYER_XP_MAGNET_RANGE: 80,

    // XP & Leveling (crumbs)
    XP_BASE: 5,
    XP_GROWTH: 1.25, // each level needs 25% more XP
    XP_ORB_VALUE: 1,
    XP_ORB_SPEED: 400,

    // Enemies
    ENEMY_SPAWN_RATE: 1000, // ms between spawns
    ENEMY_SPAWN_RATE_MIN: 200,
    ENEMY_SPAWN_RATE_DECAY: 0.96, // gets faster each wave
    ENEMY_SPAWN_DISTANCE: 400, // spawn distance from player
    ENEMY_MAX_COUNT: 150,

    // Waves
    WAVE_DURATION: 30000, // 30 sec per wave
    BOSS_WAVE_INTERVAL: 4, // boss every 4 waves

    // Game
    GAME_AREA_SIZE: 3000, // world size
};

export const COLORS = {
    // Warm kitchen palette
    KITCHEN_CREAM: 0xf5e6c8,
    KITCHEN_BROWN: 0x8b6f47,
    KITCHEN_ORANGE: 0xe8913a,
    KITCHEN_YELLOW: 0xf2c94c,
    KITCHEN_RED: 0xd94f3d,
    KITCHEN_GREEN: 0x7ab648,
    KITCHEN_TEAL: 0x4a9e8e,
    KITCHEN_WARM_WHITE: 0xfff8ee,

    // Functional
    XP_COLOR: 0xf2c94c,       // crumb gold
    HP_COLOR: 0xd94f3d,       // warm red
    HP_BG: 0x3d2215,          // dark brown
    BG_FLOOR: 0xf0dbb8,       // warm cream floor
    BG_TILE: 0xe5cea3,        // slightly darker tile lines
    UI_BG: 0x3d2a1a,          // dark warm brown
    UI_BORDER: 0x8b6f47,      // kitchen brown
    TEXT_WHITE: '#fff8ee',
    TEXT_ACCENT: '#e8913a',
};
