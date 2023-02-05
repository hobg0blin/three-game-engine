import { Text } from "troika-three-text";
import { Vector3, Group } from "three";
import { spriteButton } from "./spriteButton.js";
import { spriteDialogueBox } from "./spriteDialogueBox.js";
import { simpleText } from "./createSimpleText.js";
import * as THREE from "three";
import anime from "animejs";

function troikaDialogueBox(dialogueObj, world) {
  const group = new Group();
  const myText = new Text();
  const responses = dialogueObj.responses;
  // Create:
  // Create Bar to handle text reveal
  var height = 15 + 30 * (dialogueObj.npc_text.length / 100);
  var geometry = new THREE.BoxGeometry(150, height, 2);
  //geometry.position(-10, 56, 10 )
  var material = new THREE.MeshPhongMaterial({ color: "black" });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 55;
  mesh.position.y = 65;
  anime({
    targets: [mesh.position],
    x: 200,
    delay: 500,
    duration: 14000,
    loop: false,
    direction: "normal",
  });

  world.scene.add(mesh);

  // Set properties to configure:
  myText.text = dialogueObj.npc_text;
  myText.fontSize = 5;

  //myText.position.z = 0;
  myText.position.y = 65;
  myText.position.x = -10;
  myText.color = 0xffffff;
  myText.maxWidth = 130;

  // Update the rendering:
  myText.sync();

  group.add(myText);
  let width = 100 / responses.length;
  let startX = myText.position.x + 65;
  let startY = -40;
  for (let button of responses) {
    let b = spriteButton(button, {
      text: button.text,
      x: startX,
      y: startY,
      camera: world.camera,
      event: button.event,
      nextNode: button.next_node,
      scale: 0.25,
    });
    //startX += width + 15;
    startY -= 15;
    setTimeout(() => {
      group.add(b);
    }, 2100);
  }
  return group;
}

export { troikaDialogueBox };
