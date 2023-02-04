// import scene template
import { createLevel, disposeAll } from "app/engine/level.js";
import { state } from "app/engine/setup.js";
import data from "./level1.json";

//GUI/Buttons
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { mouse } from "components/Three/mouseTracker.js";

// text stuff

// MODELS
import { importSTLModel } from "components/Three/importSTLModel.js";
import { buildTower } from "components/Three/buildTower.js";
//

import { RenderPixelatedPass } from "components/Three/RenderPixelatedPass.js";

// any global variables for this specific scene
// track pixel direction
let dir = false;
let pixelSize = 2;
let textIndex = -1;

let globe, tower, pixelPass;

const level1 = (world) => {
  const THREE = world.THREE;
  let levelTemplate = createLevel(world, data);

  // first draw pass, since addObjects() is different based on state objects with "doNotDispose" flag will not be deleted as state changes

  levelTemplate.firstPass = () => {
    let gui = new GUI();
    pixelPass = new RenderPixelatedPass(pixelSize, world.scene, world.camera);
    world.composer.addPass(pixelPass);

    // GLOBE

    //i don't know why people use constants for functions now but it seems fancy
    const addSTLModel = (geo, mat) => {
      let stl = new THREE.Mesh(geo, mat);
      stl.doNotDispose = true;
      stl.position.set(-100, -12, -100);
      stl.rotation.x = THREE.MathUtils.degToRad(-90);
      stl.rotation.z = THREE.MathUtils.degToRad(30);
      world.scene.add(stl);
      globe = stl;
      return stl;
    };
    let globeMat = new THREE.MeshPhongMaterial({ color: "green", wireframe: true });
    //model from here: https://cults3d.com/en/3d-model/art/earth-globe
    importSTLModel("/models/earth_wireframe.stl", globeMat, addSTLModel);

    // T O W E R
    let towerMat = new THREE.MeshPhongMaterial({ color: "white", wireframe: true });
    tower = buildTower(4, towerMat, 4);
    tower.position.z = -100;
    tower.position.x = -100;
    tower.position.y = 12;
    tower.doNotDispose = true;
    world.scene.add(tower);
  };

  // animate globe and tower, etc.
  // you could do fun camera stuff here too
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
    //      pixelPass.setPixelSize(pixelSize)
  };

  console.log("level template: ", levelTemplate);
  return levelTemplate;
};

export { level1 };
