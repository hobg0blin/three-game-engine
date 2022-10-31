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
        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, 0, 0)
     }


    addObjects() {
      let geo =new THREE.ConeGeometry(5, 10, 4)
      let waterShape = createWater(geo);
        this.scene.add(waterShape.water)
        waterShape.water.rotateY(Math.PI)
      waterShape.water.position.setZ(bounds[1])
      let stoneTex = this.textureLoader.load('/three/textures/stone-granite-1-TEX.png')
      let skyTex =this.textureLoader.load('/three/textures/sky_cloud.jpg')
      let fireTex =this.textureLoader.load('/three/textures/fire.jpg')
      let stone = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({map: stoneTex}))
      stone.position.setZ(bounds[0])
      console.log('stone pos: ', stone.position)
      stone.rotateX((Math.PI/2))
      let fire = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({map: fireTex}))
      fire.position.setY(bounds[1])
      fire.rotateX((Math.PI/2)*2)
      let sky = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({map: skyTex}))
      sky.position.setY(bounds[0])
        this.scene.add(stone, fire, sky)
      elements.push(waterShape.water, fire, stone, sky)
 //       this.scene.add(waterShape.baseMesh)
//        waterShape.baseMesh.scale.set(0.99)
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
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        let posY = Math.round(element.position.y * 10) /10
        let posZ = Math.round(element.position.z * 10) /10
        console.log('pos y: ', element.position.y)
        if (i % 2 != 0 && posY == 5.0) {
          console.log('foo');
          element.downY = true;
            element.position.y -= 0.1
        } else if (i % 2  != 0 && posY == -5.0) {
          element.downY = false
            element.position.y += 0.1
        } else if (i % 2 == 0 && posZ == 5.0) {
          console.log('foo2')
          element.downZ = true
            element.position.z -= 0.1
        } else if (i % 2 == 0 && posZ == -5.0) {
            element.downZ = false;
            element.position.z += 0.1
        } else {
          if (element.downZ == true) {
            element.position.z -= 0.05
          }
          if (element.downZ == false) {
            element.position.z += 0.05
          }
          if (element.downY == true) {
            element.position.y -= 0.05
          }

           if (element.downY == false) {
            element.position.y += 0.05
          }


        }
      }

       this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
    }
}

