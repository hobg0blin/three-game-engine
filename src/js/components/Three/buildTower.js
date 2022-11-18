import { Object3D, Mesh, Group, CylinderGeometry} from 'three'
function buildTower(size, mat, children) {
  let sizeMod = .65;
  let building = new Group()
  let base = createLayer(size, mat, children, false, sizeMod);
  building.add(base)
  return building
  function createLayer(size, mat, children, isChild, sizeMod) {
        let length = Math.random() * (size * 10) + size * 5;
        if (children == 0) { var endSize = 0; } else { var endSize = size * sizeMod; }

        var layer = new Mesh(new CylinderGeometry(endSize, size, length, 5, 1, true), mat);
        building.add(layer);
      layer.position.x = Math.random()*size/2
      layer.position.y = length / 2;
      if (children > 0) {
        for (let c=0; c<children; c++) {
          let child = createLayer(size * sizeMod, mat, children - 1, true, sizeMod);
          }
      } else {
        return
      }
  }
}

  export { buildTower }
