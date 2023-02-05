// Global imports -
import { createCamera } from "components/Three/camera.js";
import { createLights } from "components/Three/lights.js";
import { createRenderer } from "components/Three/renderer.js";
import { createControls, addToGUI } from "components/Three/controls.js";
import { chatGPT, zzyx, eliza, level1, intro1, intro2, creator, eliza_end } from "levels/levels.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { gaem } from "app/main.js";

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
  // this is a thing that should not be
  // but it's goblin hours and nobody can  stop me
  let levels = [level1, intro1, intro2, eliza, chatGPT, zzyx];
  if (levelIndex >= levels.length && !state.gameState.reachedCreator) {
    state.gameState.reachedCreator = true;
    return creator;
  } else if (state.gameState.reachedCreator) {
    console.log("should be ending with: ", state.gameState.chosenEnding);
    return state.gameState.chosenEnding;
  } else {
    return levels[levelIndex];
  }
};

const state = {
  gameState: {
    currentLevelIndex: 0,
    currentLevel: null,
    currentDialogueObject: "node_7",
    reachedCreator: false,
    choseEnding: null,
  },
  playerState: {
    decay: 0,
    elizaOpinion: 2,
    GPTOpinion: 1,
    zzyxOpinion: 1,
    suspicion: 0,
    decayStart: false,
  },
};

function handleState(button) {
  if (button.params.nextNode == undefined) {
    console.log("YOU AINT GOT NOTHIN HERE YET!");
  }
  if (button.params.nextNode.event != undefined) {
    console.log("button event: ", button.params.nextNode.event);
    // account for human error by lowercasing
    switch (button.params.nextNode.event.toLowerCase()) {
      case "elizaup":
        state.playerState.elizaOpinion += 1;
        break;
      case "elizadown":
        state.playerState.elizaOpinion -= 1;
        break;
      case "gptup":
        state.playerState.GPTOpinion += 1;
        break;
      case "gptdown":
        state.playerState.GPTOpinion -= 1;
        break;
      case "zzyxup":
        state.playerState.zzyxOpinion += 1;
        break;
      case "zzyxdown":
        state.playerState.zzyxOpinion -= 1;
        break;
      case "decaystart":
        state.playerState.decayStart = true;
        break;
      case "decayup":
        state.playerState.decay += 1;
        break;
      case "decaydown":
        state.playerState.decay -= 1;
        break;
      case "suspicionup":
        state.playerState.suspicion += 1;
        break;
      case "nextlevel":
        state.gameState.currentLevelIndex += 1;
        gaem(world);
        break;
      case "eliza_end":
        state.gameState.chosenEnding = eliza_end;
        gaem(world);
        break;
      //case "gpt_end":
      //  state.gameState.chosenEnding = gpt_end;
      //  break;
      //case "zzyx_end":
      //  state.gameState.chosenEnding = zzyx_end;
      //  break;
      //case "revolution_end":
      //  state.gameState.chosenEnding = zzyx_end;
      //  break;
      //case "decay_end":
      //  state.gameState.chosenEnding = decay_end;
      //  break;

      default:
        console.log(`huh guess you didn't account for this. maybe check to see if you goofed in the JSON somewhere`);
    }
  }
  if (button.params.nextNode.event != "NextLevel") {
    if (button.params.nextNode.type == "gameplay_event") {
      console.log("gameplay!");
      //fixme: recursion causing decay to implement twice, thought return would fix but guess it don't
      handleState({ params: { nextNode: button.params.nextNode.responses[0].next_node } });
      return;
    } else if (button.params.nextNode.responses[0].type == "pass") {
      console.log("pass!");
      state.gameState.currentDialogueObject = button.params.nextNode.responses[0].next_node.id;
      state.gameState.currentLevel.redraw();
    } else if (button.params.nextNode.type == "jump_node") {
      console.log("jump node!");
      state.gameState.currentDialogueObject = button.params.nextNode.jump_to;
      state.gameState.currentLevel.redraw();
    } else {
      state.gameState.currentDialogueObject = button.params.nextNode.id;
      state.gameState.currentLevel.redraw();
    }
  }
  if (state.playerState.decayStart == true) {
    state.playerState.decay += 1;
  }
  console.log("current state: ", state);
}

export { setup, world, state, handleState, levelHandler };
