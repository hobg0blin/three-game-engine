import { Vector3, Group } from "three";
import { createButton } from "./button.js";
import { createBackground } from "./createBackground.js";
import { createSimpleText } from "./createSimpleText.js";
import { getBoundingBox } from "utils/getBoundingBox.js";
import { world } from "app/engine/setup.js";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

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
//      effects: { //          attribute: 'resolve', //          value:  -1 //      }
//     }
//   ]
// }
//
// Then, slightly altering params to take the above structure. This will likely involve doing some more automatic stuff on button click (e.g. clearing current text, it should already fire the button's callback.)

 function createDialogueBox(dialogueObj, position = {x: 0, y: -7.5, z: 20}, scale = 0.015, font = helvetiker, fontColor = 'black', isTTF=false) {
  let group = new Group()
   let text = dialogueObj.npc_text
   let responses = dialogueObj.responses
  // create 2D text (loads as a promise in the event you want to load a TTF font)
  // TODO: if we're using a TTF over and over would be good to internally store it so it doesn't load every time
  createSimpleText(text, fontColor, helvetiker).then((text) => {
    text.outputText.scale.set(scale, scale, scale);
    text.outputText.position.set(position.x, position.y + 5, position.z + 2);
    group.add(text.outputText);

    // get size of the text's bounding box for a background text bubble and subsequent button placement
    let measure = new Vector3();
    text.outputText.geometry.boundingBox.getSize(measure);
    measure = measure.multiplyScalar(scale);

    // create background
    let background = createBackground(position, measure);
    group.add(background);

    // create N buttons at the bottom of the text box (probably shouldn't have more than 3
    // TODO: smarter math for button placement
    let width = measure.x/responses.length
    let startX = position.x
    for (let button of responses) {
      let b = createButton({text: button.text,  x: startX, camera: world.camera, event: button.event, nextNode: button.next_node})
        startX += width;
        group.add(b)
      }
  })
  group.position.set(position.x, position.y, position.z)
  return group
}

export { createDialogueBox };
