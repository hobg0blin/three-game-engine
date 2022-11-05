// Global imports -
import * as THREE from 'three';
window.THREE = THREE;
import toxi from 'components/toxiclibsjs';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {raycastSelector, onPointerMove} from 'components/Three/raycastSelector.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
import {createWater} from 'components/Three/water.js'

import {initPhysics, createPhysicsObjects, initInput, updatePhysics, processClick} from 'components/Three/Physics/PhysicsUtils.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

let threeMesh;
let lines = []
let points = []

let time = 0
let uniforms, clock;
let mouse = new THREE.Vector2()

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Sketch {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.animate = this.animate.bind(this)
      this.addObjects = this.addObjects.bind(this)
      this.initPhysics = initPhysics.bind(this)
      this.createPhysicsObjects = createPhysicsObjects.bind(this)
      this.initInput = initInput.bind(this)
      this.updatePhysics = updatePhysics.bind(this)
      clock = new THREE.Clock();
       // set up scene
      Ammo().then(AmmoLib => {
        Ammo = AmmoLib
        this.setup()
        this.addObjects()
        this.initPhysics()
        this.createPhysicsObjects()
        this.initInput(this.raycaster)
        this.addObjects()
        this.render()
      })
    }

setup() {
      document.addEventListener('mousemove', onPointerMove)
  // CAMERA
        this.camera = createCamera()
        this.camera.position.set(0, 25, 30);
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster()

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 50, 50)
        this.light[0].castShadow = true
        this.scene.add(this.light[0])
//        this.scene.add(new THREE.AmbientLight({color: 'white', intensity: 0.9}))

        //BACKGROUND & FOG
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('/three/studio-bg.jpg')
        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, , 0)
     }


    addObjects() {
      this.composer = new EffectComposer( this.renderer );
      this.composer.addPass( new RenderPass( this.scene, this.camera ) );
      this.effect1 = new AfterimagePass(0.97)
        }

    animate() {
      let d = clock.getDelta()
      this.updatePhysics(d);
      raycastSelector(this.camera, this.scene, this.raycaster)
       this.render()
    }
    render(time, i) {
 //         setTimeout(() => {
        requestAnimationFrame(this.animate)
//          }, 1000/30)
      let t = clock.getElapsedTime()

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
