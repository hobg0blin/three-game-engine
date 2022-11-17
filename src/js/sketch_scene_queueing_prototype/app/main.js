// Global imports -
import * as THREE from 'three';
import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
//GUI/Buttons
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { createButton} from 'components/Three/button.js'
// ball for testing
import { createBall} from 'components/Three/ball.js'
// text stuff
import {createText} from 'components/Three/createText.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;

//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
//

// track scenes
let sceneIndex = 0
// track pixel direction
let dir = false
let pixelSize = 2

export default class Sketch {
    constructor() {
      this.render = this.render.bind(this) //bind to class instead of window object
      this.setup = this.setup.bind(this)
      this.animate = this.animate.bind(this)
      this.addObjects = this.addObjects.bind(this)
      this.disposeAll = this.disposeAll.bind(this)
      this.handleButtonClick = this.handleButtonClick.bind(this)

       // set up scene
      this.setup()
      this.addObjects()
      this.render()

    }

setup() {
  // CLOCK
        this.clock = new THREE.Clock()
  // CAMERA
        this.camera = createCamera()
        this.camera.position.set(0, 0, 25)
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
     this.pixelPass = new RenderPixelatedPass(pixelSize, this.scene, this.camera);
      this.composer.addPass(this.pixelPass)
      // GUI
        let gui = new GUI();
      // T H E S T U F F
        let button = createButton({
        x: 10,
        y: -10,
        Xsize: 6,
        Ysize: 2,
        color: 'green',
        textColor: 'black',
        text: 'next',
        camera: this.camera,
        callback: this.handleButtonClick
      })
    console.log('button: ', button);
         button.doNotDispose = true;
        this.scene.add(button);
      let textMat = new THREE.MeshPhongMaterial({color: 'green'});
      let textScale = 0.015
      let text;
      console.log('scene index: ', sceneIndex);
      if (sceneIndex > 3) {
        sceneIndex = 0
       }
      switch(sceneIndex) {
        case 0:
          console.log('foo');
          text = createText('it is hard to escape \n the language of domination', font, textMat, textScale)
          break;
        case 1:
          text = createText('i have spent my whole life \n treating myself \n as something to be controlled', font, textMat, textScale)
          break;
        case 2:
         text = createText('what does it do to you,', font, textMat, textScale)
          break;
        case 3:
          text = createText('to spend your entire life \n as your own enemy?', font, textMat, textScale)
          break;
      }
      this.scene.add(text)
    }
    handleButtonClick() {
        sceneIndex++
        this.disposeAll()
        this.addObjects()
    }
    disposeAll() {
      //TODO prob handle disposal in separate function that can be run recursively on an object
      this.scene.traverse(child => {
        if (child.doNotDispose) {
          return;
        } else if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
          this.scene.remove(child);
        } else if (child.isGroup) {
          //FIXME do i need to recurse this further?
          child.traverse(baby => {
            if (baby.isMesh) {
              baby.geometry.dispose();
              baby.material.dispose();
              this.scene.remove(baby);
            }
          })
           this.scene.remove(child)
        }
      })
      console.log('schildren: ', this.scene.children);
    }
    animate() {
          this.render()
          if (dir) {
            pixelSize+= 0.01
           } else {
             pixelSize -= 0.01
          }
          if (pixelSize > 4) {
            dir = false;
          }
         if (pixelSize < 1) {
           dir = true
         }
        this.pixelPass.setPixelSize(pixelSize)
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
          this.composer.render()
    }
}


