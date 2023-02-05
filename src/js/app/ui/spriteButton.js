import { Raycaster, Vector3 } from "three";

import { spriteDialogueBox } from "./spriteDialogueBox";
import { disposeAll } from "app/engine/level.js";
import { world, state, handleState } from "app/engine/setup.js";
import { gaem } from "app/main.js";
import { Howl, Howler } from "howler";

let raycaster = new Raycaster();
let buttons = [];
let text;

let mouse = { x: 0, y: 0 };
let ratio = {};

function spriteButton(buttonObj, params) {
  //		view = params.view != undefined ? params.view : { width: window.innerWidth, height: window.innerHeight, camera: params.camera }
  let button = spriteDialogueBox(params.text, world);
  button.position.x = params.x;
  button.position.y = params.y;

  button.params = params;
  buttons.push(button);
  return button;
}

function checkIntersection(x, y) {
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y /*- (window.innerHeight*view.height)*/ / window.innerHeight) * 2 + 1;
  // mouse.y = - ( y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, world.camera);
  for (let button of buttons) {
    let intersects = raycaster.intersectObject(button, false);
    // probably ought to be getters and setters as well rather than directly modifying the object
    if (intersects.length > 0) {
      buttons = [];
      handleButton(button);
    }
  }
}
function handleButton(button) {
  var sound = new Howl({
    src: ["/buttonclick.wav"],
  });

  sound.play();
  handleState(button);
}

function onClick(event) {
  checkIntersection(event.clientX, event.clientY);
  // kill everything that doesn't have a flag
  //	disposeAll(world, 'doNotDispose')
}

window.addEventListener("click", onClick);
export { spriteButton };
