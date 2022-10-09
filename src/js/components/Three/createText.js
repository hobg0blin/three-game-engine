import {MeshPhongMaterial, Color, Mesh, Box3, Vector3, Group, PlaneGeometry} from 'three'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import randomColor from 'randomcolor'
let loader = new FontLoader()
let currentGoalColor = new Color
let currentColor = new Color
let boundingBox = new Box3();
let measure = new Vector3

function createText(text, font, mat) {
    let group = new Group();
    font = loader.parse(font)
    const geo = new TextGeometry(text, {font: font})
    geo.center()
  geo.scale(0.2, 0.2, 0.2)
    geo.attributes.position.array.needsUpdate = true
    geo.computeVertexNormals()
    let mesh = new Mesh(geo, mat)
    boundingBox.setFromObject(mesh)
    boundingBox.getSize(measure)
    console.log('measure: ', measure)
    let bubbleGeo = new PlaneGeometry(measure.x + 10, measure.y + 10)
    let bubbleMat = new MeshPhongMaterial({color: 'white'})
//    let bubble = new Mesh(bubbleGeo, bubbleMat)
    group.add(mesh)
 //   group.add(bubble)
    return group
}
function lerpColor(textObj, time) {
    if (Math.round(textObj.material.color.r*100)/100 == Math.round(currentGoalColor.r*100)/100 || time == 20){
        currentGoalColor = new Color(randomColor({format: 'rgb'}))
    }
    textObj.material.color.set(currentColor.lerpColors(textObj.material.color, currentGoalColor, 0.03))
    time *= 0.0005
//    textObj.rotation.y += time;

}
export { createText, lerpColor }

