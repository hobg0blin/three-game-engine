import { Vector3, Group } from 'three'
import { createButton } from './button.js'
import { createBackground } from './createBackground.js'
import { createSimpleText } from './createSimpleText.js'
import { getBoundingBox } from 'utils/getBoundingBox.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'

let font = helvetiker;
//FIXME: ideally, this should just take a JSON dialogue object, something like
// {'text': 'Lorem ipsum dolor sit amet',
//   'buttons': [
//     {
//      text: 'button 1', leadsto: 'choice1' (another dialogue object),
//      effects: {
//          attribute: 'decay',
//          value:  +1
//      }
//     },
//{
//      text: 'button 2', leadsto: 'choice2',
//      effects: {
//          attribute: 'resolve',
//          value:  -1
//      }
//     }
//   ]
// }
//
// So, first off, not having to set the "world" every time would be good - we can probably import that once a proper game state is set up.
// Then, slightly altering params to take the above structure. This will likely involve doing some more automatic stuff on button click (e.g. clearing current text, it should already fire the button's callback.)

 function createDialogueBox(world, text, buttons, position = {x: 0, y: -7.5, z: 20}, scale = 0.015, font = helvetiker, fontColor = 'black', isTTF=false) {
  const width = 50;
  let group = new Group()
  createSimpleText(text, fontColor, helvetiker).then(text => {
  text.outputText.scale.set(scale, scale, scale)
    let measure = new Vector3()
    text.outputText.geometry.boundingBox.getSize(measure)
    text.outputText.position.set(position.x, position.y + 5, position.z + 2)
    measure = measure.multiplyScalar(scale);
    group.add(text.outputText)

  let background = createBackground(position, measure)
  group.add(background)

  let width = measure.x/buttons.length
  let startX = position.x
  for (let button of buttons) {
    let b = createButton({text: button.text, callback: button.callback, x: startX, camera: world.camera})
    startX += width;
    group.add(b)
    }
  })
  group.position.set(position.x, position.y, position.z)
  return group
}


export { createDialogueBox }
