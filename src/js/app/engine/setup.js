// Global imports -
import { createCamera } from "components/Three/camera.js";
import { createLights } from "components/Three/lights.js";
import { createRenderer } from "components/Three/renderer.js";
import { createControls, addToGUI } from "components/Three/controls.js";
import { eliza, test, level1, level2 } from "levels/levels.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

const world = {};
const setup = (THREE) => {
  world.THREE = THREE;
  // CLOCK
  world.clock = new THREE.Clock();
  // SCENE & RENDER
  world.renderer = createRenderer();
  world.renderer.setSize(window.innerWidth, window.innerHeight);
  world.scene = new THREE.Scene();

  // CAMERA & VIEWPORTS

  world.camera = createCamera();
  world.camera.position.set(0, 20, 150);
  // effects
  world.composer = new EffectComposer(world.renderer);
  world.composer.addPass(new RenderPass(world.scene, world.camera));

  //LIGHTS
  const color = 0xffffff;
  const intensity = 1.5;
  world.light = createLights({ color: color, intensity: intensity });
  world.light[0].position.set(0, 100, 50);
  world.light[0].castShadow = true;
  world.scene.add(world.light[0]);
  world.scene.add(new THREE.AmbientLight({ color: "white", intensity: 1 }));

  //BACKGROUND & FOG
  world.textureLoader = new THREE.TextureLoader();
  let backgroundImg = world.textureLoader.load("/three/studio-bg.jpg"); //        world.scene.background = backgroundImg
  // CONTROLS
  world.controls = createControls(world.camera, world.renderer);
  //    this.controls.target.set(0, 0, 0)
  // RENDERING
  //
  world.render = (level, world) => {
    updateSize(world.renderer);
    requestAnimationFrame(level.animate);
    world.renderer.render(world.scene, world.camera);
    world.composer.render();
  };
  return world;
};

// deal with browser resizing
let windowWidth, windowHeight;

function updateSize(renderer) {
  if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    world.renderer.setSize(windowWidth, windowHeight);
  }
}
// handle level changes

const levelHandler = (levelIndex) => {
  let levels = [eliza];
  return levels[levelIndex];
};

//TODO: state setup
// ideally, JSON object stored as a cookie/in localStorage
// something like
// { gameState:
//    {
//      currentLevel: 0,
//      currentDialogueObject: 'question 5'
//    }
//   playerState:
//     {
//       decay: 0,
//       alexaOpinion: 1,
//       GPTOpinion: 1,
//       zzyxOpinion: 1
//     }
// }
// which would correspond to the dialogue JSON structure laid out in ui/dialogueBox.js

const state = {
  gameState: {
    currentLevelIndex: 0,
    currentLevel: null,
    currentDialogueObject: "node_7",
  },
  playerState: {
    decay: 0,
    elizaOpinion: 1,
    GPTOpinion: 1,
    zzyxOpinion: 1,
  },
};

export { setup, world, state, levelHandler };
