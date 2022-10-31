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
        this.camera.position.set(0, 5, 55)
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
        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        this.effect1 = new AfterimagePass(0.96)
        this.composer.addPass(this.effect1)
      let selfTex = this.textureLoader.load('/three/textures/myself.png')
      let presentTex = this.textureLoader.load('/three/textures/the_present.png')
      let futureTex = this.textureLoader.load('/three/textures/my_future_self.png')

      let selfMat = new THREE.MeshPhongMaterial({map: selfTex })
      selfTex.repeat.x = 5
      selfTex.repeat.y = 1.1
      selfTex.offset.x = -0.9
      let presentMat = new THREE.MeshPhongMaterial({map: presentTex})
      presentTex.repeat.x = 6
      presentTex.repeat.y = 1.1
      presentTex.offset.x = -0.8
      let futureMat = new THREE.MeshPhongMaterial({map: futureTex})
      futureTex.repeat.x = 4
      futureTex.offset.x = -0.2
      let selfSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), selfMat)
      selfSphere.position.x = -15
      let selfSphere2 = selfSphere.clone()
      selfSphere2.position.x = -25
      let selfSphere3 = selfSphere.clone()
      selfSphere3.position.x = -35

      let presentSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), presentMat)
      let futureSphere = new THREE.Mesh(new THREE.SphereGeometry(10, 10, 10), futureMat)
      futureSphere.position.x = 55
      let futureSphere2 = futureSphere.clone(0)
      futureSphere2.position.x = 40
      this.scene.add(selfSphere, selfSphere2, selfSphere3, presentSphere, futureSphere, futureSphere2)
      this.spheres = [selfSphere, selfSphere2, selfSphere3, presentSphere, futureSphere, futureSphere2]
        }
    animate() {
        let past = this.spheres[0]
        let past2 = this.spheres[1]
        let past3 = this.spheres[2]
        this.spheres[4].position.x -= 0.75
        this.spheres[4].position.y = Math.random() > 0.5 ? this.spheres[4].position.x * -1 *  Math.random()/2 : this.spheres[4].position.x * Math.random()/2
          if (this.spheres[4].position.x < 15) {
            this.spheres[4].position.set(55, 0, 0)
          }
        this.spheres[5].position.x -= 0.75
        this.spheres[5].position.y = Math.random() > 0.5 ? this.spheres[5].position.x * -1 *  Math.random()/2 : this.spheres[5].position.x * Math.random()/2
          if (this.spheres[5].position.x < 15) {
            this.spheres[5].position.set(55, 0, 0)
          }

        for (let i = 0; i < past.geometry.attributes.position.array.length; i++) {
          past.geometry.attributes.position.setX(i, past.geometry.attributes.position.getX(i) +  Math.random() > 0.5 ? Math.random() : Math.random() * -1)
//          past.geometry.attributes.position.setZ(i, past.geometry.attributes.position.getZ(i) - Math.random())
        }
//        past.geometry.attributes.position.needsUpdate = true
        past.geometry.computeVertexNormals()
        past.position.x -= 0.25
        if (past.position.x < -45) {
          past.position.x = -15
        }
        for (let i = 0; i < past2.geometry.attributes.position.array.length; i++) {
          past2.geometry.attributes.position.setX(i, past2.geometry.attributes.position.getX(i) +  Math.random() > 0.5 ? Math.random() : Math.random() * -1)
//          past2.geometry.attributes.position.setZ(i, past2.geometry.attributes.position.getZ(i) - Math.random())
        }
//        past2.geometry.attributes.position.needsUpdate = true
        past2.geometry.computeVertexNormals()
        past2.position.x -= 0.25
        if (past2.position.x < -45) {
          past2.position.x = -15
        }
        for (let i = 0; i < past3.geometry.attributes.position.array.length; i++) {
          past3.geometry.attributes.position.setX(i, past3.geometry.attributes.position.getX(i) +  Math.random() > 0.5 ? Math.random() : Math.random() * -1)
//          past3.geometry.attributes.position.setZ(i, past3.geometry.attributes.position.getZ(i) - Math.random())
        }
//        past3.geometry.attributes.position.needsUpdate = true
        past3.geometry.computeVertexNormals()
        past3.position.x -= 0.25
        if (past3.position.x < -45) {
          past3.position.x = -15
        }


        this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
          this.composer.render()
    }
}


