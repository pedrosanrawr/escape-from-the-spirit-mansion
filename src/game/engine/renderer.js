//dito nakalagay lahat ng rendering code ng game
//like pag draw ng player, enemies, bullets, etc

import { CONSTS } from "./state";

export function render(p, state) {
  p.background(18);
  p.noStroke();

  for (const c of state.colliders) {
    p.fill(c.tag === "ground" ? 45 : 70);
    p.rect(c.x - state.cameraX, c.y, c.w, c.h);
  }

  for (const pu of state.pickups) {
    if (pu.taken) continue;
    if (pu.type === "mushroom") p.fill(255, 90, 90);
    if (pu.type === "blaster") p.fill(90, 180, 255);
    if (pu.type === "sword") p.fill(230);
    p.rect(pu.x - state.cameraX, pu.y, pu.w, pu.h, 6);
  }

  for (const en of state.enemies) {
    if (!en.alive && en.squashFrames <= 0) continue;
    if (en.type === "chaser") p.fill(255, 170, 70);
    else if (en.type === "flyer") p.fill(170, 120, 255);
    else p.fill(200, 150, 90);
    if (!en.alive) {
      p.rect(en.x - state.cameraX, en.y + en.h * 0.6, en.w, en.h * 0.4, 6);
    } else {
      p.rect(en.x - state.cameraX, en.y, en.w, en.h, 6);
    }
  }

  const boss = state.boss;
  if (boss) {
    if (boss.alive) {
      p.fill(255, 120, 120);
      p.rect(boss.x - state.cameraX, boss.y, boss.w, boss.h, 10);
    } else if (boss.dyingFrames > 0) {
      p.fill(255, 120, 120, p.map(boss.dyingFrames, 45, 0, 255, 0));
      p.rect(boss.x - state.cameraX, boss.y, boss.w, boss.h, 10);
    }
  }

  p.fill(255);
  for (const b of state.bullets) p.circle(b.x - state.cameraX, b.y, b.r * 2);

  if (state.goal) {
    const locked = boss && (boss.alive || boss.dyingFrames > 0) && boss.lockGoal;
    p.fill(locked ? 90 : p.color(140, 255, 140));
    p.rect(
      state.goal.x - state.cameraX,
      state.goal.y,
      state.goal.w,
      state.goal.h,
      8
    );
  }

  const pl = state.player;
  if (!(pl.invuln > 0 && Math.floor(p.frameCount / 3) % 2 === 0)) {
    p.fill(80, 200, 255);
    p.rect(pl.x - state.cameraX, pl.y, pl.w, pl.h, 6);
  }

  renderHUD(p, state);
}

function renderHUD(p, state) {
  const { W } = CONSTS;

  p.fill(0, 140);
  p.rect(10, 10, 300, 118, 12);

  p.fill(255);
  p.textSize(14);
  p.text(`Level: ${state.currentLevelId}`, 20, 35);

  const pl = state.player;
  const powers = [];
  if (pl.isBig) powers.push("BIG");
  if (pl.hasBlaster) powers.push("BLASTER");
  if (pl.hasSword) powers.push("SWORD");
  p.text(`Powers: ${powers.length ? powers.join(", ") : "None"}`, 20, 55);

  if (state.boss) {
    const boss = state.boss;
    const barW = 520;
    const barH = 16;
    const x = (CONSTS.W - barW) / 2;
    const y = 18;

    p.noStroke();
    p.fill(0, 170);
    p.rect(x - 10, y - 10, barW + 20, barH + 20, 14);

    p.fill(70);
    p.rect(x, y, barW, barH, 10);

    const pct = boss.maxHp ? boss.hp / boss.maxHp : 0;
    p.fill(255, 90, 90);
    p.rect(x, y, barW * pct, barH, 10);

    p.fill(255);
    p.textSize(12);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("BOSS", x + barW / 2, y + barH / 2);
    p.textAlign(p.LEFT, p.BASELINE);
  }

  p.text(`Jump: Up | J shoot | K sword`, 20, 95);
  p.text(`❤ ${state.player.hearts}`, 20, 115);
}
