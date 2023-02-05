import { state } from "app/engine/setup.js";
import { createLevel, disposeAll, searchNode } from "app/engine/level.js";

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
  levelTemplate.redraw = () => {
    disposeAll(world, "doNotDispose");
    let dialogueObject = searchNode(state.gameState.currentDialogueObject, data["responses"]);
    if (state.gameState.currentDialogueObject == "node_23") {
      console.log("ending decision: ", dialogueObject);
      let filtered = dialogueObject.responses.filter((response) => {
        console.log("response: ", response);
        console.log("id: ", response.id);
        if (state.playerState.elizaOpinion < 2 && response.next_node.id == "node_2") {
          return false;
        } else if (state.playerState.GPTOpinion < 2 && response.next_node.id == "node_3") {
          return false;
        } else if (state.playerState.zzyxOpinion < 2 && response.next_node.id == "node_4") {
          return false;
        } else if (state.playerState.suspicion < 2 && response.next_node.id == "node_9") {
          return false;
        } else {
          return true;
        }
      });
      console.log("filtered: ", filtered);
      dialogueObject.responses = filtered;
    }
    let text = troikaDialogueBox(dialogueObject, world);
    world.scene.add(text);
    //TODO: would be nice to have the numbers tick up
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
