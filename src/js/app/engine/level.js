// text stuff
import { state } from "./setup.js";
import { troikaDialogueBox } from "app/ui/troikaDialogueBox.js";
import { decayMeter } from "app/ui/decayMeter.js";
import { createText } from "app/ui/createText.js";
let dir = true;
let pixelSize = 1.25;

// create a simple level template, to be modified in individual level files
// FIXME: would be much better if the key/private functions here were inaccessible and static, and stuff like customAnimations or whatever could be extended
//
const createLevel = (world, data) => {
  const level = {};
  level.objects = [];
  //DO NOT TOUCH
  // this automatically changes the dialogue on button press
  level.redraw = () => {
    disposeAll(world, "doNotDispose");
    console.log("data: ", data);
    let text = troikaDialogueBox(searchNode(state.gameState.currentDialogueObject, data["responses"]), world);
    world.scene.add(text);
    decayMeter(state, world);
    //TODO: would be nice to have the numbers tick up
  };
  // manage level-specific animations, to automatically be dealt with in the animate render loop
  level.customAnimations = () => {};
  // first draw pass
  // this is where you might add objects that do not need to change or be removed throughout the course of the level

  level.firstPass = () => {};
  //DO NOT TOUCH
  // This sets up the first dialogue box
  level.setup = () => {
    if (data && data["responses"][0].next) {
      let text = troikaDialogueBox(data["responses"][0].next, world);
      world.scene.add(text);
    }
    decayMeter(state, world);
  };
  level.animate = () => {
    level.customAnimations();
    world.render(level, world);
    if (pixelSize != world.pixelSize) {
      if (world.pixelPass != undefined) {
        if (dir) {
          pixelSize += 0.0003;
        } else {
          pixelSize -= 0.0003;
        }
        if (pixelSize > world.pixelSize) {
          dir = false;
        }
        if (pixelSize < 1.25) {
          dir = true;
        }
        world.pixelPass.setPixelSize(pixelSize);
      }
    }
  };
  return level;
};

// from https://stackoverflow.com/questions/65630507/how-to-search-value-in-nested-json-in-javascript
function searchNode(id, currentNode) {
  let result;
  for (const [key, value] of Object.entries(currentNode)) {
    if (key == "id" && value == id) return currentNode;
    if ((value !== null && typeof value === "object") || typeof value === "array") {
      result = searchNode(id, value);
      if (result) {
        return result;
      }
    }
  }
}

// dispose of all world objects that aren't marked with a flag, e.g. doNotDispose
const disposeAll = (world, flag) => {
  //TODO prob handle disposal in separate function that can be run recursively on an object
  const toRemove = [];
  world.scene.traverse((child) => {
    if (child[flag] == true) {
      return;
    } else if (child.isMesh || child.isSprite) {
      child.geometry.dispose();
      child.material.dispose();
      toRemove.push(child);
    } else if (child.isGroup) {
      //FIXME do i need to recurse this further?
      child.traverse((baby) => {
        if (baby.isMesh) {
          baby.geometry.dispose();
          baby.material.dispose();
          toRemove.push(baby);
        }
      });
      toRemove.push(child);
    }
  });
  toRemove.forEach((child) => {
    world.scene.remove(child);
  });
};
export { createLevel, disposeAll, searchNode };
