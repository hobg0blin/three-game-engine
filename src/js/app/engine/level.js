// text stuff
import {createText} from 'app/ui/createText.js'

// create a simple level template, to be modified in individual level files
let createLevel = (world) => {
  let level = {};
  console.log('world: ', world)
  level.objects = []
  // add core objects to scene
  level.addObjects = () => {}
  // manage unique animations, to automatically be dealt with in the animate render loop
  level.customAnimations = () => {}
  // first draw pass, if it needs to be different from "add objects"
  level.firstPass = () => {}
  level.animate = () => {
      level.customAnimations()
      world.render(level, world)
  }
  // handle click of the "next" button
  level.handleButtonClick = () => {
    disposeAll(world)
    level.addObjects()
  }
  return level;
}

// set universal text variables for game
const addText = (text, textMat) => {
  let textScale = 0.015
  let textPos = {x: 0, y: -5, z: 25}
 return createText(text, font, textMat, textScale, textPos, true, false, false)
}




// dispose of all world objects that aren't marked "do not dispose"
// TODO: once there's more than one level, could pass a "newlevel" flag that disposes of everything
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
export { createLevel, addText, disposeAll}
