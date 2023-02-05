import * as THREE from "three";
import { setup, levelHandler, render, state } from "./engine/setup.js";
import { disposeAll } from "./engine/level.js";
// This class instantiates and ties all of the components together, starts the loading process and renders the main loop

function create() {
  let world = setup(THREE);
  world.levelIndex = 0;
  return gaem(world);
}
function gaem(world) {
  disposeAll(world, "permanent");
  state.gameState.currentLevel = levelHandler(
    state.gameState.currentLevelIndex
  )(world);
  state.gameState.currentLevel.setup();
  state.gameState.currentLevel.firstPass();

  world.render(state.gameState.currentLevel, world);
  return world;
}

export { create, gaem };
