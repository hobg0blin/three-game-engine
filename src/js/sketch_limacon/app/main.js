// Global imports -
import * as THREE from 'three';
window.THREE = THREE;
import toxi from 'components/toxiclibsjs';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
import {createWater} from 'components/Three/water.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

let threeMesh;
let bounds = [-5, 5]
let elements = []

let time = 0
let uniforms, clock;
const cols = 10
const rows = 10
const totalCount = 100
const fps = 4
let circles = []
let maxDeg = 360
let a = 30;
let b = 80;
let i = 0;
let centerx = 0;
let centery = 0;
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
        this.camera.position.set(0, -50, 125)
        // SCENE & RENDER
        this.renderer = createRenderer()
        this.scene = new THREE.Scene();

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.5
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(0, 50, 50)
        this.light[0].castShadow = true
        this.scene.add(this.light[0])
//        this.scene.add(new THREE.AmbientLight({color: 'white', intensity: 0.9}))

        //BACKGROUND & FOG
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('/three/textures/space_bg.jpg')
//        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, -75, 0)
     }


    addObjects() {
      this.composer = new EffectComposer( this.renderer );
      this.composer.addPass( new RenderPass( this.scene, this.camera ) );
      this.effect1 = new AfterimagePass(0.97)
        this.composer.addPass(this.effect1)
      let geo = new THREE.SphereGeometry(5, 32)
      let mat = new THREE.MeshPhongMaterial({color: Math.random() * 255 })
      this.mesh = new THREE.Mesh(geo, mat);
      this.mesh2 = new THREE.Mesh(geo, mat);

      this.scene.add(this.mesh, this.mesh2);
    }

    animate() {
      const t = clock.getElapsedTime()
      let rotation = Math.PI / 8
    if (i < 360) {
      let extra = i + 2;
      while (i < extra) {
          let angle = i * Math.PI / 180;
          let x = centerx + ((a + b * Math.sin(angle)) * Math.cos(angle));
          let y = centery + ((a + b * Math.sin(angle)) * Math.cos(angle) * Math.tan(angle));
      this.mesh.position.set(x, y, 0);
      this.mesh2.position.set(x*-1, y*-1, 0);
      i++;
      }
      } else {
        this.mesh.material.color.set(Math.random()*0xffffff)
        i = 0;
      if (a == 30) {
          a = 60;
          b = 40;
      } else if (b == 40) {
        a = 60;
        b = 30;
      } else {
        a = 30;
        b = 80;
      }
      }

       this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
          this.composer.render()
    }
}

