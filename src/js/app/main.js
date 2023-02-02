import * as THREE from "three";
import { setup, levelHandler, render } from "./engine/setup.js";
// This class instantiates and ties all of the components together, starts the loading process and renders the main loop

function gaem() {
  let world = setup(THREE);
  world.levelIndex = 0;
  //BIG TODO
  // doesn't currently handle switching levels
  // ideally this would be dealt with in the render loop, pulling from global world state
  // e.g. if (world.level == 2)
  // then update level
  // not sure where this logic would best live, but right now this function basically just operates to start the thing
  let currentLevel = levelHandler(world.levelIndex)(world);
  currentLevel.addObjects();
  world.render(currentLevel, world);
  return world;
}

export { gaem };
