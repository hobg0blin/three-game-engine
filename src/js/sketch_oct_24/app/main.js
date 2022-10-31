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
let lines = []
let points = []

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
        this.camera.position.set(0, 5, 50);
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
        this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, , 0)
     }


    addObjects() {
      this.composer = new EffectComposer( this.renderer );
      this.composer.addPass( new RenderPass( this.scene, this.camera ) );
      this.effect1 = new AfterimagePass(0.97)
      const planeGeo = new THREE.CylinderGeometry(5, 5, 20, 32)
      const planeNose = new THREE.SphereGeometry(5, 32);
      const planeTail = new THREE.TetrahedronGeometry(2);
      const planeWing = new THREE.ConeGeometry(1, 5, 5);
      const planeMat = new THREE.MeshToonMaterial({color: 'white'})
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      const planeWingMesh = new THREE.Mesh(planeWing, planeMat);
      planeWingMesh.position.z = 15;
      const planeTailMesh = new THREE.Mesh(planeTail, planeMat);
      planeTailMesh.position.y = -20;

      const planeNoseMesh = new THREE.Mesh(planeTail, planeMat);
      planeNoseMesh.position.y = 15;
      this.scene.add(planeMesh);
      this.scene.add(planeWingMesh);
      this.scene.add(planeTailMesh);
      this.scene.add(planeTailMesh);
    }

    animate() {
      const t = clock.getElapsedTime()
      for (let line of lines) {
        if (line.baseX < 4  && line.forward) {
          let path = new THREE.Path();
          path.moveTo(line.geometry.attributes.position.array[0], 0)
          path.bezierCurveTo(line.baseX, 10/3,  line.baseX + 2, (10/3)*2,line.baseX + 4, 10);
//          path.bezierCurveTo(line.baseX + 1, 5, );
//          path.lineTo(line.baseX + 4, 10)
          line.baseX += 4;
          line.geometry.setFromPoints(path.getPoints());
          line.geometry.computeVertexNormals();
        } else if (line.baseX > -8 && !line.forward) {
          let path = new THREE.Path();
          path.moveTo(line.geometry.attributes.position.array[0], 0)
          path.bezierCurveTo(line.baseX, 10/3, line.baseX - 2, (10/3)*2,line.baseX - 4, 10);
 //         path.quadraticCurveTo(line.baseX - 1, 5, line.baseX - 2, 7.5);
 //         path.lineTo(line.baseX - 4, 10)
          line.baseX -= 4;
          line.geometry.setFromPoints(path.getPoints());
          line.geometry.computeVertexNormals();
        } else {
          line.forward = !line.forward;
        }
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

