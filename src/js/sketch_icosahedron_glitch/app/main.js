// Global imports -
import * as THREE from 'three';
import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
//Custom:
import {createSky} from 'components/Three/sun.js'
import {createWater} from 'components/Three/water.js'
import {proceduralTree} from 'components/Three/proceduralTree.js'
import {createTransmissiveMaterial} from 'components/Three/transmissiveMaterial.js'
//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js';



let time = 0

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Sketch {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.animate = this.animate.bind(this)
      this.addObjects = this.addObjects.bind(this)

       // set up scene
      this.setup()
      this.addObjects()
      this.render()

    }

setup() {
  // CAMERA
        this.camera = createCamera()
        this.camera.position.set(35, 5, 0)
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

        //BACKGROUND & FOG
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('/three/studio-bg.jpg')
        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, 0, 0)
     }


    addObjects() {
        // effects
        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        this.effect1 = new AfterimagePass(0.8)
//        this.composer.addPass(this.effect1)
        this.effect2 = new FilmPass(0.9, 0.7, 12, 0)
        this.composer.addPass(this.effect2)
        this.effect3 = new GlitchPass(1)
//        this.effect3.goWild = true;
        this.composer.addPass(this.effect3)
      				const params = {
					shape: 1,
					radius: 4,
					rotateR: Math.PI / 12,
					rotateB: Math.PI / 12 * 2,
					rotateG: Math.PI / 12 * 3,
					scatter: 0,
					blending: 1,
					blendingMode: 1,
					greyscale: false,
					disable: false
				};
				const halftonePass = new HalftonePass( window.innerWidth, window.innerHeight, params );
      this.composer.addPass(halftonePass);

  //      createSky(this.scene, this.renderer, 200)

  //      const planeBottom = createWater();
  //      planeBottom.water.position.y = -5
  //      this.scene.add( planeBottom.water );
  //      this.scene.add(planeBottom.baseMesh)
  //      planeBottom.baseMesh.position.y = -5.1
        let d20 = new THREE.IcosahedronGeometry(5);
        let blueMat = new THREE.MeshPhongMaterial({color: 'blue'});
      this.dice = []
        for (let i = -40; i <= 40; i+=5) {
        let die = new THREE.Mesh(d20, blueMat)
        die.position.set(i, Math.random() * 10, 0);
          this.dice.push(die)
        this.scene.add(die);
        }



    }
    animate() {
        let j = 0
        for (let i = -40; i <= 40; i+=5) {
        this.dice[j].rotation.z += 0.05 * Math.random()
        this.dice[j].position.set(Math.random() * i, Math.random() * 20, Math.random() * 20)
        j++
      //       this.die.position.x -= 0.1
        }
      if (j > 7) {
        j = 0
      }
        this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
          this.composer.render()
    }
}


