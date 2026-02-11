//dito nilalagay lahat ng level data, like yung layout ng ground, platforms, enemy placements, etc
//also may functions para kunin yung level data pag kailangan sa game state
//dito ka mageedit ng environment ng level, like pag gusto mo magdagdag ng platform, colliders, etc

const WORLD_W = 6000;

export const LEVELS = {
  1: {
    id: 1,
    name: "Level 1",

    spawn: { x: 60, y: 560 },

    groundSegments: [
      { x: 0, w: 970 },
      { x: 1180, w: 1450 },
      { x: 2800, w: 1800 },
      { x: 4800, w: 1200 },
    ],

    platforms: [
      { x: 1400, y: 650, w: 130, h: 70 },
      { x: 1800, y: 620, w: 130, h: 100 },
      { x: 2300, y: 680, w: 130, h: 40 },

      { x: 3000, y: 680, w: 360, h: 40 },
      { x: 3500, y: 560, w: 400, h: 20 },
      { x: 4000, y: 460, w: 400, h: 20 },
    ],

    enemies: [
      { type: "walker", x: 520, patrol: { minX: 220, maxX: 920 } },
      { type: "walker", x: 1535, patrol: { minX: 1535, maxX: 1795 } },
      { type: "walker", x: 2335, patrol: { minX: 1935, maxX: 2295 } },
      { type: "walker", x: 3450, patrol: { minX: 3450, maxX: 4000 } },
      {
        type: "walker",
        x: 3500,
        patrol: { minX: 3500, maxX: 3900 },
        platformTopY: 560,
      },
      {
        type: "walker",
        x: 4000,
        patrol: { minX: 4000, maxX: 4400 },
        platformTopY: 460,
      },
      { type: "walker", x: 4200, patrol: { minX: 4200, maxX: 4600 } },
    ],

    pickups: [
      { type: "mushroom", x: 1450, y: 520, w: 26, h: 26 },
      { type: "sword", x: 3665, y: 450, w: 26, h: 26 },
    ],

    goal: { x: 5600, y: 620, w: 44, h: 70 },
    boss: {
    type: "walker",
      x: 5200,
      y: 600,
      w: 90,
      h: 120,
      maxHp: 12,
      patrol: { minX: 4900, maxX: 5500 },
    },
  },

  2: {
    id: 2,
    name: "Level 2",

    spawn: { x: 60, y: 560 },
    groundSegments: [
      { x: 0, w: 970 },
      { x: 1180, w: 1450 },
      { x: 2800, w: 1800 },
      { x: 4800, w: 1200 },
    ],

    platforms: [
      { x: 1380, y: 650, w: 130, h: 70 },
      { x: 1780, y: 620, w: 130, h: 100 },
      { x: 2280, y: 680, w: 130, h: 40 },

      { x: 3050, y: 680, w: 360, h: 40 },
      { x: 3520, y: 560, w: 400, h: 20 },
      { x: 3980, y: 460, w: 400, h: 20 },

      { x: 4560, y: 420, w: 220, h: 20 },
    ],

    enemies: [
      { type: "walker", x: 520, patrol: { minX: 220, maxX: 920 } },
      { type: "chaser", x: 820 },
      { type: "walker", x: 1535, patrol: { minX: 1180, maxX: 1750 } },
      { type: "walker", x: 1780, patrol: { minX: 1780, maxX: 1910 }, platformTopY: 620 },
      { type: "chaser", x: 2050 },
      { type: "walker", x: 2335, patrol: { minX: 1935, maxX: 2295 } },
      { type: "walker", x: 3450, patrol: { minX: 3000, maxX: 3650 } },
      { type: "walker", x: 3520, patrol: { minX: 3520, maxX: 3920 }, platformTopY: 560 },
      { type: "walker", x: 3980, patrol: { minX: 3980, maxX: 4380 }, platformTopY: 460 },
      { type: "chaser", x: 4400 },
      { type: "walker", x: 4560, patrol: { minX: 4560, maxX: 4780 }, platformTopY: 420 },
    ],

    pickups: [
      { type: "mushroom", x: 1450, y: 520, w: 26, h: 26 },
      { type: "sword", x: 4660, y: 390, w: 26, h: 26 },
    ],

    goal: { x: 5600, y: 620, w: 44, h: 70 },
    boss: {
      type: "swordsman",
      x: 5200,
      y: 630,
      w: 90,
      h: 90,
      maxHp: 26,
      patrol: { minX: 4900, maxX: 5550 },
    }
  },

  3: {
    id: 3,
    name: "Level 3 – Boss",

    spawn: { x: 60, y: 560 },
    groundSegments: [{ x: 0, w: WORLD_W }],

    platforms: [
      { x: 700, y: 640, w: 220, h: 18 },
    ],

    enemies: [
      { type: "walker", x: 500 },
      { type: "chaser", x: 1300 },
      { type: "flyer", x: 2000 },
    ],

    pickups: [
      { type: "mushroom", x: 720, y: 600, w: 26, h: 26 },
      { type: "blaster", x: 1120, y: 550, w: 26, h: 26 },
      { type: "sword", x: 1520, y: 500, w: 26, h: 26 },
    ],

    goal: { x: 5600, y: 620, w: 44, h: 70 },

    boss: {
      type: "caster",
      x: 5200,
      y: 560,
      w: 90,
      h: 90,
      maxHp: 25,
    }
  },
};

export function getLevelById(id) {
  return LEVELS[id] ?? null;
}

export function getAllLevels() {
  return Object.values(LEVELS).map((l) => ({
    id: l.id,
    name: l.name,
  }));
}
