import { state } from "app/engine/setup.js";
import { createLevel } from "app/engine/level.js";

//GUI/Buttons
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// GET THE DIALOGUE DATA
import data from "./eliza.json";
// MODELS
import { environmentPicture } from "../app/ui/environmentPicture";
// any global variables for this specific scene
// track pixel direction
let dir = false;
let pixelSize = 2;
let textIndex = -1;

let globe, tower, pixelPass;

const eliza = (world) => {
  const THREE = world.THREE;
  let levelTemplate = createLevel(world, data);
  // first draw pass, since addObjects() is different based on state objects with "doNotDispose" flag will not be deleted as state changes

  levelTemplate.firstPass = () => {
    let gui = new GUI();
    // ADD ANY OBJECTS OR VISUAL ELEMENTS
    // SET .doNotDispose = true so they're not deleted when it redraws
    // FIXME: surely there is a way to automate this
    let sprite = environmentPicture(THREE, "/pictures/eliza.png", world.scene);
    sprite.doNotDispose = true;
  };

  levelTemplate.customAnimations = () => {
    //set any custom animations, e.g. increase pixelation as decay increases
  };

  return levelTemplate;
};

export { eliza };
