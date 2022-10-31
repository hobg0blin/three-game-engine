// Global imports -
import * as THREE from 'three';
import {createCamera} from 'components/Three/camera.js'
import {createLights} from 'components/Three/lights.js'
import {createRenderer} from 'components/Three/renderer.js'
import {createControls, addToGUI} from 'components/Three/controls.js'
//Custom:
import {createSky} from 'components/Three/sun.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {createWater} from 'components/Three/water.js'
import {proceduralTree} from 'components/Three/proceduralTree.js'
import {createTransmissiveMaterial} from 'components/Three/transmissiveMaterial.js'
//PostProcessing
import {initPostProcessing, renderPostProcessing} from 'components/Three/godRays.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';



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
        this.camera = createCamera(70, window.innerWidth / window.innerHeight, 1, 3000)
        this.camera.position.z = 200
        // SCENE & RENDER
        this.renderer = createRenderer()
    this.renderer.autoClear = false
    this.renderer.setClearColor(0xFFFFFF)
        this.scene = new THREE.Scene();

        //LIGHTS
        const color = 0xFFFFFF
        const intensity = 1.5
        this.light = createLights({color: color, intensity: intensity})
        this.light[0].position.set(-100, 100, 0)
        this.light[0].castShadow = true
        this.scene.add(this.light[0])
//        const ambient = new THREE.AmbientLight( 0x404040, 0.1 ); // soft white light
//        scene.add( ambient );
        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add( light );
        //BACKGROUND & FOG
        this.textureLoader = new THREE.TextureLoader()
        let backgroundImg = this.textureLoader.load('/three/studio-bg.jpg')
 //       this.scene.background = backgroundImg
        // CONTROLS
      this.controls = createControls(this.camera, this.renderer)
//    this.controls.target.set(0, 0, 0)
      initPostProcessing(THREE, window.innerWidth, window.innerHeight, this.camera, this.scene)
     }


    addObjects() {
        // effects
        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );
        this.effect1 = new AfterimagePass(1)
        this.composer.addPass(this.effect1)
        this.effect2 = new FilmPass(0.3, 0.7, 4, 0)
        this.composer.addPass(this.effect2)

//        let sky = createSky(this.scene, this.renderer, 200)
        // GUI
        const effectController = {
                turbidity: 10,
                rayleigh: 3,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.7,
                elevation: 2,
                azimuth: 180,
                exposure: this.renderer.toneMappingExposure
        };
        let scene = this.scene
        let renderer = this.renderer
        let camera = this.camera
        function guiChanged() {

            const uniforms = sky.sky.material.uniforms;
            uniforms[ 'turbidity' ].value = effectController.turbidity;
            uniforms[ 'rayleigh' ].value = effectController.rayleigh;
            uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
            uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
            const theta = THREE.MathUtils.degToRad( effectController.azimuth );

            sky.sun.setFromSphericalCoords( 1, phi, theta );

            uniforms[ 'sunPosition' ].value.copy( sky.sun );

            renderer.toneMappingExposure = effectController.exposure;
            renderer.render( scene, camera );

        }

//        const gui = new GUI();
//
//        gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
//        gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
//        gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
//        gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
//        gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
//        gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
//        gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );
//
 //       guiChanged();

        const planeBottom = createWater(500, 500);
        planeBottom.water.position.y = -5
//        this.scene.add( planeBottom.water );
//        this.scene.add(planeBottom.baseMesh)
        planeBottom.baseMesh.position.y = -5.1

//      let transmissiveMat = createTransmissiveMaterial({ opacity: 0.9, specularIntensity: 2, thickness: 1, transmission: 1, exposure: 0.1})
        this.tree = proceduralTree(14.5,new THREE.MeshBasicMaterial({color: 'brown'}), 5)
        this.tree.position.set(0, -5, 0)
        this.scene.add(this.tree)

    }
    animate() {
        this.tree.rotation.y += 0.01
        this.tree.position.y += 0.01
        this.render()
    }
    render(time, i) {
          requestAnimationFrame(this.animate)

        renderPostProcessing(this.scene, this.renderer, this.camera)
          this.renderer.render(this.scene, this.camera)
        // this.composer.render()
    }
}


