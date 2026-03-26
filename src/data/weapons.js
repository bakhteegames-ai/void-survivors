export const WEAPON_TYPES = {
    sprayCan: {
        name: 'Spray Can',
        description: 'Sprays bug-killing aerosol at nearest pest',
        type: 'projectile',
        damage: 10,
        fireRate: 800,
        speed: 350,
        range: 300,
        projectileCount: 1,
        pierce: 1,
        size: 8,
        color: 0x7ab648,    // green spray
        maxLevel: 8,
        upgrades: {
            damage: 5,
            fireRate: -50,
            projectileCount: 1, // every 3 levels
            pierce: 1, // every 4 levels
        },
    },
    bugZapper: {
        name: 'Bug Zapper',
        description: 'Chain zap fries multiple bugs at once',
        type: 'chain',
        damage: 15,
        fireRate: 1500,
        range: 250,
        chainCount: 3,
        chainRange: 120,
        size: 6,
        color: 0xf2c94c,    // electric yellow
        maxLevel: 8,
        upgrades: {
            damage: 7,
            fireRate: -100,
            chainCount: 1,
        },
    },
    hotSteam: {
        name: 'Hot Steam Aura',
        description: 'Scalding steam burns nearby pests',
        type: 'aura',
        damage: 5,
        fireRate: 500,
        range: 80,
        size: 80,
        color: 0xdedede,    // steam white
        maxLevel: 8,
        upgrades: {
            damage: 3,
            range: 15,
            fireRate: -30,
        },
    },
    slipperOrbit: {
        name: 'Slipper Orbit',
        description: 'Rotating slippers smack bugs on contact',
        type: 'orbital',
        damage: 12,
        fireRate: 100, // tick rate
        orbitCount: 2,
        orbitRadius: 80,
        orbitSpeed: 3,
        size: 14,
        color: 0xd94f3d,    // warm red slipper
        maxLevel: 8,
        upgrades: {
            damage: 5,
            orbitCount: 1,
            orbitRadius: 10,
        },
    },
    poisonBomb: {
        name: 'Poison Bomb',
        description: 'Fumigation bombs land on clusters of pests',
        type: 'aoe',
        damage: 30,
        fireRate: 3000,
        range: 400,
        aoeRadius: 60,
        meteorCount: 1,
        size: 20,
        color: 0x9b59b6,    // poison purple
        maxLevel: 8,
        upgrades: {
            damage: 15,
            fireRate: -200,
            meteorCount: 1,
            aoeRadius: 10,
        },
    },
};

export const PASSIVE_UPGRADES = {
    kitchenHustle: {
        name: 'Kitchen Hustle',
        description: 'Move faster around the kitchen',
        icon: '👟',
        maxLevel: 5,
        valuePerLevel: 20,
        stat: 'moveSpeed',
    },
    thickSkin: {
        name: 'Thick Skin',
        description: 'Increase max HP',
        icon: '💪',
        maxLevel: 5,
        valuePerLevel: 20,
        stat: 'maxHp',
    },
    crumbMagnet: {
        name: 'Crumb Magnet',
        description: 'Pick up crumbs from further away',
        icon: '🧲',
        maxLevel: 5,
        valuePerLevel: 30,
        stat: 'xpMagnet',
    },
    apronArmor: {
        name: 'Apron Armor',
        description: 'Reduce damage taken from pests',
        icon: '🧑‍🍳',
        maxLevel: 5,
        valuePerLevel: 3,
        stat: 'armor',
    },
    pestInstinct: {
        name: 'Pest Instinct',
        description: 'Better upgrade choices',
        icon: '🎯',
        maxLevel: 3,
        valuePerLevel: 1,
        stat: 'luck',
    },
};
