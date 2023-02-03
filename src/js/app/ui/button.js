import { BoxGeometry, Mesh, MeshPhongMaterial, Group, Raycaster, Vector3} from 'three'
import {createText} from './createText.js'
import { disposeAll } from 'app/engine/level.js'
import { world, state } from 'app/engine/setup.js'
import { gaem } from 'app/main.js'

let raycaster = new Raycaster();
let buttons = [];
let camera, view;
let text;
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;

let mouse = {x: 0, y: 0}
let ratio = {}

window.addEventListener( 'click', onClick );
function createButton(params) {
			const defaultParams = {
				x: 10,
				z: 26,
				y: -10,
				Xsize: 6,
				Ysize: 2,
				ratio: {h: 0.25, w: 1},
				color: 'green',
				textColor: 'black',
				text: 'click me',
				view: undefined,
			}
			for (let key of Object.keys(defaultParams)) {
				if (params[key] == undefined) {
					params[key] = defaultParams[key]
				}
			}
			view = params.view != undefined ? params.view : { width: window.innerWidth, height: window.innerHeight, camera: params.camera }
			camera = view.camera
			let geo = new BoxGeometry(params.Xsize, params.Ysize, 1);
			let mat = new MeshPhongMaterial({color: params.color})
			let button = new Mesh(geo, mat)
			button.position.set(params.x, params.y, params.z- 1)
			button.callback = params.callback
			button.params = params
			buttons.push(button)
			let textMat = new MeshPhongMaterial({color: params.textColor})
			text = createText(params.text, font, textMat, 0.01)
			text.position.set(params.x, params.y, params.z);
			let group = new Group()
			group.add(button, text);
			return group;
}

function checkIntersection(x, y) {
			mouse.x = ( x / ( window.innerWidth )) * 2 - 1;
			mouse.y = - ( (y /*- (window.innerHeight*view.height)*/)/(window.innerHeight)) * 2 + 1;
			// mouse.y = - ( y / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			for (let button of buttons) {
			let intersects = raycaster.intersectObject(button, false);
//FIXME: it is extremely stupid to have this core game logic in here, at the very least need to put these functions into something in engine and import them
// probably ought to be getters and setters as well rather than directly modifying the object
			if (intersects.length > 0) {
				console.log('button clicked', button)
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
					case 'nextlevel':
						state.gameState.currentLevelIndex+=1;
					gaem()
				default:
					console.log(`huh guess you didn't account for this. maybe check to see if you goofed in the JSON somewhere`)
			}
			}
			if (button.params.nextNode.responses[0].type == 'pass') {
			state.gameState.currentDialogueObject = button.params.nextNode.responses[0].next_node.id;
			} else {
				state.gameState.currentDialogueObject = button.params.nextNode.id;
			}
			state.gameState.currentLevel.redraw();
				console.log('params: ', button.params)
				if (button.params.nextNode.event == 'NextLevel') {
					state.gameState.currentLevelIndex +=1
					gaem(world)
				}
				console.log('state: ', state)
			}
		}
}
function onClick( event ) {
	checkIntersection( event.clientX, event.clientY );
	// kill everything that doesn't have a flag
//	disposeAll(world, 'doNotDispose')

}
export {createButton}
