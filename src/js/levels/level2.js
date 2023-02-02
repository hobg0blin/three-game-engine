// import scne template
import { createLevel, disposeAll } from "app/engine/level.js";
import { createDialogueBox } from "app/ui/dialogueBox.js";

//GUI/Buttons
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { mouse } from "components/Three/mouseTracker.js";

// text stuff

// MODELS
import { importSTLModel } from "components/Three/importSTLModel.js";
import { buildTower } from "components/Three/buildTower.js";
//

import { RenderPixelatedPass } from "components/Three/RenderPixelatedPass.js";
import { environmentPicture } from "../app/ui/environmentPicture";

// any global variables for this specific scene
// track pixel direction
let dir = false;
let pixelSize = 2;
let textIndex = -1;

let globe, tower, pixelPass;

const formatText = (levelTemplate, world) => {
  textIndex++;
  if (textIndex > 4) {
    textIndex = 0;
  }
  //FIXME: there is, presumably, a better way to do this than a switch, but also go fuck yourself
  levelTemplate.firstPass();
  let text = createDialogueBox("There is a tower at the end of the world.", [
    {
      text: "button 1",
      callback: () => {
        console.log("button 1 clicked");
      },
    },
    {
      text: "button 2",
      callback: () => {
        console.log("button 2 clicked");
      },
    },
  ]);
  world.scene.add(text);
};

const addGlobe = (THREE, world) => {
  //i don't know why people use constants for functions now but it seems fancy
  const addSTLModel = (geo, mat) => {
    let stl = new THREE.Mesh(geo, mat);
    stl.doNotDispose = true;
    stl.position.set(0, -12, -100);
    stl.rotation.x = THREE.MathUtils.degToRad(-90);
    stl.rotation.z = THREE.MathUtils.degToRad(30);
    world.scene.add(stl);
    globe = stl;
    return stl;
  };
  let globeMat = new THREE.MeshPhongMaterial({
    color: "green",
    wireframe: true,
  });
  //model from here: https://cults3d.com/en/3d-model/art/earth-globe
  importSTLModel("/models/earth_wireframe.stl", globeMat, addSTLModel);
};

const addTower = (THREE, world) => {
  let towerMat = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: true,
  });
  tower = buildTower(4, towerMat, 4);
  tower.position.z = -100;
  tower.position.y = 12;
  tower.doNotDispose = true;
  world.scene.add(tower);
};

const level2 = (world) => {
  const THREE = world.THREE;
  let levelTemplate = createLevel(world);
  levelTemplate.addObjects = () => {
    //pixelPass = new RenderPixelatedPass(pixelSize, world.scene, world.camera);
    //world.composer.addPass(pixelPass);

    // GUI
    let gui = new GUI();
    // SET UP INITIAL SCENE COMPONENTS
    formatText(levelTemplate, world);

    environmentPicture(THREE, "pictures/hall.png", world.scene);
  };

  levelTemplate.firstPass = () => {
    //addGlobe(THREE, world);
    //addTower(THREE, world);
  };

  levelTemplate.customAnimations = () => {
    if (globe != undefined && tower != undefined) {
      globe.rotation.z += 0.003;
      tower.rotation.y += 0.003;
    }
    if (dir) {
      pixelSize += 0.005;
    } else {
      pixelSize -= 0.005;
    }
    if (pixelSize > 3) {
      dir = false;
    }
    if (pixelSize < 1.5) {
      dir = true;
    }
    //pixelPass.setPixelSize(pixelSize);
  };

  return levelTemplate;
};

export { level2 };
