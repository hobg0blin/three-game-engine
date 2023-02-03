// import scene template
import { createLevel, disposeAll } from 'app/engine/level.js'
import { state } from 'app/engine/setup.js'
import data from './test.json'

//GUI/Buttons
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
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

const test = (world) => {
const THREE = world.THREE
let levelTemplate = createLevel(world, data)

// first draw pass, since addObjects() is different based on state objects with "doNotDispose" flag will not be deleted as state changes

levelTemplate.firstPass = () => {
    let gui = new GUI();
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
//      pixelPass.setPixelSize(pixelSize)
}

console.log('level template: ', levelTemplate);
return levelTemplate

}


export { test }
