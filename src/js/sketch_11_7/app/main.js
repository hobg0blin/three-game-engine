// Global imports -
import * as THREE from 'three';
window.THREE = THREE;
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {raycastSelector, onPointerMove} from 'components/Three/raycastSelector.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
import {createWater} from 'components/Three/water.js'
import {planesFromMesh, createPlanes, assignTransformedPlanes, cylindricalPlanes, planeToMatrix, setObjectWorldMatrix} from 'components/Three/clipping.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';


// clipping variables
  const Vertices = [
      new THREE.Vector3( + 4, 3, + Math.SQRT1_2 ),
      new THREE.Vector3( - 4, -3, + Math.SQRT1_2 ),
      new THREE.Vector3( 3, + 4, - Math.SQRT1_2 ),
      new THREE.Vector3( -3, - 4, - Math.SQRT1_2 )
    ],

    Indices = [
      0, 1, 2,	0, 2, 3,	0, 3, 1,	1, 3, 2
    ],

    Planes = planesFromMesh( Vertices, Indices ),
    PlaneMatrices = Planes.map( planeToMatrix ),

    GlobalClippingPlanes = cylindricalPlanes( 5, 2.5 ),

    Empty = Object.freeze( [] );


  let camera, scene, renderer, startTime, stats,

    object, clipMaterial,
    volumeVisualization,
    globalClippingPlanes;

  const transform = new THREE.Matrix4(),
    tmpMatrix = new THREE.Matrix4();

let clock;
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Sketch {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.animate = this.animate.bind(this)
      this.addObjects = this.addObjects.bind(this)
      clock = new THREE.Clock();
       // set up scene
//      Ammo().then(AmmoLib => {
//        Ammo = AmmoLib
        this.setup()
        this.addObjects()
        this.render()
 //     })
    }

setup() {
      document.addEventListener('mousemove', onPointerMove)
  // CAMERA
        this.camera = createCamera()
        this.camera.position.set(0, 1.5, 3);
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1
//        this.light = createLights({color: color, intensity: intensity})
 //       this.light[0].position.set(0, 50, 50)
  //      this.light[0].castShadow = true
  //      this.scene.add(this.light[0])
//        this.scene.add(new THREE.AmbientLight({color: 'white', intensity: 0.9}))
  				this.scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );

				const spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
				spotLight.angle = Math.PI / 5;
				spotLight.penumbra = 0.2;
				spotLight.position.set( 2, 3, 3 );
				spotLight.castShadow = true;
				spotLight.shadow.camera.near = 3;
				spotLight.shadow.camera.far = 10;
				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;
				this.scene.add( spotLight );

///				const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
///				dirLight.position.set( 0, 2, 0 );
///				dirLight.castShadow = true;
///				dirLight.shadow.camera.near = 1;
///				dirLight.shadow.camera.far = 10;
///
///				dirLight.shadow.camera.right = 1;
///				dirLight.shadow.camera.left = - 1;
///				dirLight.shadow.camera.top	= 1;
///				dirLight.shadow.camera.bottom = - 1;
///
///				dirLight.shadow.mapSize.width = 1024;
///				dirLight.shadow.mapSize.height = 1024;
///				this.scene.add( dirLight );

				// Geometry
				globalClippingPlanes = createPlanes( GlobalClippingPlanes.length );
				this.renderer.clippingPlanes = Empty;
				this.renderer.localClippingEnabled = true;

        //BACKGROUND & FOG
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('/three/studio-bg.jpg')
//        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, , 0)
     }


    addObjects() {
    startTime = Date.now();
    //  this.composer = new EffectComposer( this.renderer );
     // this.composer.addPass( new RenderPass( this.scene, this.camera ) );
      //this.effect1 = new AfterimagePass(0.97)

      let hankTex = this.textureLoader.load('/three/textures/hank.jpg')
      clipMaterial = new THREE.MeshPhongMaterial( {
					color: 0xee0a10,
          map: hankTex,
					shininess: 100,
					side: THREE.DoubleSide,
					// Clipping setup:
					clippingPlanes: createPlanes( Planes.length ),
					clipShadows: true
				} );

				object = new THREE.Group();

				const geometry = new THREE.BoxGeometry( 0.18, 0.18, 0.18 );

				for ( let z = - 2; z <= 2; ++ z )
					for ( let y = - 2; y <= 2; ++ y )
						for ( let x = - 2; x <= 2; ++ x ) {

							const mesh = new THREE.Mesh( geometry, clipMaterial );
							mesh.position.set( x / 5, y / 5, z / 5 );
							mesh.castShadow = true;
							object.add( mesh );

						}

				this.scene.add( object );


				const planeGeometry = new THREE.PlaneGeometry( 3, 3, 1, 1 ),

					color = new THREE.Color();

				volumeVisualization = new THREE.Group();
				volumeVisualization.visible = false;

				for ( let i = 0, n = Planes.length; i !== n; ++ i ) {

					const material = new THREE.MeshBasicMaterial( {
						color: color.setHSL( i / n, 0.5, 0.5 ).getHex(),
						side: THREE.DoubleSide,

						opacity: 0.9,
						transparent: true,

						// clip to the others to show the volume (wildly
						// intersecting transparent planes look bad)
						clippingPlanes: clipMaterial.clippingPlanes.
							filter( function ( _, j ) {

								return j !== i;

							} )

						// no need to enable shadow clipping - the plane
						// visualization does not cast shadows

					} );

					const mesh = new THREE.Mesh( planeGeometry, material );
					mesh.matrixAutoUpdate = false;

					volumeVisualization.add( mesh );

				}

				this.scene.add( volumeVisualization );


				const ground = new THREE.Mesh( planeGeometry,
					new THREE.MeshPhongMaterial( {
						color: 0xa0adaf, shininess: 10 } ) );
				ground.rotation.x = - Math.PI / 2;
				ground.scale.multiplyScalar( 3 );
				ground.receiveShadow = true;
				this.scene.add( ground );

        }

    animate() {
      const currentTime = Date.now(),
					time = ( currentTime - startTime ) / 1000
      object.position.y = 1;
				object.rotation.x = time * 0.5;
				object.rotation.y = time * 0.2;

				object.updateMatrix();
				transform.copy( object.matrix );

				const bouncy = Math.cos( time * .5 ) * 0.5 + 0.7;
				transform.multiply(
					tmpMatrix.makeScale( bouncy, bouncy, bouncy ) );

				assignTransformedPlanes(
					clipMaterial.clippingPlanes, Planes, transform );

				const planeMeshes = volumeVisualization.children;

				for ( let i = 0, n = planeMeshes.length; i !== n; ++ i ) {

					tmpMatrix.multiplyMatrices( transform, PlaneMatrices[ i ] );
					setObjectWorldMatrix( planeMeshes[ i ], tmpMatrix, this.scene );

				}

				transform.makeRotationY( time * 0.1 );

				assignTransformedPlanes( globalClippingPlanes, GlobalClippingPlanes, transform );

       this.render()
    }
    render() {
 //         setTimeout(() => {
        requestAnimationFrame(this.animate)
//          }, 1000/30)

          this.renderer.render(this.scene, this.camera)
//          this.composer.render()
    }
}
function onDocumentMouseClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse pos:', mouse)
}
