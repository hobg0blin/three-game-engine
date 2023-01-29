import * as THREE from 'three';
import { setup, sceneHandler, render } from './engine/setup.js'
// This class instantiates and ties all of the components together, starts the loading process and renders the main loop




function gaem() {
  let world = setup(THREE)
  let currentSceneIndex = 0
  let currentScene = sceneHandler(currentSceneIndex)(world)
  console.log('currentScene: ', currentScene)
  currentScene.addObjects();
  world.render(currentScene, world)
  return world;
}


export { gaem }


