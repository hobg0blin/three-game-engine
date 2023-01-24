import {MeshPhongMaterial, MeshLambertMaterial, Color, Mesh, Box3, BackSide, Vector3, Group, PlaneGeometry} from 'three'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TTFLoader} from 'three/examples/jsm/loaders/TTFLoader.js'
import randomColor from 'randomcolor'
let loader = new FontLoader()
let currentGoalColor = new Color
let currentColor = new Color
let boundingBox = new Box3();
let measure = new Vector3
let currentFont, lastFont;

let outlineMat = new MeshLambertMaterial({color: 'black', side: BackSide});

function createText(text, font, mat, scale=0.2, pos = {x: 0, y: 0, z: 0}, hasBubble= false, hasOutline = false, isTTF=false) {
    let group = new Group();
    const createMesh = () => {
    console.log('creating mesh!');
    console.log('text: ', text);
    const geo = new TextGeometry(text, {font: font})
    geo.center()
  geo.scale(scale, scale, scale)
    geo.attributes.position.array.needsUpdate = true
    geo.computeVertexNormals()
    let mesh = new Mesh(geo, mat)
    boundingBox.setFromObject(mesh)
    boundingBox.getSize(measure)
    console.log('measure: ', measure)
    group.add(mesh)
    if (hasOutline) {
      let scale = 1.02
      let outline = new Mesh(geo, outlineMat)
      outline.scale.set(scale, scale, scale)
      group.add(outline)
    }
    if (hasBubble) {
      let bubbleGeo = new PlaneGeometry(measure.x + 10, measure.y + 10)
      let bubbleMat = new MeshPhongMaterial({color: 'white'})
      let bubble = new Mesh(bubbleGeo, bubbleMat)
      group.add(bubble)
    }
    group.position.set(pos.x, pos.y, pos.z)
    return group
  }

    if (!isTTF) {
      if (lastFont != font) {
        font = loader.parse(font);
        currentFont = font;
        lastFont = font
        group = createMesh()
      } else {
        group = createMesh()
      }
        return group
    } else {
      console.log('current font:' , currentFont)
      console.log('input font: ', font);
      if (lastFont != font) {
        lastFont = font
      console.log('should be laoding new font');
      let ttfLoader = new TTFLoader()
      ttfLoader.load(font, (ttf) => {
      console.log('parsing ttf', ttf)
          font =  loader.parse(ttf);
           group = createMesh()
          currentFont = font
        })
      //somewhat hacky solution for async reesult
      return group
      } else {
        console.log('skipping font reload');
        return createMesh()
    }
    }
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

