import { state } from "app/engine/setup.js";
import { createLevel } from "app/engine/level.js";

//GUI/Buttons
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// GET THE DIALOGUE DATA
import data from "./creator.json";
import { environmentPicture } from "../app/ui/environmentPicture";
import { troikaDialogueBox } from "app/ui/troikaDialogueBox.js";
// MODELS

// any global variables for this specific scene
// track pixel direction
let dir = false;
let pixelSize = 2;
let textIndex = -1;

let globe, tower, pixelPass;

const creator = (world) => {
  const THREE = world.THREE;
  let levelTemplate = createLevel(world, data);
  // i am breaking my own rules here but it's 10:30 and my brain is failing
  levelTemplate.setup = () => {
    if (data && data["responses"][0].next) {
      let text = troikaDialogueBox(data["responses"][0].next, world);
      console.log("responses: ", data["responses"]);
      //FILTER RESPONSES BASED ON STATE
      world.scene.add(text);
    }
  };

  // first draw pass, since addObjects() is different based on state objects with "doNotDispose" flag will not be deleted as state changes

  levelTemplate.firstPass = () => {
    let gui = new GUI();
    // ADD ANY OBJECTS OR VISUAL ELEMENTS
    // SET .doNotDispose = true so they're not deleted when it redraws
    // FIXME: surely there is a way to automate this
    let sprite = environmentPicture(THREE, "/pictures/creator.png", world.scene);
    sprite.doNotDispose = true;
  };

  levelTemplate.customAnimations = () => {
    //set any custom animations, e.g. increase pixelation as decay increases
  };

  return levelTemplate;
};

export { creator };
