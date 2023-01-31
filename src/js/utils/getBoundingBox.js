import { Box3, Vector3 } from 'three'
function getBoundingBox(mesh) {
    console.log('getting bounding box of: ', mesh)
//    mesh.geometry.computeBoundingBox()
    let boundingBox = new Box3();
    let measure = new Vector3()
    boundingBox.setFromObject(mesh)
    boundingBox.getSize(measure)
    return { 'box': boundingBox, 'measure': measure}
}

export { getBoundingBox }
