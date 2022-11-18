import { BoxGeometry, Mesh, MeshPhongMaterial, Group, Raycaster, Vector3} from 'three'
import {createText} from './createText.js'

let raycaster = new Raycaster();
let button, callback, camera, view;
let text;
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;

let mouse = {x: 0, y: 0}
let ratio = {}

function createButton(params=
{
	xSize: 1,
	ySize: 1,
	ratio: {h: 1, w: 1},
	y: 0,
	x: 0,
	z: 0,
	color: 'green',
	textColor: 'black',
	text: 'click me',
	view: null,
	callback: ()=>{console.log('Button clicked')}
}) {
			view = params.view
			camera = params.view.camera
			callback = params.callback
			let geo = new BoxGeometry(params.Xsize, params.Ysize, 1);
			let mat = new MeshPhongMaterial({color: params.color})
			button = new Mesh(geo, mat)
			button.position.set(params.x, params.y, params.z- 1)
			let textMat = new MeshPhongMaterial({color: params.textColor})
			text = createText(params.text, font, textMat, 0.01)
			text.position.set(params.x, params.y, params.z);
			window.addEventListener( 'click', onClick );
			let group = new Group()
			group.add(button, text);
			return group;
}

function checkIntersection(x, y) {
			mouse.x = ( x / ( window.innerWidth )) * 2 - 1;
			mouse.y = - ( (y - (window.innerHeight*view.height))/(window.innerHeight)) * 2 + 1;
	console.log('mouse: ', mouse);
			raycaster.setFromCamera(mouse, camera);
			let intersects = raycaster.intersectObject(button, false);
	console.log('intersects: ', intersects);
			if (intersects.length > 0) {
				callback()
			}
}
function onClick( event ) {

	checkIntersection( event.clientX, event.clientY );

}
export {createButton}
