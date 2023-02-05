import { spriteDialogueBox } from "app/ui/spriteDialogueBox.js";
import { RenderPixelatedPass } from "components/Three/RenderPixelatedPass.js";
let start = false
let pixelSize = 0

function decayMeter(state, world) {

  if (state.playerState.decayStart) {
    //fixme: dumb dumb dumb
    if (start = false) {
      let pixelPass = new RenderPixelatedPass(pixelSize, world.scene, world.camera);
      world.composer.addPass(pixelPass);
      start = true
    }
    pixelSize += state.playerState.decay/100
    pixelPass.setPixelSize(pixelSize)

    // just adding floating poitns here so it looks "cool"
    let sprite = spriteDialogueBox(`DECAY: ${state.playerState.decay / 1.001}`);
    sprite.backgroundColor = null;
    if (state.playerState.decay < 45) {
      sprite.color = "green";
    } else if (state.playerState.decay < 75) {
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
