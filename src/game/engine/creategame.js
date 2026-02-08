//eto pinaka sketch file natin
//dito nag rurun ung game
//nandito rin lahat ng functions ng game
//like physics, collision, enemy behavior, etc

import p5 from "p5";
import { createRuntimeState, CONSTS, makePlayer } from "./state";
import { createInput } from "./input";
import { rectOverlap, circleRectOverlap, clamp } from "./physics";
import { getLevelById } from "../levels/registry";
import { buildLevelIntoState, respawn } from "../levels/loadlevel";
import { render } from "./renderer";

const STORAGE_KEY = "spirit_mansion_unlocked_level"; //naka store narin pala sa local storage data ng player, (no db used)

function getUnlockedLevel() {
  const v = Number(localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(v) && v >= 1 ? v : 1;
}

function unlockLevel(levelNumber) {
  const current = getUnlockedLevel();
  const next = Math.max(current, levelNumber);
  localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

export function createGame() {
  let instance = null;
  const state = createRuntimeState();

  const sketch = (p) => {
    const input = createInput(p);

    p.setLevel = (id) => {
      state.pendingLevelId = Number(id) || 1;
      if (!state.isReady) return;
      loadLevel(state.pendingLevelId);
    };

    p.setup = () => {
      p.pixelDensity(1);
      const c = p.createCanvas(CONSTS.W, CONSTS.H);
      c.elt.style.width = `${CONSTS.W}px`;
      c.elt.style.height = `${CONSTS.H}px`;
      c.elt.style.display = "block";

      state.player = makePlayer();
      state.isReady = true;

      loadLevel(state.pendingLevelId);
    };

    p.keyPressed = () => input.onKeyPressed();

    p.draw = () => {
      const frameActions = { ...input.actions };
      input.resetFrameActions();

      tick(p, input, frameActions);
      render(p, state);
      checkGoal();
    };

    function loadLevel(id) {
      const level = getLevelById(id);
      if (!level) return;
      buildLevelIntoState(state, level);
    }

    function tick(p, input, actions) {
      updatePlayer(p, input.move());
      handlePlayerCollisions();

      updateEnemies();
      updatePickups();

      if (actions.shoot && state.player.hasBlaster) shoot();
      if (actions.sword && state.player.hasSword) swordAttack();

      updateBullets();
      updateBoss();
      updateCamera();
    }

    function playerTakeHit() {
      const pl = state.player;
      if (pl.invuln > 0) return;

      if (pl.isBig) {
        pl.isBig = false;
        pl.w = 28;
        pl.h = 34;
        pl.invuln = 60;
        return;
      }

      pl.hearts -= 1;
      pl.invuln = 90;

      if (pl.hearts <= 0) {
        gameOver();
      } else {
        respawnAtCheckpoint();
      }
    }

    function gameOver() {
      loadLevel(state.currentLevelId);
    }

    function updatePlayer(p, move) {
      const pl = state.player;

      pl.vx = 0;
      if (move.left) pl.vx = -pl.speed;
      if (move.right) pl.vx = pl.speed;
      if (pl.vx !== 0) pl.facing = Math.sign(pl.vx);

      if (move.jumpHeld) state.jumpBufferFrames = state.JUMP_BUFFER_MAX;
      else state.jumpBufferFrames = Math.max(0, state.jumpBufferFrames - 1);

      if (pl.onGround) state.coyoteFrames = state.COYOTE_MAX;
      else state.coyoteFrames = Math.max(0, state.coyoteFrames - 1);

      pl.vy += pl.gravity;

      const wantsJump = state.jumpBufferFrames > 0;
      const canJump = state.coyoteFrames > 0;
      if (wantsJump && canJump) {
        pl.vy = -pl.jump;
        pl.onGround = false;
        state.jumpBufferFrames = 0;
        state.coyoteFrames = 0;
      }

      pl.x += pl.vx;
      pl.y += pl.vy;

      pl.x = clamp(pl.x, 0, CONSTS.WORLD_W - pl.w);

      if (pl.invuln > 0) pl.invuln--;
      if (pl.y > CONSTS.H + 400) {
        playerTakeHit();
      }

      if (
        pl.onGround &&
        (state.checkpointX === null || pl.x > state.checkpointX + 400)
      ) {
        state.checkpointX = pl.x;
        state.checkpointY = pl.y;
      }
    }

    function handlePlayerCollisions() {
      const pl = state.player;

      const prevX = pl.x - pl.vx;
      const prevY = pl.y - pl.vy;

      pl.onGround = false;

      for (const c of state.colliders) {
        if (!rectOverlap(pl.x, pl.y, pl.w, pl.h, c.x, c.y, c.w, c.h)) continue;

        const overlapLeft = (pl.x + pl.w) - c.x;
        const overlapRight = (c.x + c.w) - pl.x;
        const overlapTop = (pl.y + pl.h) - c.y;
        const overlapBottom = (c.y + c.h) - pl.y;

        const wasAbove = (prevY + pl.h) <= c.y;
        const wasBelow = prevY >= (c.y + c.h);
        const wasLeft = (prevX + pl.w) <= c.x;
        const wasRight = prevX >= (c.x + c.w);

        if (wasAbove) {
          pl.y = c.y - pl.h;
          pl.vy = 0;
          pl.onGround = true;
          continue;
        }

        if (wasBelow) {
          pl.y = c.y + c.h;
          if (pl.vy < 0) pl.vy = 0;
          continue;
        }

        if (wasLeft) {
          pl.x = c.x - pl.w;
          pl.vx = 0;
          continue;
        }

        if (wasRight) {
          pl.x = c.x + c.w;
          pl.vx = 0;
          continue;
        }

        const minX = Math.min(overlapLeft, overlapRight);
        const minY = Math.min(overlapTop, overlapBottom);

        if (minX < minY) {
          if (overlapLeft < overlapRight) pl.x -= overlapLeft;
          else pl.x += overlapRight;
          pl.vx = 0;
        } else {
          if (overlapTop < overlapBottom) {
            pl.y -= overlapTop;
            pl.vy = 0;
            pl.onGround = true;
          } else {
            pl.y += overlapBottom;
            if (pl.vy < 0) pl.vy = 0;
          }
        }
      }
    }

    function updateEnemies() {
      const pl = state.player;

      for (const en of state.enemies) {
        if (!en.alive) continue;

        switch (en.type) {
          case "walker": {
            en.x += en.vx;

            const minX = en.patrol?.minX ?? (en.x - 200);
            const maxX = en.patrol?.maxX ?? (en.x + 200);

            if (en.x < minX) {
              en.x = minX;
              en.vx = Math.abs(en.vx);
            } else if (en.x + en.w > maxX) {
              en.x = maxX - en.w;
              en.vx = -Math.abs(en.vx);
            }
            break;
          }

          case "chaser":
            en.x += Math.sign(state.player.x - en.x) * 1.1;
            break;

          case "flyer":
            en.fireCooldown--;
            en.y += Math.sin(p.frameCount * 0.05) * 0.8;

            if (en.fireCooldown <= 0) {
              spawnEnemyProjectile(en);
              en.fireCooldown = 160;
            }
            break;
        }

        if (rectOverlap(pl.x, pl.y, pl.w, pl.h, en.x, en.y, en.w, en.h)) {
          const prevBottom = (pl.y - pl.vy) + pl.h;
          const enemyTop = en.y;

          const stomp =
            pl.vy > 0 && prevBottom <= enemyTop + 6; 

          if (stomp) {
            en.alive = false;
            en.squashFrames = 18;
            pl.vy = -8.5; 
          } else {
            playerTakeHit();
          }
        }
      }
    }

    function updatePickups() {
      const pl = state.player;
      for (const pu of state.pickups) {
        if (pu.taken) continue;
        if (rectOverlap(pl.x, pl.y, pl.w, pl.h, pu.x, pu.y, pu.w, pu.h)) {
          pu.taken = true;
          applyPowerup(pu.type);
        }
      }
    }

    function applyPowerup(type) {
      const pl = state.player;

      if (type === "mushroom") {
        pl.isBig = true;
        pl.w = 34;
        pl.h = 48;
      }
      if (type === "blaster") pl.hasBlaster = true;
      if (type === "sword") pl.hasSword = true;
    }

    function shoot() {
      const pl = state.player;
      state.bullets.push({
        x: pl.x + (pl.facing > 0 ? pl.w : -8),
        y: pl.y + pl.h * 0.45,
        r: 5,
        vx: pl.facing * 10,
        life: 80,
      });
    }

    function updateBullets() {
      for (const b of state.bullets) {
        b.x += b.vx;
        b.life--;

        if (b.fromEnemy) {
          const pl = state.player;
          if (circleRectOverlap(b.x, b.y, b.r, pl.x, pl.y, pl.w, pl.h)) {
            playerTakeHit();
            b.life = 0;
            continue;
          }
        }

        for (const en of state.enemies) {
          if (!en.alive) continue;
          if (circleRectOverlap(b.x, b.y, b.r, en.x, en.y, en.w, en.h)) {
            en.alive = false;
            en.squashFrames = 18;
            b.life = 0;
          }
        }

        if (state.boss && state.boss.alive) {
          const bo = state.boss;
          if (circleRectOverlap(b.x, b.y, b.r, bo.x, bo.y, bo.w, bo.h)) {
            damageBoss(1);
            b.life = 0;
          }
        }
      }

      state.bullets = state.bullets.filter(
        (b) => b.life > 0 && b.x > -200 && b.x < CONSTS.WORLD_W + 200
      );
    }

    function swordAttack() {
      const pl = state.player;
      const rangeW = 46;
      const hit = {
        x: pl.facing > 0 ? pl.x + pl.w : pl.x - rangeW,
        y: pl.y + 6,
        w: rangeW,
        h: pl.h - 12,
      };

      for (const en of state.enemies) {
        if (!en.alive) continue;
        if (rectOverlap(hit.x, hit.y, hit.w, hit.h, en.x, en.y, en.w, en.h)) {
          en.alive = false;
          en.squashFrames = 18;
        }
      }

      if (state.boss && state.boss.alive) {
        const bo = state.boss;
        if (rectOverlap(hit.x, hit.y, hit.w, hit.h, bo.x, bo.y, bo.w, bo.h)) {
          damageBoss(2);
        }
      }
    }

    function updateBoss() {
      const bo = state.boss;
      if (!bo || !bo.alive) return;

      bo.attackCooldown = Math.max(0, bo.attackCooldown - 1);

      switch (bo.type) {
        case "walker":
          bossWalker(bo);
          break;

        case "swordsman":
          bossSword(bo);
          break;

        case "caster":
          bossCaster(bo);
          break;
      }

      const pl = state.player;

      if (rectOverlap(pl.x, pl.y, pl.w, pl.h, bo.x, bo.y, bo.w, bo.h)) {
        const prevBottom = (pl.y - pl.vy) + pl.h;
        const bossTop = bo.y;

        const stomp = pl.vy > 0 && prevBottom <= bossTop + 10;

        if (stomp) {
          damageBoss(2);      
          pl.vy = -9.5;       
          pl.invuln = Math.max(pl.invuln, 18); 
        } else {
          playerTakeHit();  
        }
      }
    }

    function bossWalker(bo) {
      bo.x += bo.vx;

      const minX = bo.patrol?.minX ?? (bo.x - 250);
      const maxX = bo.patrol?.maxX ?? (bo.x + 250);

      if (bo.x < minX) {
        bo.x = minX;
        bo.vx = Math.abs(bo.vx);
      } else if (bo.x + bo.w > maxX) {
        bo.x = maxX - bo.w;
        bo.vx = -Math.abs(bo.vx);
      }
    }

    function bossSword(bo) {
      bossWalker(bo);
      if (bo.attackCooldown === 0 && Math.abs(bo.x - state.player.x) < 80) {
        playerTakeHit();
        bo.attackCooldown = 60;
      }
    }

    function bossCaster(bo) {
      if (bo.attackCooldown === 0) {
        spawnEnemyProjectile(bo);
        bo.attackCooldown = 120;
      }
    }

    function damageBoss(amount) {
      const bo = state.boss;
      if (!bo || !bo.alive) return;

      bo.hp = Math.max(0, bo.hp - amount);
      if (bo.hp <= 0) {
        bo.alive = false;
        bo.dyingFrames = 45;
        bo.lockGoal = false;
      }
    }

    function updateCamera() {
      const pl = state.player;
      const target = pl.x + pl.w / 2 - CONSTS.W / 2;
      state.cameraX = clamp(target, 0, CONSTS.WORLD_W - CONSTS.W);
    }

    function checkGoal() {
      if (!state.goal) return;

      const bo = state.boss;
      const locked = bo && (bo.alive || bo.dyingFrames > 0) && bo.lockGoal;
      if (locked) return;

      const pl = state.player;
      const g = state.goal;

      if (rectOverlap(pl.x, pl.y, pl.w, pl.h, g.x, g.y, g.w, g.h)) {
        unlockLevel(state.currentLevelId + 1);
        window.dispatchEvent(
          new CustomEvent("LEVEL_COMPLETE", { detail: { level: state.currentLevelId } })
        );
        loadLevel(state.currentLevelId);
      }
    }

    function respawnAtCheckpoint() {
      const pl = state.player;

      if (state.checkpointX !== null) {
        pl.x = state.checkpointX;
        pl.y = state.checkpointY;
      } else {
        respawn(state);
      }

      pl.vx = 0;
      pl.vy = 0;
      pl.invuln = 60;
    }

    function spawnEnemyProjectile(src) {
      const dir = Math.sign(state.player.x - src.x) || 1;

      state.bullets.push({
        x: src.x + src.w / 2,
        y: src.y + src.h / 2,
        r: 6,
        vx: dir * 6,     
        life: 120,
        fromEnemy: true, 
      });
    }
  };

  return {
    mount(parentEl, initialLevelId) {
      if (instance) return instance;
      parentEl.innerHTML = "";
      instance = new p5(sketch, parentEl);
      instance.setLevel?.(initialLevelId ?? 1);
      return instance;
    },
    setLevel(levelId) {
      instance?.setLevel?.(levelId);
    },
    unmount() {
      instance?.remove();
      instance = null;
    },
  };
}
