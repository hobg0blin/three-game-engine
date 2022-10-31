// Global imports -
import * as THREE from 'three';
window.THREE = THREE;
import toxi from 'components/toxiclibsjs';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {createControls, addToGUI} from 'components/Three/controls.js'

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
let circles = []

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
        this.camera.position.set(0, 0, 75)
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
      const geometry = new THREE.CircleGeometry( 5, 32 );
      let tex = this.textureLoader.load('/three/textures/uv_grid_opengl.jpg')
      const material = new THREE.MeshBasicMaterial( { map: tex } );
      const blackMat = new THREE.MeshBasicMaterial({ color: 'black', wireframe: true })
      const circle = new THREE.Mesh( geometry, material );
      const blackCircle = new THREE.Mesh( geometry, blackMat );
      for (let i = 0; i < 10; i++) {
        let newCircle
        if (i % 2 == 0) {
          newCircle = circle.clone()
        } else {
          newCircle = circle.clone()
        }
        newCircle.scale.set(i + 1, i+1, 1)
        newCircle.position.set(1, 1, 1-i)
        newCircle.rotateZ(Math.PI / i + 1)
        this.scene.add( newCircle );
        circles.push(newCircle)
      }
        }
    animate() {
      const t = clock.getElapsedTime()
      let rotation = Math.PI / 8
      for (let i = 0; i < circles.length; i++) {
        if (i % 2 == 0) {
        circles[i].rotateZ(rotation*(i/200))
        } else {
        circles[i].rotateZ(-1*rotation*(i/200))
        }
      }

       this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
    }
}


