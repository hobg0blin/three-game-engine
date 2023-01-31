// import scne template
import { createLevel, addText, disposeAll } from 'app/engine/level.js'

//GUI/Buttons
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { createButton} from 'app/ui/button.js'
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
let textIndex = -1

let globe, tower, pixelPass;

const level1 = (world) => {
const THREE = world.THREE
let levelTemplate = createLevel(world)

  // simple loop to determine what's added based on state - as you advance through the scene, it redraws the text
levelTemplate.addObjects = () => {
    pixelPass = new RenderPixelatedPass(pixelSize, world.scene, world.camera);
    world.composer.addPass(pixelPass)

  // GUI
  let gui = new GUI();
  // SET UP INITIAL SCENE COMPONENTS
  textIndex++;
    if (textIndex > 4) {
    textIndex = 0
  }
  //FIXME: there is, presumably, a better way to do this than a switch, but also go fuck yourself
  let text;
  let textMat = new THREE.MeshPhongMaterial({color: 'green'});
  switch(textIndex) {
  case 0:
    levelTemplate.firstPass()
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
  world.scene.add(text)
}



// first draw pass, since addObjects() is different based on state
// objects with "doNotDispose" flag will not be deleted as state changes
levelTemplate.firstPass = () => {
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
    callback: levelTemplate.handleButtonClick
  })
   button.doNotDispose = true;
    world.scene.add(button);
  // GLOBE

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

// animate globe and tower, etc.
// you could do fun camera stuff here too
levelTemplate.customAnimations = () => {
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

return levelTemplate

}


export { level1 }
