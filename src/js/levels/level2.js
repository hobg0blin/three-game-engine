// import scene template
import { createLevel, disposeAll } from "app/engine/level.js";
import { createDialogueBox } from "app/ui/dialogueBox.js";

//GUI/Buttons
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { mouse } from "components/Three/mouseTracker.js";

// text stuff

// MODELS
import { importSTLModel } from "components/Three/importSTLModel.js";
import { buildTower } from "components/Three/buildTower.js";
//

import { RenderPixelatedPass } from "components/Three/RenderPixelatedPass.js";
import { environmentPicture } from "../app/ui/environmentPicture";
import { spriteDialogueBox } from "../app/ui/spriteDialogueBox";
import { troikaDialogueBox } from "../app/ui/troikaDialogueBox";
import { createButton } from "../app/ui/button";

import data from './schuyler.json'
// any global variables for this specific scene
// track pixel direction
let dir = false;
let pixelSize = 2;
let textIndex = -1;


const level2 = (world) => {
  const THREE = world.THREE;
  console.log('level 2 data: ', data)
  let levelTemplate = createLevel(world, data);

  levelTemplate.firstPass = () => {
    environmentPicture(THREE, "/pictures/hall.png", world.scene);
  };

  levelTemplate.customAnimations = () => {

  };

  return levelTemplate;
};

export { level2 };

