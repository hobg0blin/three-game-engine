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
let TextMat = new THREE.MeshPhongMaterial({color: 'black'})
let play = true
let currentLineIndex = 0
let currentLine = null
let lines = ['it is right to be angry', 'at the gulf between', 'the way things are', 'and the way they could be']
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;
let coeffs = []


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
        this.camera.position.set(0, 0, 250)
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
        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, 0, 0)
     }


    addObjects() {
        // effects
        this.composer = new EffectComposer( this.renderer);
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        this.effect1 = new AfterimagePass(0.99)
        this.composer.addPass(this.effect1);
        this.effect2 = new FilmPass(0.9, 0.7, 12, 0)
//        this.composer.addPass(this.effect2)

    }
    playPoem() {
      play = true;
      if (!currentLine) {
        currentLine = new THREE.Group()
        let x = -150;
        for (let letter of lines[currentLineIndex].split('')) {
          let line = createText(letter, font, TextMat)
          line.position.x = x
          x += 15
          currentLine.add(line)
          coeffs.push(Math.random() * Math.random())
        }
        currentLine.position.y = 120
        this.scene.add(currentLine)
      }
      if (currentLine.position.y > -120) {
        currentLine.position.y -= 0.5
        for (let [i, child] of currentLine.children.entries()) {
          for (let metachild of child.children) {
            metachild.position.y -= 0.2 * coeffs[i];
          }
        }
      } else {
        this.scene.remove(currentLine)
        currentLineIndex++
      if (currentLineIndex > lines.length - 1) {
        currentLineIndex = 0;
        this.scene.remove(currentLine)
        currentLine = null;
      }
        currentLine = new THREE.Group()
        currentLine.position.y = 120
        let x = -150
        coeffs = []
        for (let letter of lines[currentLineIndex].split('')) {
          let line = createText(letter, font, TextMat)
          line.position.x = x
          x+= 15
          currentLine.add(line)
          coeffs.push(Math.random() * Math.random())
        }
        this.scene.add(currentLine)
      }
    }

    clearText() {
      lines = ['']
    }
    updateText(update) {
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


