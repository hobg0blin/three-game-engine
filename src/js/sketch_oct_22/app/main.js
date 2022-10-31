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
const isPrime = (n) => {
   for(let i = 2; i <= n/2; i++){
      if(n % i === 0){
         return false;
      }
   };
   return true;
};

const generatePrime = num => {
   const arr = [];
   let i = 2;
   while(arr.length < num){
      if(isPrime(i)){
         arr.push(i);
      };
      i = i === 2 ? i+1 : i+2;
   };
   return arr;
};

let oddPrimes = generatePrime(20);
oddPrimes.splice(1, 1);
let i = 0;


let j = 1;

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
        this.camera.position.set(0, 50, 450);
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
//    this.controls.target.set(0, 55, 0)
     }


    addObjects() {
      this.composer = new EffectComposer( this.renderer );
      this.composer.addPass( new RenderPass( this.scene, this.camera ) );
      this.effect1 = new AfterimagePass(0.97)
        this.composer.addPass(this.effect1)
      let geo = new THREE.SphereGeometry(5, 32)
      let mat = new THREE.MeshPhongMaterial({color: Math.random() * 255 })
      this.mesh = new THREE.Mesh(geo, mat);

      this.scene.add(this.mesh);
    }

    animate() {
      const t = clock.getElapsedTime()
      // attempt at Gauss's lemma
      let p = oddPrimes[i + 1];
      let a = oddPrimes[i];
      let numInts = (p-1)/2;
      this.mesh.position.set((p*5) - 75, (((j*a)%p)*5 ) - 25, a);
      console.log('x: ', p);
      console.log('y: ', ((j*a)%p)*5)
      if (j < numInts && (i < oddPrimes.length - 1)) {
        j++
      } else if (i < oddPrimes.length - 1) {
        this.mesh.material.color.set(Math.random()*0xffffff)
        i++
        j = 1
      } else {
        this.mesh.material.color.set(Math.random()*0xffffff)
        i = 0
        j = 1
      }

       this.render()
    }
    render(time, i) {
          setTimeout(() => {
            requestAnimationFrame(this.animate)
          }, 1000/30)

          this.renderer.render(this.scene, this.camera)
          this.composer.render()
    }
}

