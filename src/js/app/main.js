import * as THREE from 'three';
import { setup, levelHandler, render, state } from './engine/setup.js'
import { disposeAll } from './engine/level.js'
// This class instantiates and ties all of the components together, starts the loading process and renders the main loop


function create() {
  let world = setup(THREE)
  world.levelIndex = 0
  return gaem(world)
}
function gaem(world) {
  disposeAll(world, 'permanent')
  //BIG TODO
  // doesn't currently handle switching levels
  // ideally this would be dealt with in the render loop, pulling from global world state
  // e.g. if (world.level == 2)
  // then update level
  // not sure where this logic would best live, but right now this function basically just operates to start the thing
  state.gameState.currentLevel = levelHandler(state.gameState.currentLevelIndex)(world)
  state.gameState.currentLevel.firstPass();

  world.render(state.gameState.currentLevel, world)
  return world;
}


export { create, gaem }


