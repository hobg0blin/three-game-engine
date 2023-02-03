// text stuff
import { state } from './setup.js'
import { createDialogueBox } from 'app/ui/dialogueBox.js'

// create a simple level template, to be modified in individual level files
// TODO: probably needs some more opinionated functions that always run when button is clicked/level starts and ends.
const createLevel = (world, data) => {
  const level = {};
  level.objects = []
  // a looping function to redraw the scene when button is pressed -- e.g. changing the dialogue
  level.redraw = () => {
  disposeAll(world, 'doNotDispose');
    let text = createDialogueBox(searchNode(state.gameState.currentDialogueObject, data['responses']))

    world.scene.add(text)
  }  // manage level-specific animations, to automatically be dealt with in the animate render loop
  level.customAnimations = () => {}
  // first draw pass
  // this is where you might add objects that do not need to change or be removed throughout the course of the level
  level.firstPass = () => {}
    let text = createDialogueBox(data['responses'][0].next)
    world.scene.add(text)
  level.animate = () => {
      level.customAnimations()
      world.render(level, world)
  }
  return level;
}

// from https://stackoverflow.com/questions/65630507/how-to-search-value-in-nested-json-in-javascript
function searchNode(id, currentNode) {
    let result;

    for (const [key, value] of Object.entries(currentNode)) {
    if (key == "id" && value == id)  return currentNode;
        if (value !== null && typeof value === "object" || typeof value === "array") {
            result = searchNode(id, value);
           if (result) {
            return result;
           }
         }
    }
}

// set universal text variables for game
// this is no longer used in favor of dialogueBox, I think
const addText = (text, textMat) => {
  let textScale = 0.015
  let textPos = {x: 0, y: -5, z: 25}
 return createText(text, font, textMat, textScale, textPos, true, false, false)
}




// dispose of all world objects that aren't marked with a flag, e.g. doNotDispose
const disposeAll = (world, flag) => {
      //TODO prob handle disposal in separate function that can be run recursively on an object
      const toRemove = []
      world.scene.traverse(child => {
        if (child[flag] == true) {
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
