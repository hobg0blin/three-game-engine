// text stuff
import {createText} from 'components/Three/createText.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;

// create a simple scene template, to be modified in individual scene files
let createScene = (world) => {
  let scene = {};
  console.log('world: ', world)
  scene.objects = []
  scene.addObjects = () => {}
  scene.customAnimations = () => {}
  scene.firstPass = () => {}
  scene.animate = () => {
      scene.customAnimations()
      console.log('foo')
      world.render(scene, world)
  }
  scene.handleButtonClick = (callback) => {
    disposeAll(world)
    scene.addObjects()
  }
  return scene;
}

// set universal text variables for game
const addText = (text, textMat) => {
  let textScale = 0.015
  let textPos = {x: 0, y: -5, z: 25}
 return createText(text, font, textMat, textScale, textPos, true, false, false)
}




// dispose of all world objects that aren't marked "do not dispose"
// TODO: once there's more than one scene, could pass a "newscene" flag that disposes of everything
const disposeAll = (world) => {
      //TODO prob handle disposal in separate function that can be run recursively on an object
      const toRemove = []
      world.scene.traverse(child => {
        console.log('child: ', child);
        if (child.doNotDispose) {
          return;
        } else if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
          toRemove.push(child)
        } else if (child.isGroup) {
          //FIXME do i need to recurse this further?
          child.traverse(baby => {
            if (baby.isMesh) {
              baby.geometry.dispose();
              baby.material.dispose();
              toRemove.push(baby)
            }
          })
           toRemove.push(child)
        }
      })
      toRemove.forEach(child => {
        world.scene.remove(child)
      })
    }
export { createScene, addText, disposeAll}
