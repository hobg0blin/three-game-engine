import { BoxGeometry, Mesh, MeshPhongMaterial, Group, Raycaster, Vector3} from 'three'
import {createText} from './createText.js'

let raycaster = new Raycaster();
let button, callback, camera;
let text;
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;

let mouse = {x: 0, y: 0}

function createButton(params=
{
	xSize: 1,
	ySize: 1,
	y: 0,
	x: 0,
	color: 'green',
	textColor: 'black',
	text: 'click me',
	camera: null,
	callback: ()=>{console.log('Button clicked')}
}) {
			camera = params.camera
			callback = params.callback
			let geo = new BoxGeometry(params.Xsize, params.Ysize, 1);
			let mat = new MeshPhongMaterial({color: params.color})
			button = new Mesh(geo, mat)
			button.position.set(params.x, params.y, 0)
			let textMat = new MeshPhongMaterial({color: params.textColor})
			text = createText(params.text, font, textMat, 0.01)
			text.position.set(params.x, params.y, 1);
			window.addEventListener( 'click', onClick );
			let group = new Group()
			group.add(button, text);
			return group;
}

function checkIntersection(x, y) {
			mouse.x = ( x / window.innerWidth ) * 2 - 1;
			mouse.y = - ( y / window.innerHeight ) * 2 + 1;
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
