import { MeshPhongMaterial, Mesh, PlaneGeometry, Group } from "three";

function createBackground(pos, measure, hasBubble = true, hasOutline = false) {
  console.log("measure in background: ", measure);
  let group = new Group();
  if (hasOutline) {
    let scale = 1.02;
    let outline = new Mesh(geo, outlineMat);
    outline.scale.set(scale, scale, scale);
    group.add(outline);
  }
  if (hasBubble) {
    let bubbleGeo = new PlaneGeometry(measure.x + 10, measure.y * 10);
    let bubbleMat = new MeshPhongMaterial({ color: "white" });
    let bubble = new Mesh(bubbleGeo, bubbleMat);
    group.add(bubble);
  }
  group.position.set(pos.x, pos.y, pos.z - 1);
  return group;
}

export { createBackground };
