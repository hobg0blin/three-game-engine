// import scne template
import { createScene, addText, disposeAll } from 'app/engine/scene.js'

//GUI/Buttons
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { createButton} from 'components/Three/button.js'
import { mouse } from 'components/Three/mouseTracker.js'

// text stuff

// MODELS
import { importSTLModel } from 'components/Three/importSTLModel.js'
import { buildTower } from 'components/Three/buildTower.js'
//

import { RenderPixelatedPass } from 'components/Three/RenderPixelatedPass.js';


// any global variables for this specific scene
// track pixel direction
let dir = false
let pixelSize = 2
let sceneIndex = -1

let globe, tower, pixelPass;

const scene1 = (world) => {
const THREE = world.THREE
let sceneTemplate = createScene(world)
sceneTemplate.addObjects = () => {
    pixelPass = new RenderPixelatedPass(pixelSize, world.scene, world.camera);
    world.composer.addPass(pixelPass)

  // GUI
  let gui = new GUI();
  // SET UP INITIAL SCENE COMPONENTS
  sceneIndex++;
    if (sceneIndex > 4) {
    sceneIndex = 0
  }
  //FIXME: there is, presumably, a better way to do this than a switch, but also go fuck yourself
  let text;
  let textMat = new THREE.MeshPhongMaterial({color: 'green'});
  switch(sceneIndex) {
  case 0:
    sceneTemplate.firstPass()
    text = addText('there is a tower at the end of the world.', textMat)
    break;
  case 1:
    text = addText('it rises past what used to be the stratosphere,', textMat)
    break;
  case 2:
   text = addText('but there is no sky left for it to pierce.', textMat)
    break;
  case 3:
    text = addText('it is a monument to everything that ever was, \n a cemetry of ideas.', textMat)
    break;
  case 4:
    text = addText('it is a place where nothing new will ever be born.', textMat)
    break;

  }
  console.log('should be adding text: ', text);
  console.log('world: ', world)
  world.scene.add(text)
}

sceneTemplate.firstPass = () => {
  // next button
    let button = createButton({
    x: 10,
    z: 26,
    y: -10,
    Xsize: 6,
    Ysize: 2,
    ratio: {h: 0.25, w: 1},
    color: 'green',
    textColor: 'black',
    text: 'next',
    camera: world.camera,
    callback: sceneTemplate.handleButtonClick
  })
   button.doNotDispose = true;
    world.scene.add(button);
  // GLOBe

  //i don't know why people use constants for functions now but it seems fancy
  const addSTLModel = (geo, mat) => {
    let stl = new THREE.Mesh(geo, mat);
    stl.doNotDispose = true;
    stl.position.set(0, -12, -100);
    stl.rotation.x = THREE.MathUtils.degToRad(-90)
    stl.rotation.z = THREE.MathUtils.degToRad(30)
    world.scene.add(stl);
    globe = stl
    return stl
  }
  let globeMat = new THREE.MeshPhongMaterial({ color: 'green', wireframe: true})
  //model from here: https://cults3d.com/en/3d-model/art/earth-globe
  importSTLModel('/models/earth_wireframe.stl', globeMat, addSTLModel)

  // T O W E R
  let towerMat = new THREE.MeshPhongMaterial({color: 'white', wireframe: true})
  tower = buildTower(4,towerMat, 4)
  tower.position.z = -100
  tower.position.y = 12
  tower.doNotDispose = true;
  world.scene.add(tower);
}



sceneTemplate.customAnimations = () => {
     if (globe != undefined && tower != undefined) {
          globe.rotation.z += 0.003
          tower.rotation.y += 0.003
      }
      if (dir) {
        pixelSize+= 0.005
       } else {
         pixelSize -= 0.005
      }
      if (pixelSize > 3) {
        dir = false;
      }
     if (pixelSize < 1.5) {
       dir = true
     }
      pixelPass.setPixelSize(pixelSize)
}

return sceneTemplate

}


export { scene1 }
