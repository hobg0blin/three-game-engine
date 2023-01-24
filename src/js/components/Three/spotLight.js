import {SpotLight, TextureLoader, vector3} from 'three'

function createSpotLight({ color= 0xffffff, pos= new Vector3(100, 1000, 100),  width= 1024, height = 1024, near = 0.5, far = 400, fov = 30, url = null, castShadow = true  } = {}) {
  //  lets destructure this fucker https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
const spotLight = new SpotLight( color );
spotLight.position.set( pos.x, pos.y, pos.z );
if (url) {
  spotLight.map = new TextureLoader().load( url );
}

spotLight.castShadow = castShadow;

spotLight.shadow.mapSize.width = width;
spotLight.shadow.mapSize.height = height;

spotLight.shadow.camera.near = near;
spotLight.shadow.camera.far = far;
spotLight.shadow.camera.fov = fov;

return spotLight
}
export { createSpotLight }

