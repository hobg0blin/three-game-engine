// Global imports -
import * as THREE from 'three';
import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
//GUI/Buttons
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { createButton} from 'components/Three/button.js'
import { buildTower } from 'components/Three/buildTower.js'
import { mouse } from 'components/Three/mouseTracker.js'

// OBJECTS AND SUCH
// ball for testing
import { createBall} from 'components/Three/ball.js'
// text stuff
import {createText} from 'components/Three/createText.js'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
let font = helvetiker;

// MODELS
import { importSTLModel } from 'components/Three/importSTLModel.js'

//PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
// track scenes
let sceneIndex = 0
// track pixel direction
let dir = false
let pixelSize = 2


// stuff
let globe, tower;
let windowWidth, windowHeight

function updateSize(renderer) {

  if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    renderer.setSize( windowWidth, windowHeight );

  }

}

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
    // SCENE & RENDER
    this.renderer = createRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.scene = new THREE.Scene();
        // effects
        this.composers = []

  // CAMERA & VIEWPORTS

        this.camera = createCamera()
        this.camera.position.set(0, 20, 100)

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
      console.log('adding objects');
        // effects
        this.composer = new EffectComposer( this.renderer);
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
     this.pixelPass = new RenderPixelatedPass(pixelSize, this.scene, this.camera);
      this.composer.addPass(this.pixelPass)

      // GUI
        let gui = new GUI();
      const firstPass = () => {
      // T H E S T U F F
      //
      // next button
        let button = createButton({
        x: 10,
        z: 26,
        y: -10,
        Xsize: 6,
        Ysize: 2,
        ratio: {h: 0.25, w: 1},
        color: 'green',
        textColor: 'black',
        text: 'next',
          camera: this.camera,
        callback: this.handleButtonClick
      })
         button.doNotDispose = true;
        this.scene.add(button);
        console.log('button: ', button);
      // GLOBe

      //i don't know why people use constants for functions now but it seems fancy
      const addSTLModel = (geo, mat) => {
        let stl = new THREE.Mesh(geo, mat);
        stl.doNotDispose = true;
        stl.position.set(0, -12, -100);
        stl.rotation.x = THREE.MathUtils.degToRad(-90)
        stl.rotation.z = THREE.MathUtils.degToRad(30)
        this.scene.add(stl);
        globe = stl
        return stl
      }
      let globeMat = new THREE.MeshPhongMaterial({ color: 'green', wireframe: true})
      //model from here: https://cults3d.com/en/3d-model/art/earth-globe
      importSTLModel('/three/models/earth_wireframe.stl', globeMat, addSTLModel)

      // T O W E R
      let towerMat = new THREE.MeshPhongMaterial({color: 'white', wireframe: true})
      tower = buildTower(4,towerMat, 4)
      tower.position.z = -100
      tower.position.y = 12
      tower.doNotDispose = true;
      this.scene.add(tower);
      }
      // text

      let textMat = new THREE.MeshPhongMaterial({color: 'green'});
      let textScale = 0.015
      let textPos = {x: 0, y: -5, z: 25}
      let text;
      if (sceneIndex > 4) {
        sceneIndex = 0
       }
      //FIXME: there is, presumably, a better way to do this than a switch, but also go fuck yourself
      switch(sceneIndex) {
        case 0:
          firstPass()
          text = createText('there is a tower at the end of the world.', font, textMat, textScale, textPos, true, false, false)
          break;
        case 1:
          text = createText('it rises past what used to be the stratosphere,', font, textMat, textScale, textPos, true, false, false)
          break;
        case 2:
         text = createText('but there is no sky left for it to pierce.', font, textMat, textScale, textPos, true, false, false)
          break;
        case 3:
          text = createText('it is a monument to everything that ever was, \n a cemetry of ideas.', font, textMat, textScale, textPos, true, false, false)
          break;
        case 4:
          text = createText('it is a place where nothing new will ever be born.', font, textMat, textScale, textPos, true, false, false)
          break;

      }
      console.log('text: ', text);
      this.scene.add(text)
    }
    handleButtonClick() {
        sceneIndex++
        this.disposeAll()
        this.addObjects()
    }
    disposeAll() {
      //TODO prob handle disposal in separate function that can be run recursively on an object
      const toRemove = []
      this.scene.traverse(child => {
        console.log('child: ', child);
        if (child.doNotDispose) {
          return;
        } else if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
          toRemove.push(child)
        } else if (child.isGroup) {
          //FIXME do i need to recurse this further?
          child.traverse(baby => {
            if (baby.isMesh) {
              baby.geometry.dispose();
              baby.material.dispose();
              toRemove.push(baby)
            }
          })
           toRemove.push(child)
        }
      })
      toRemove.forEach(child => {
        this.scene.remove(child)
      })
      console.log('schildren: ', this.scene.children);
    }
    animate() {
     if (globe != undefined && tower != undefined) {
          globe.rotation.z += 0.003
          tower.rotation.y += 0.003
      }
          this.render()
          if (dir) {
            pixelSize+= 0.005
           } else {
             pixelSize -= 0.005
          }
          if (pixelSize > 3) {
            dir = false;
          }
         if (pixelSize < 1.5) {
           dir = true
         }
          this.pixelPass.setPixelSize(pixelSize)
    }

    render(time, i) {
          updateSize(this.renderer)
          requestAnimationFrame(this.animate)
          this.renderer.render(this.scene, this.camera)
          this.composer.render()
    }

}


