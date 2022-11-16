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
import {createText} from 'components/Three/createText.js'
//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js';
//POEM STUFF
let TextMat = new THREE.MeshPhongMaterial({color: 'lime'})
let play = true
let currentLineIndex = 0
let currentLine = null
let lines = ['i am an exposed wire']
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;



let time = 0

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Sketch {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.animate = this.animate.bind(this)
      this.playPoem = this.playPoem.bind(this)
      this.clearText = this.clearText.bind(this)
      this.addObjects = this.addObjects.bind(this)

       // set up scene
      this.setup()
      this.addObjects()
      this.render()

    }

setup() {
  // CAMERA
        this.camera = createCamera()
        this.camera.position.set(0, 0, 400)
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
        this.scene.add(new THREE.AmbientLight({color: 'white', intensity: 1}))

        //BACKGROUND & FOG
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('/three/studio-bg.jpg')
//        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, 0, 0)
     }


    addObjects() {
        // effects
        this.composer = new EffectComposer( this.renderer);
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        this.effect1 = new AfterimagePass(0.9)
  //      this.composer.addPass(this.effect1);
        this.effect2 = new FilmPass(0.9, 0.7, 12, 0)
        this.composer.addPass(this.effect2)
        this.effect3 = new GlitchPass(1)
//        this.effect3.goWild = true;
        this.composer.addPass(this.effect3)


    }
    playPoem() {
      play = true;
      console.log('current line: ', currentLineIndex, lines[currentLineIndex]);
      if (!currentLine) {
        currentLine = createText(lines[currentLineIndex], font, TextMat)
        currentLine.position.y = 120
        this.scene.add(currentLine)
      }
      if (currentLine.position.y > -120) {
    //    currentLine.position.y -= 0.5
      } else {
      //  this.scene.remove(currentLine)
     //   currentLineIndex++
      if (currentLineIndex > lines.length - 1) {
 //       currentLineIndex = 0;
       // this.scene.remove(currentLine)
//        currentLine = null;
      }


        currentLine = createText(lines[currentLineIndex], font, TextMat)
        currentLine.position.y = 120
        this.scene.add(currentLine);
      }
    }
    clearText() {
      lines = ['']
    }
    updateText(update) {
      console.log('update: ', update);
      if (update.hasOwnProperty('font')) {
        font = update.font
      }

      if (update.hasOwnProperty('value')) {
        lines.push(update.value)
      }

    }

    animate() {
        if (play) {
          this.playPoem()
        }
        this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
          this.composer.render()
    }
}

