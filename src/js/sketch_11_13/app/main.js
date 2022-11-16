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
//GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
  import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
//POEM STUFF
let TextMat = new THREE.MeshPhongMaterial({color: 'lime'})
let play = true
let currentLineIndex = 0
let currentLine = null
let lines = ['i am an exposed wire', 'trying to regulate its current']
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;
let clock, time
let prevTime = 0;
let pixelSize = 4
let dir = false
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
        clock = new THREE.Clock()
        this.camera = createCamera()
        this.camera.position.set(0, 0, 100)
        // SCENE & RENDER
        this.renderer = createRenderer();
				this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.scene = new THREE.Scene();
        //EFFECTS
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
      this.pixelPass = new RenderPixelatedPass(6, this.scene, this.camera);
      this.composer.addPass(this.pixelPass)

			let gui = new GUI();
			let params = { pixelSize: pixelSize, normalEdgeStrength: .3, depthEdgeStrength: .4 };
			gui.add( params, 'pixelSize' ).min( 1 ).max( 16 ).step( 1 )
				.onChange( () => {

					this.pixelPass.setPixelSize( params.pixelSize );

				} );
			gui.add( this.pixelPass, 'normalEdgeStrength' ).min( 0 ).max( 2 ).step( .05 );
			gui.add( this.pixelPass, 'depthEdgeStrength' ).min( 0 ).max( 1 ).step( .05 );
    }
    playPoem() {
      play = true;
     if (dir) {
        pixelSize += 0.01
      } else {
        pixelSize -= 0.01
      }
     console.log('pixel size: ', pixelSize);
      if (pixelSize < 1) {
        dir = true
      }
      if (pixelSize > 60) {
        dir = false;
      }
        this.pixelPass.setPixelSize(pixelSize)
      console.log('current line: ', currentLineIndex, lines[currentLineIndex]);
     if (!currentLine) {
        currentLine = createText(lines[currentLineIndex], font, TextMat)
        currentLine.position.y = 0
       currentLine.scale.set(0.25, 0.25, 0.25)
        this.scene.add(currentLine)
      }
      if (time - prevTime >= 4) {

        prevTime = time
        this.scene.remove(currentLine)
        currentLineIndex++
      if (currentLineIndex > lines.length - 1) {
        currentLineIndex = 0;
        this.scene.remove(currentLine)
        currentLine = null;
      }

        currentLine = createText(lines[currentLineIndex], font, TextMat)
        currentLine.position.y = 0
       currentLine.scale.set(0.25, 0.25, 0.25)
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
      if (this.camera.position.z > 50) {
      this.camera.position.z -= 0.1
      }
        time = clock.getElapsedTime()
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


