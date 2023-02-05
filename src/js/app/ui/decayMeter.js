import { spriteDialogueBox } from "app/ui/spriteDialogueBox.js";
function decayMeter(state, world) {
  if (state.playerState.decayStart) {
    let sprite = spriteDialogueBox(`DECAY: ${state.playerState.decay / 125}`);
    sprite.backgroundColor = null;
    if (state.playerState.decay < 50) {
      sprite.color = "green";
    } else if (state.playerState.decay < 85) {
      sprite.color = "yellow";
    } else {
      sprite.color = "red";
      console.log("hit decay ending");
    }
    sprite.position.x = 80;
    sprite.position.y = -75;
    world.scene.add(sprite);
  }
}

export { decayMeter };
