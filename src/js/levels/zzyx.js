import { state } from "app/engine/setup.js";
import { createLevel } from "app/engine/level.js";

//GUI/Buttons
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// GET THE DIALOGUE DATA
import zzyxGibberish from "../data/zzyx/ZZYX_dialogue_gibberish.json";
import { environmentPicture } from "../app/ui/environmentPicture";
// MODELS

// any global variables for this specific scene
// track pixel direction
let dir = false;
let pixelSize = 2;
let textIndex = -1;

let globe, tower, pixelPass;

const zzyx = (world) => {
  const THREE = world.THREE;
  let levelTemplate = createLevel(world, zzyxGibberish);
  // first draw pass, since addObjects() is different based on state objects with "doNotDispose" flag will not be deleted as state changes

  levelTemplate.firstPass = () => {
    let gui = new GUI();
    // ADD ANY OBJECTS OR VISUAL ELEMENTS
    const zzyxPic = environmentPicture(
      THREE,
      "/pictures/zzyx.png",
      world.scene
    );
    zzyxPic.doNotDispose = true;
    // SET .doNotDispose = true so they're not deleted when it redraws
    // FIXME: surely there is a way to automate this
  };

  levelTemplate.customAnimations = () => {
    //set any custom animations, e.g. increase pixelation as decay increases
  };

  return levelTemplate;
};

export { zzyx };
