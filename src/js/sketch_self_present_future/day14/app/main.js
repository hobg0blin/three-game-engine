// Global imports -
import * as THREE from 'three';
window.THREE = THREE;
import toxi from 'components/toxiclibsjs';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
//Custom hyperbolic shaders fromhttps://github.com/looeee/hyperbolic-tiling/blob/main/src/main.js :
//
import 'components/Three/hyperbolic/utilities/polyfills.js'
import createGeometries from "components/Three/hyperbolic/utilities/createGeometries";
import basicVert from "components/Three/hyperbolic/shaders/basic.vert";
import basicFrag from "components/Three/hyperbolic/shaders/basic.frag";

import RegularHyperbolicTesselation from "components/Three/hyperbolic/utilities/RegularHyperbolicTesselation.js";
//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

let threeMesh;

let time = 0
let uniforms, clock;
const cols = 10
const rows = 10
const totalCount = 100
const fps = 4

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Sketch {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.animate = this.animate.bind(this)
      this.addObjects = this.addObjects.bind(this)

      clock = new THREE.Clock();
       // set up scene
      this.setup()
      this.addObjects()
      this.render()

    }

setup() {
  // CAMERA
        this.camera = createCamera()
        this.camera.position.set(0, 0, 5)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.5
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 100, 50)
        this.light[0].castShadow = true
        this.scene.add(this.light[0])
        this.scene.add(new THREE.AmbientLight({color: 'white', intensity: 0.6}))

        //BACKGROUND & FOG
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('/three/studio-bg.jpg')
//        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, 0, 0)
     }


    addObjects() {
      this.spritesheet = this.textureLoader.load('/three/textures/rogue.png')
      		this.spritesheet.minFilter = THREE.LinearFilter;

		this.spritesheet.repeat.x = (1 / cols) * 8;
		this.spritesheet.repeat.y = (1 / rows);
      const geo = new THREE.BoxGeometry(10, 1)
      const mat = new THREE.MeshBasicMaterial({map: this.spritesheet})
      const mesh = new THREE.Mesh(geo, mat)
//`      const mesh2 = new THREE.Mesh(geo, mat)
//`      mesh2.position.x = -0.5
//`      mesh2.rotation.y = THREE.MathUtils.degToRad(90)
//`      const mesh3 = new THREE.Mesh(geo, mat)
//`      mesh3.position.x = 0.5
//`      mesh3.rotation.y = THREE.MathUtils.degToRad(180)
//`      const mesh4 = new THREE.Mesh(geo, mat)
//`      mesh4.position.x = 1.5
      //mesh4.rotation.y = THREE.MathUtils.degToRad(270)
      this.scene.add(mesh/*, mesh2, mesh3, mesh4 */)
        }
    animate() {
//      code from https://jsfiddle.net/3uf8ba5w/
      const t = clock.getElapsedTime()

      if ( this.spritesheet ) {
      const t = clock.getElapsedTime() * fps;

			const imageIndex = Math.floor( t % totalCount );
			const col = imageIndex % cols;
			const row = Math.floor( imageIndex / cols );

			this.spritesheet.offset.x = (col / cols)  ;
			this.spritesheet.offset.y =  ( ( 1 + row ) / rows );      }

        this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
    }
}


