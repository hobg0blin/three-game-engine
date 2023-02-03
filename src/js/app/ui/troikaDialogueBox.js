import { Text } from "troika-three-text";
import { Vector3, Group } from 'three';
import { spriteButton } from './spriteButton.js'
import { spriteDialogueBox } from './spriteDialogueBox.js'

function troikaDialogueBox(dialogueObj, world)  {
  const group = new Group()
  const myText = new Text()
  const responses = dialogueObj.responses
  // Create:

  // Set properties to configure:
  myText.text = dialogueObj.npc_text;
  myText.fontSize = 5;
  let measure = new Vector3();
  myText.geometry.boundingBox.getSize(measure);

  //myText.position.z = 0;
  myText.position.y = 65;
  myText.position.x = -10;
  myText.color = 0xffffff;
  myText.maxWidth = 100;

  // Update the rendering:
  myText.sync();
  group.add(myText)
  let width = measure.x/responses.length
  let startX = myText.position.x
  for (let button of responses) {
    let b = spriteButton(button, {text: button.text,  x: startX, camera: world.camera, event: button.event, nextNode: button.next_node, scale: 0.25})
      startX += 50;
      group.add(b)
    }
  return group

};

export {troikaDialogueBox}
