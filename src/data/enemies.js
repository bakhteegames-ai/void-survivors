export const ENEMY_TYPES = {
    cockroach: {
        name: 'Cockroach',
        hp: 20,
        speed: 60,
        damage: 10,
        xpValue: 1,
        size: 20,
        color: 0x6b4226,    // dark brown
        minWave: 1,
        spawnWeight: 10,
    },
    fly: {
        name: 'Fly',
        hp: 35,
        speed: 80,
        damage: 15,
        xpValue: 2,
        size: 22,
        color: 0x4a6741,    // dark green
        minWave: 3,
        spawnWeight: 7,
    },
    moth: {
        name: 'Moth',
        hp: 15,
        speed: 120,
        damage: 8,
        xpValue: 2,
        size: 18,
        color: 0xc9b896,    // pale tan
        minWave: 5,
        spawnWeight: 5,
    },
    beetle: {
        name: 'Beetle',
        hp: 80,
        speed: 40,
        damage: 25,
        xpValue: 5,
        size: 30,
        color: 0x2d2d2d,    // dark shell
        minWave: 7,
        spawnWeight: 3,
    },
    hornet: {
        name: 'Hornet',
        hp: 50,
        speed: 100,
        damage: 20,
        xpValue: 4,
        size: 24,
        color: 0xe8b520,    // yellow-black
        minWave: 10,
        spawnWeight: 4,
    },
};

export const BOSS_TYPES = {
    cockroachQueen: {
        name: 'Cockroach Queen',
        hp: 500,
        speed: 50,
        damage: 30,
        xpValue: 50,
        size: 50,
        color: 0x8b4513,    // big brown
    },
    giantMutantFly: {
        name: 'Giant Mutant Fly',
        hp: 800,
        speed: 35,
        damage: 40,
        xpValue: 80,
        size: 55,
        color: 0x3d6b35,    // sickly green
    },
    fridgeMonster: {
        name: 'Fridge Monster',
        hp: 1200,
        speed: 45,
        damage: 50,
        xpValue: 120,
        size: 65,
        color: 0xd0d0d0,    // fridge white-gray
    },
};
