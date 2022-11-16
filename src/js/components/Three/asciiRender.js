import {AsciiEffect} from 'three/examples/jsm/effects/AsciiEffect.js'
function createAsciiRenderer(renderer) {
      let effect = new AsciiEffect(renderer, ' .:-+*%@#', { invert: true, resolution: 0.10 } );
      effect.setSize( window.innerWidth, window.innerHeight );
      effect.domElement.style.color = 'white';
      effect.domElement.style.backgroundColor = 'black';
      document.body.appendChild( effect.domElement );
      return effect
}
export {createAsciiRenderer}

