
import {
  Raycaster,
  Vector3,
} from "three";

import { spriteDialogueBox } from './spriteDialogueBox'
import { disposeAll } from "app/engine/level.js";
import { world, state } from 'app/engine/setup.js'
import { gaem } from 'app/main.js'

let raycaster = new Raycaster();
let buttons = [];
let text;

let mouse = { x: 0, y: 0 };
let ratio = {};


function spriteButton(buttonObj, params) {
//		view = params.view != undefined ? params.view : { width: window.innerWidth, height: window.innerHeight, camera: params.camera }
		let button = spriteDialogueBox(params.text, world)
	console.log('button: ', button)
	console.log('button position: ', button.position)
	button.position.x = params.x

		button.params = params
		buttons.push(button)
		return button
}


function checkIntersection(x, y) {
			mouse.x = ( x / ( window.innerWidth )) * 2 - 1;
			mouse.y = - ( (y /*- (window.innerHeight*view.height)*/)/(window.innerHeight)) * 2 + 1;
			// mouse.y = - ( y / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, world.camera);
			for (let button of buttons) {
			let intersects = raycaster.intersectObject(button, false);
//FIXME: it is extremely stupid to have this core game logic in here, at the very least need to put these functions into something in engine and import them
// probably ought to be getters and setters as well rather than directly modifying the object
				if (intersects.length > 0) {
				console.log('intersected button: ', button)
				if (button.params.nextNode == undefined) {
					console.log('YOU AINT GOT NOTHIN HERE YET!')
				}
				if (button.params.nextNode.event != undefined) {
					switch (button.params.nextNode.event) {
					case 'ElizaUp':
							console.log('eliza up');
						state.playerState.elizaOpinion+=1;
						break;
					case 'ElizaDown':
							console.log('eliza down')
						state.playerState.elizaOpinion-=1;
						break;
					case 'GPTUp':
						state.playerState.GPTOpinion+=1;
						break;
					case 'GPTDown':
						state.playerState.GPTOpinion-=1;
						break;
					case 'zzyxUp':
						state.playerState.zzyxOpinion+=1;
						break;
					case 'zzyxDown':
						state.playerState.zzyxOpinion-=1;
						break;
					case 'decayUp':
						state.playerState.decay+=1;
						break;
					case 'decayDown':
						state.playerState.decay-=1;
						break;
					case 'NextLevel':
						state.gameState.currentLevelIndex+=1;
						buttons = []
						gaem(world)
						break;
				default:
					console.log(`huh guess you didn't account for this. maybe check to see if you goofed in the JSON somewhere`)
				}
			}
				if (button.params.nextNode.event != 'NextLevel') {
			if (button.params.nextNode.responses[0].type == 'pass') {
				state.gameState.currentDialogueObject = button.params.nextNode.responses[0].next_node.id;
				state.gameState.currentLevel.redraw();
			} else {
				state.gameState.currentDialogueObject = button.params.nextNode.id;
				state.gameState.currentLevel.redraw();
			}
				}
			}
		}
}
function onClick( event ) {
	checkIntersection( event.clientX, event.clientY );
	// kill everything that doesn't have a flag
//	disposeAll(world, 'doNotDispose')
}

window.addEventListener("click", onClick);
export { spriteButton }
