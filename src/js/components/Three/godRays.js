let postprocessing = { enabled: 'true' }
import {Vector3, Vector4, MeshDepthMaterial} from 'three'
const sunPosition = new Vector3( 0, 1000, - 1000 );
const clipPosition = new Vector4();
const screenSpacePosition = new Vector3();
const godrayRenderTargetResolutionMultiplier = 1.0 / 6.0;
const    materialDepth = new MeshDepthMaterial();

const bgColor = 0x000511;
const sunColor = 0xffee00;
import { GodRaysFakeSunShader, GodRaysDepthMaskShader, GodRaysCombineShader, GodRaysGenerateShader } from 'three/addons/shaders/GodRaysShader.js';

function getStepSize( filterLen, tapsPerPass, pass ) {
    return filterLen * Math.pow( tapsPerPass, - pass );
}
function initPostProcessing( THREE, renderTargetWidth, renderTargetHeight, camera, scene ) {
    window.addEventListener( 'resize',() => {onWindowResize(camera, scene)});
    postprocessing.scene = new THREE.Scene();

    postprocessing.camera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, - 10000, 10000 );
    postprocessing.camera.position.z = 100;

    postprocessing.scene.add( postprocessing.camera );

    postprocessing.rtTextureColors = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight );

    // Switching the depth formats to luminance from rgb doesn't seem to work. I didn't
    // investigate further for now.
    // pars.format = LuminanceFormat;

    // I would have this quarter size and use it as one of the ping-pong render
    // targets but the aliasing causes some temporal flickering

    postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight );
    postprocessing.rtTextureDepthMask = new THREE.WebGLRenderTarget( renderTargetWidth, renderTargetHeight );

    // The ping-pong render targets can use an adjusted resolution to minimize cost

    const adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
    const adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
    postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight );
    postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget( adjustedWidth, adjustedHeight );

    // god-ray shaders

    const godraysMaskShader = GodRaysDepthMaskShader;
    postprocessing.godrayMaskUniforms = THREE.UniformsUtils.clone( godraysMaskShader.uniforms );
    postprocessing.materialGodraysDepthMask = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godrayMaskUniforms,
        vertexShader: godraysMaskShader.vertexShader,
        fragmentShader: godraysMaskShader.fragmentShader

    } );

    const godraysGenShader = GodRaysGenerateShader;
    postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone( godraysGenShader.uniforms );
    postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godrayGenUniforms,
        vertexShader: godraysGenShader.vertexShader,
        fragmentShader: godraysGenShader.fragmentShader

    } );

    const godraysCombineShader = GodRaysCombineShader;
    postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone( godraysCombineShader.uniforms );
    postprocessing.materialGodraysCombine = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godrayCombineUniforms,
        vertexShader: godraysCombineShader.vertexShader,
        fragmentShader: godraysCombineShader.fragmentShader

    } );

    const godraysFakeSunShader = GodRaysFakeSunShader;
    postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone( godraysFakeSunShader.uniforms );
    postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial( {

        uniforms: postprocessing.godraysFakeSunUniforms,
        vertexShader: godraysFakeSunShader.vertexShader,
        fragmentShader: godraysFakeSunShader.fragmentShader

    } );

    postprocessing.godraysFakeSunUniforms.bgColor.value.setHex( bgColor );
    postprocessing.godraysFakeSunUniforms.sunColor.value.setHex( sunColor );

    postprocessing.godrayCombineUniforms.fGodRayIntensity.value = 0.55;

    postprocessing.quad = new THREE.Mesh(
        new THREE.PlaneGeometry( 1.0, 1.0 ),
        postprocessing.materialGodraysGenerate
    );
    postprocessing.quad.position.z = - 9900;
    postprocessing.scene.add( postprocessing.quad );

}
function filterGodRays( inputTex, renderTarget, stepSize, renderer ) {

    postprocessing.scene.overrideMaterial = postprocessing.materialGodraysGenerate;

    postprocessing.godrayGenUniforms[ 'fStepSize' ].value = stepSize;
    postprocessing.godrayGenUniforms[ 'tInput' ].value = inputTex;

    renderer.setRenderTarget( renderTarget );
    renderer.render( postprocessing.scene, postprocessing.camera );
    postprocessing.scene.overrideMaterial = null;

}
function renderPostProcessing(scene, renderer, camera){
    if ( postprocessing.enabled ) {

            clipPosition.x = sunPosition.x;
            clipPosition.y = sunPosition.y;
            clipPosition.z = sunPosition.z;
            clipPosition.w = 1;

            clipPosition.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );

            // perspective divide (produce NDC space)

            clipPosition.x /= clipPosition.w;
            clipPosition.y /= clipPosition.w;

            screenSpacePosition.x = ( clipPosition.x + 1 ) / 2; // transform from [-1,1] to [0,1]
            screenSpacePosition.y = ( clipPosition.y + 1 ) / 2; // transform from [-1,1] to [0,1]
            screenSpacePosition.z = clipPosition.z; // needs to stay in clip space for visibilty checks

            // Give it to the god-ray and sun shaders

            postprocessing.godrayGenUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );
            postprocessing.godraysFakeSunUniforms[ 'vSunPositionScreenSpace' ].value.copy( screenSpacePosition );

            // -- Draw sky and sun --

            // Clear colors and depths, will clear to sky color

            renderer.setRenderTarget( postprocessing.rtTextureColors );
            renderer.clear( true, true, false );

            // Sun render. Runs a shader that gives a brightness based on the screen
            // space distance to the sun. Not very efficient, so i make a scissor
            // rectangle around the suns position to avoid rendering surrounding pixels.

            const sunsqH = 2.24 * window.innerHeight; // 0.74 depends on extent of sun from shader
            const sunsqW = 2.24 * window.innerHeight; // both depend on height because sun is aspect-corrected

            screenSpacePosition.x *= window.innerWidth;
            screenSpacePosition.y *= window.innerHeight;

            renderer.setScissor( screenSpacePosition.x - sunsqW / 2, screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
            renderer.setScissorTest( true );

            postprocessing.godraysFakeSunUniforms[ 'fAspect' ].value = window.innerWidth / window.innerHeight;

            postprocessing.scene.overrideMaterial = postprocessing.materialGodraysFakeSun;
            renderer.setRenderTarget( postprocessing.rtTextureColors );
            renderer.render( postprocessing.scene, postprocessing.camera );

            renderer.setScissorTest( false );

            // -- Draw scene objects --

            // Colors

            scene.overrideMaterial = null;
            renderer.setRenderTarget( postprocessing.rtTextureColors );
            renderer.render( scene, camera );

            // Depth

            scene.overrideMaterial = materialDepth;
            renderer.setRenderTarget( postprocessing.rtTextureDepth );
            renderer.clear();
            renderer.render( scene, camera );

            //

            postprocessing.godrayMaskUniforms[ 'tInput' ].value = postprocessing.rtTextureDepth.texture;

            postprocessing.scene.overrideMaterial = postprocessing.materialGodraysDepthMask;
            renderer.setRenderTarget( postprocessing.rtTextureDepthMask );
            renderer.render( postprocessing.scene, postprocessing.camera );

            // -- Render god-rays --

            // Maximum length of god-rays (in texture space [0,1]X[0,1])

            const filterLen = 2.0;

            // Samples taken by filter

            const TAPS_PER_PASS = 8.0;

            // Pass order could equivalently be 3,2,1 (instead of 1,2,3), which
            // would start with a small filter support and grow to large. however
            // the large-to-small order produces less objectionable aliasing artifacts that
            // appear as a glimmer along the length of the beams

            // pass 1 - render into first ping-pong target
            filterGodRays( postprocessing.rtTextureDepthMask.texture, postprocessing.rtTextureGodRays2, getStepSize( filterLen, TAPS_PER_PASS, 1.0 ), renderer );

            // pass 2 - render into second ping-pong target
            filterGodRays( postprocessing.rtTextureGodRays2.texture, postprocessing.rtTextureGodRays1, getStepSize( filterLen, TAPS_PER_PASS, 2.0 ), renderer );

            // pass 3 - 1st RT
            filterGodRays( postprocessing.rtTextureGodRays1.texture, postprocessing.rtTextureGodRays2, getStepSize( filterLen, TAPS_PER_PASS, 3.0 ), renderer );

            // final pass - composite god-rays onto colors

            postprocessing.godrayCombineUniforms[ 'tColors' ].value = postprocessing.rtTextureColors.texture;
            postprocessing.godrayCombineUniforms[ 'tGodRays' ].value = postprocessing.rtTextureGodRays2.texture;

            postprocessing.scene.overrideMaterial = postprocessing.materialGodraysCombine;

            renderer.setRenderTarget( null );
            renderer.render( postprocessing.scene, postprocessing.camera );
            postprocessing.scene.overrideMaterial = null;

        } else {

            renderer.setRenderTarget( null );
            renderer.clear();
            renderer.render( scene, camera );

        }

    }

			function onWindowResize(camera, renderer) {

				const renderTargetWidth = window.innerWidth;
				const renderTargetHeight = window.innerHeight;

				camera.aspect = renderTargetWidth / renderTargetHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( renderTargetWidth, renderTargetHeight );
				postprocessing.rtTextureColors.setSize( renderTargetWidth, renderTargetHeight );
				postprocessing.rtTextureDepth.setSize( renderTargetWidth, renderTargetHeight );
				postprocessing.rtTextureDepthMask.setSize( renderTargetWidth, renderTargetHeight );

				const adjustedWidth = renderTargetWidth * godrayRenderTargetResolutionMultiplier;
				const adjustedHeight = renderTargetHeight * godrayRenderTargetResolutionMultiplier;
				postprocessing.rtTextureGodRays1.setSize( adjustedWidth, adjustedHeight );
				postprocessing.rtTextureGodRays2.setSize( adjustedWidth, adjustedHeight );

			}
export {postprocessing, initPostProcessing, renderPostProcessing}
