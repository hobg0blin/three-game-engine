// Global imports -
import * as THREE from 'three';
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
        this.camera.position.set(75, 50, 0)
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
    ///    this.composer = new EffectComposer( this.renderer );
    ///    this.composer.addPass( new RenderPass( this.scene, this.camera ) );
    ///    this.effect1 = new AfterimagePass(0.8)
//  ///      this.composer.addPass(this.effect1)
    ///    this.effect2 = new FilmPass(0.3, 0.7, 4, 0)
    ///    this.composer.addPass(this.effect2)
      let hank = this.textureLoader.load('/three/textures/hank.jpg')
      uniforms = {
        tileTexture: {type: "t", value: hank},
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
      };
	uniforms.u_resolution.value.x = this.renderer.domElement.width;
	uniforms.u_resolution.value.y = this.renderer.domElement.height;
      this.spec = {
      wireframe: false,
      p: 6,
      q: 6,
      radius: 100,
      textures: [`/three/textures/hank.jpg`, `/three/textures/hank.jpg`],
      edgeAdjacency: [
        // array of length p
        [
          1, // edge_0 orientation (-1 = reflection, 1 = rotation)
          5, // edge_0 adjacency (range p - 1)
        ],
        [1, 4], // edge_1 orientation, adjacency
        [1, 3],
        [1, 2],
        [1, 1],
        [1, 0],
      ],
      minPolygonSize: 0.01,
    };
    const tiling = new RegularHyperbolicTesselation(this.spec).generateTiling(
      false
    );
        const mat = new THREE.RawShaderMaterial({uniforms, vertexShader: basicVert, fragmentShader: basicFrag, side: THREE.DoubleSide})
        const geo = createGeometries(tiling)
      const meshA = new THREE.Mesh(geo[0], mat);
      const meshB = new THREE.Mesh(geo[1], mat);
      this.scene.add(meshA, meshB);


    }
    animate() {
        this.render()
    }
    render(time, i) {
      	uniforms.u_time.value = clock.getElapsedTime();
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
        //  this.composer.render()
    }
}


