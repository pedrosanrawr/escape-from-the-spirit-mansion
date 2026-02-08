// dito nilalagay yung code para i-load yung level data sa game state
// like pag set ng player spawn, colliders, enemies, etc
// also may respawn function para pag namatay si player, mare-reset siya sa last checkpoint or spawn point

import { CONSTS, makePlayer } from "../engine/state";

export function buildLevelIntoState(state, levelDef) {
  const { H } = CONSTS;
  const GROUND_THICKNESS = H - CONSTS.GROUND_TOP_Y;

  state.levelData = levelDef;
  state.currentLevelId = levelDef.id;

  if (!state.player) state.player = makePlayer(levelDef.spawn);

  state.colliders = [];
  state.enemies = [];
  state.pickups = [];
  state.bullets = [];
  state.boss = null;
  state.goal = levelDef.goal ? { ...levelDef.goal } : null;

  state.checkpointX = null;
  state.checkpointY = null;
  state.player.hearts = state.player.maxHearts;

  respawn(state);

  for (const seg of levelDef.groundSegments ?? []) {
    state.colliders.push({
      x: seg.x,
      y: CONSTS.GROUND_TOP_Y,
      w: seg.w,
      h: GROUND_THICKNESS,
      tag: "ground",
    });
  }

  for (const plat of levelDef.platforms ?? []) {
    state.colliders.push({ ...plat, tag: "platform" });
  }

  state.enemies = (levelDef.enemies ?? []).map((e) => ({
    type: e.type ?? "walker",
    x: e.x,
    y:
    e.type === "flyer"
      ? 420
      : e.platformTopY != null
      ? e.platformTopY - 28 
      : CONSTS.GROUND_TOP_Y - 28,
    w: 34,
    h: 28,

    vx: (e.type ?? "walker") === "walker" ? 1.2 : 0,
    alive: true,
    squashFrames: 0,
    patrol: e.patrol ?? { minX: e.x - 200, maxX: e.x + 200 },
    fireCooldown: 0,
  }));

  state.pickups = (levelDef.pickups ?? []).map((p) => ({ ...p, taken: false }));

  if (levelDef.boss) {
    state.boss = {
      ...levelDef.boss,
      hp: levelDef.boss.maxHp,
      alive: true,
      dyingFrames: 0,
      vx: -1.2,
      attackCooldown: 0,
      lockGoal: true,
    };
  }
}

export function respawn(state) {
  const spawn = state.levelData?.spawn ?? { x: 60, y: 560 };

  state.player.x = spawn.x;
  state.player.y = spawn.y;

  state.player.vx = 0;
  state.player.vy = 0;
  state.player.onGround = false;

  state.jumpBufferFrames = 0;
  state.coyoteFrames = 0;

  state.player.invuln = 18;
}
