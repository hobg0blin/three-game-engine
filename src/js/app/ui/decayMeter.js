import { spriteDialogueBox } from "app/ui/spriteDialogueBox.js";
import { RenderPixelatedPass } from "components/Three/RenderPixelatedPass.js";
let start = false;
let pixelSize = 0;
let pixelPass;

function decayMeter(state, world) {
  //fixme: all of this is so dumb
  if (state.gameState.currentLevelIndex == 0) {
    console.log("setting pixel size");
    pixelSize = 1.25;
    if (world.pixelPass != undefined) {
      world.pixelSize == pixelSize;
    }
  }
  if (start == false && world.pixelPass == undefined) {
    console.log("ADDING PIXEL PASS");
    pixelPass = new RenderPixelatedPass(pixelSize, world.scene, world.camera);
    pixelPass.doNotDispose = true;
    pixelPass.permanent = true;

    world.composer.addPass(pixelPass);
    world.pixelPass = pixelPass;
    start = true;
  }
  if (state.playerState.decayStart) {
    //fixme: dumb dumb dumb
    pixelSize += state.playerState.decay / 750;

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
    sprite.position.x = -110;
    sprite.position.y = -75;
    world.scene.add(sprite);
  }
  world.pixelSize = pixelSize;
}

export { decayMeter };
