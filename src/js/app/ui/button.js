import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  Group,
  Raycaster,
  Vector3,
} from "three";
import { createText } from "./createText.js";
import { disposeAll } from "app/engine/level.js";
import { world } from "app/engine/setup.js";

let raycaster = new Raycaster();
let buttons = [];
let camera, view;
let text;
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";
let font = helvetiker;

let mouse = { x: 0, y: 0 };
let ratio = {};

window.addEventListener("click", onClick);
function createButton(params) {
  console.log("world in button: ", world);
  const defaultParams = {
    x: 0,
    z: 26,
    y: -10,
    Xsize: 10,
    Ysize: 5,
    ratio: { h: 0.25, w: 1 },
    color: "green",
    textColor: "black",
    text: "click me",
    view: undefined,
    callback: () => {
      console.log("Button clicked");
    },
  };
  for (let key of Object.keys(defaultParams)) {
    if (params[key] == undefined) {
      params[key] = defaultParams[key];
    }
  }
  view =
    params.view != undefined
      ? params.view
      : {
          width: window.innerWidth,
          height: window.innerHeight,
          camera: params.camera,
        };
  camera = view.camera;
  let geo = new BoxGeometry(params.Xsize, params.Ysize, 1);
  let mat = new MeshPhongMaterial({ color: params.color });
  let button = new Mesh(geo, mat);
  button.position.set(params.x, params.y, params.z - 1);
  button.callback = params.callback;
  buttons.push(button);
  let textMat = new MeshPhongMaterial({ color: params.textColor });
  text = createText(params.text, font, textMat, 0.01);
  text.position.set(params.x, params.y, params.z);
  let group = new Group();
  group.add(button, text);
  world.scene.add(group);
  return group;
}

function checkIntersection(x, y) {
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y =
    -(y /*- (window.innerHeight*view.height)*/ / window.innerHeight) * 2 + 1;
  console.log("mouse: ", mouse);
  // mouse.y = - ( y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  for (let button of buttons) {
    console.log("button: ", button);
    let intersects = raycaster.intersectObject(button, false);
    if (intersects.length > 0) {
      button.callback();
    }
  }
}
function onClick(event) {
  console.log("buttons: ", buttons);
  checkIntersection(event.clientX, event.clientY);
  // kill everything that doesn't have a flag
  //	disposeAll(world, 'doNotDispose')
}
export { createButton };
