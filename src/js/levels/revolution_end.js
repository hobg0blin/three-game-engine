// import scene template
import { createLevel, disposeAll } from "app/engine/level.js";
import { state } from "app/engine/setup.js";
import data from "./revolution_end.json";
import { environmentPicture } from "../app/ui/environmentPicture";
//GUI/Buttons
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { mouse } from "components/Three/mouseTracker.js";

// text stuff

// MODELS
import { importSTLModel } from "components/Three/importSTLModel.js";
import { buildTower } from "components/Three/buildTower.js";
//

// any global variables for this specific scene
// track pixel direction
let dir = false;
let textIndex = -1;

let globe, tower;

const revolution_end = (world) => {
  const THREE = world.THREE;
  let levelTemplate = createLevel(world, data);

  // first draw pass, since addObjects() is different based on state objects with "doNotDispose" flag will not be deleted as state changes

  levelTemplate.firstPass = () => {
    let sprite = environmentPicture(THREE, "/pictures/revolution_end.png", world.scene);
    sprite.doNotDispose = true;
  };
  // animate globe and tower, etc.
  // you could do fun camera stuff here too
  levelTemplate.customAnimations = () => {
    if (globe != undefined && tower != undefined) {
      globe.rotation.z += 0.003;
      tower.rotation.y += 0.003;
    }
  };

  console.log("level template: ", levelTemplate);
  return levelTemplate;
};

export { revolution_end };
