//dito nakalagay lahat ng game state related code
//like yung data structure ng player, enemies, colliders, etc

export const CONSTS = {
  W: 1916,
  H: 951,
  WORLD_W: 6000,
  GROUND_TOP_Y: 720,
};

export function createRuntimeState() {
  return {
    isReady: false,
    pendingLevelId: 1,
    currentLevelId: 1,
    cameraX: 0,

    levelData: null,

    player: null,
    colliders: [],
    enemies: [],
    pickups: [],
    bullets: [],
    boss: null,
    goal: null,
    checkpointX: null,
    checkpointY: null,

    jumpBufferFrames: 0,
    coyoteFrames: 0,
    JUMP_BUFFER_MAX: 8,
    COYOTE_MAX: 8,
  };
}

export function makePlayer(spawn = { x: 60, y: 560 }) {
  return {
    x: spawn.x,
    y: spawn.y,
    w: 28,
    h: 34,

    vx: 0,
    vy: 0,
    speed: 3.2,
    jump: 14,
    gravity: 0.48,
    onGround: false,
    facing: 1,

    isBig: false,
    hasBlaster: false,
    hasSword: false,

    hearts: 3,
    maxHearts: 3,

    invuln: 0,
  };
}
