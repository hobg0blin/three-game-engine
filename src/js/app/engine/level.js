// text stuff
import { createText } from "app/ui/createText.js";

// create a simple level template, to be modified in individual level files
// TODO: probably needs some more opinionated functions that always run when button is clicked/level starts and ends.
const createLevel = (world) => {
  const level = {};
  console.log("world: ", world);
  level.objects = [];
  // a looping function to redraw the scene when button is pressed -- e.g. changing the dialogue
  level.addObjects = () => {};
  // manage level-specific animations, to automatically be dealt with in the animate render loop
  level.customAnimations = () => {};
  // first draw pass, if it needs to be different from "add objects"
  // this is where you might add objects that do not need to change or be removed throughout the course of the level
  level.firstPass = () => {};
  level.animate = () => {
    level.customAnimations();
    world.render(level, world);
  };
  // handle button clicks
  // TODO:
  // need flag structure (or something) to determine what gets removed in the `addObjects` loop vs. when level is changed.
  // I guess the upside of this fairly unopinionated framework is that it can be dealt with on a per-level basis, or even a per-button basis.
  level.handleButtonClick = () => {
    disposeAll(
      world /* flag to delete, say, the current text bubble goes here */
    );
    level.addObjects();
  };
  return level;
};

// set universal text variables for game
// this is no longer used in favor of dialogueBox, I think
const addText = (text, textMat) => {
  let textScale = 0.015;
  let textPos = { x: 0, y: -5, z: 25 };
  return createText(
    text,
    font,
    textMat,
    textScale,
    textPos,
    true,
    false,
    false
  );
};

// dispose of all world objects that aren't marked with a flag, e.g. doNotDispose
const disposeAll = (world, flag) => {
  //TODO prob handle disposal in separate function that can be run recursively on an object
  const toRemove = [];
  world.scene.traverse((child) => {
    console.log("child: ", child);
    if (child[flag] == true) {
      return;
    } else if (child.isMesh) {
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
export { createLevel, addText, disposeAll };
