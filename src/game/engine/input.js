//dito nakalagay lahat ng input handling ng game
//like kung anong keys yung pipindutin ni player

export function createInput(p) {
  const actions = {
    shoot: false,
    sword: false,
  };

  function resetFrameActions() {
    actions.shoot = false;
    actions.sword = false;
  }

  function onKeyPressed() {
    if (p.key === "j" || p.key === "J") actions.shoot = true; //for blaster
    if (p.key === "k" || p.key === "K") actions.sword = true; //for sword
  }

  //movement and jump
  function move() {
    const left = p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65);
    const right = p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68);

    const jumpHeld =
      p.keyIsDown(32) || p.keyIsDown(87) || p.keyIsDown(p.UP_ARROW);

    return { left, right, jumpHeld };
  }

  return { actions, resetFrameActions, onKeyPressed, move };
}
