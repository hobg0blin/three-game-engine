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
        this.scene.add(new THREE.AmbientLight({color: 'white', intensity: 0.6}))

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
    let material = new THREE.MeshPhongMaterial({color: 0xBAE8E6, opacity: 1.0, side: THREE.DoubleSide});
let options = {
    zoom: 10,
    scene: this.scene,
    meshResolution: 100,
    changeHarmonics: true,
    m: [5,8,3,1,7,3,3,7],
    randomizeHarmonics: function(){
        options.m = [];
        for(var i=0; i<8; i++) {
            options.m.push( parseInt(Math.random()*9, 10) );
        }
    },
    updateMesh: function(res){
        var sh, builder, toxiMesh, threeGeometry;
        if(res === undefined){
            res = options.meshResolution;
        }
        if(threeMesh !== undefined) {
            options.scene.remove(threeMesh);
        }
        if(options.changeHarmonics) {
            options.randomizeHarmonics();
        }


         sh = new toxi.geom.mesh.SphericalHarmonics( options.m );


        builder = new toxi.geom.mesh.SurfaceMeshBuilder( sh );


        toxiMesh = builder.createMesh(new toxi.geom.mesh.TriangleMesh(),res,1,true);

        threeGeometry = toxi.THREE.ToxiclibsSupport.createMeshGeometry( toxiMesh, new THREE.BufferGeometry());
        threeMesh = new THREE.Mesh( threeGeometry, material );
        threeMesh.scale.set(options.zoom, options.zoom, options.zoom);
        this.scene.add(threeMesh);
      console.log('threeMesh: ', threeMesh)
    }
};

let gui = new GUI()
gui.add(options,"zoom").min(10).max(500)
    .onChange(function(){
        threeMesh.scale.set(options.zoom,options.zoom,options.zoom);
    });
gui.add(material,"wireframe");
gui.add(options,"meshResolution")
    .name("Mesh Resolution").min(10).max(350).step(1);
gui.add(options,"changeHarmonics")
    .name("New Random Parameters");
gui.add(options,"updateMesh")
    .name("Generate New Mesh!");

    }
    animate() {
      if (threeMesh != undefined) {
        threeMesh.rotation.y += 0.02
      }
        this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

          this.renderer.render(this.scene, this.camera)
        //  this.composer.render()
    }
}


