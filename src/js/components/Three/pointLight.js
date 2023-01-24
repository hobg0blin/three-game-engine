import {PointLight, TextureLoader, vector3} from 'three'

function createPointLight({ color= 0xffffff, pos= new Vector3(100, 1000, 100), intensity=1, range= 0, width= 1024, height = 1024, near = 0.5, far = 400, fov = 30, url = null, castShadow = true, power = 1 } = {}) {
  //  lets destructure this fucker https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
const pointLight = new PointLight( color, intensity, range );
pointLight.position.set( pos.x, pos.y, pos.z );
if (url) {
  pointLight.map = new TextureLoader().load( url );
}

pointLight.castShadow = castShadow;

pointLight.shadow.mapSize.width = width;
pointLight.shadow.mapSize.height = height;

pointLight.shadow.camera.near = near;
pointLight.shadow.camera.far = far;
pointLight.shadow.camera.fov = fov;

return pointLight
}
export { createPointLight }

