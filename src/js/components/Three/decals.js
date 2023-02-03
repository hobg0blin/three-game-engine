import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const textureLoader = new THREE.TextureLoader();
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
const decalDiffuse = textureLoader.load(
  "https://threejs.org/examples/textures/decal/decal-diffuse.png"
);
const decalNormal = textureLoader.load(
  "https://threejs.org/examples/textures/decal/decal-normal.jpg"
);

const decalMaterial = new THREE.MeshPhongMaterial({
  specular: 0x444444,
  map: decalDiffuse,
  normalMap: decalNormal,
  normalScale: new THREE.Vector2(1, 1),
  shininess: 30,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -4,
  wireframe: false,
});

const decals = [];
let mouseHelper;
let mesh;
let intersectedMesh;
let modelChildren = [];
let raycaster;
let line;
let camera;

const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
};
const mouse = new THREE.Vector2();
const intersects = [];

const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3(10, 10, 10);
const params = {
  minScale: 10,
  maxScale: 20,
  rotate: true,
};

function onPointerMove(event) {
  if (event.isPrimary) {
    checkIntersection(event.clientX, event.clientY);
  }
}
function createDecals(scene, mainCamera, model) {
  camera = mainCamera;
  params.clear = function () {
    removeDecals(scene);
  };

  scene.add(new THREE.AmbientLight(0x443333));

  const dirLight1 = new THREE.DirectionalLight(0xffddcc, 1);
  dirLight1.position.set(1, 0.75, 0.5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xccccff, 1);
  dirLight2.position.set(-1, 0.75, -0.5);
  scene.add(dirLight2);

  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);

  line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
  scene.add(line);

  loadModel(scene, model);

  raycaster = new THREE.Raycaster();

  mouseHelper = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 10),
    new THREE.MeshNormalMaterial()
  );
  mouseHelper.visible = false;
  scene.add(mouseHelper);

  window.addEventListener("resize", onWindowResize);

  let moved = false;

  window.addEventListener("pointerdown", function () {
    moved = false;
  });

  window.addEventListener("pointerup", function (event) {
    if (moved === false) {
      checkIntersection(event.clientX, event.clientY);

      if (intersection.intersects) shoot(scene, intersectedMesh);
    }
  });

  window.addEventListener("pointermove", onPointerMove);
}
function checkIntersection(x, y) {
  if (modelChildren === undefined) return;

  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.intersectObjects(modelChildren, false, intersects);

  if (intersects.length > 0) {
    console.log("intersects: ", intersects);
    intersectedMesh = intersects[0].object;
    const p = intersects[0].point;
    mouseHelper.position.copy(p);
    intersection.point.copy(p);

    const n = intersects[0].face.normal.clone();
    n.transformDirection(mesh.matrixWorld);
    n.multiplyScalar(10);
    n.add(intersects[0].point);

    intersection.normal.copy(intersects[0].face.normal);
    mouseHelper.lookAt(n);

    const positions = line.geometry.attributes.position;
    positions.setXYZ(0, p.x, p.y, p.z);
    positions.setXYZ(1, n.x, n.y, n.z);
    positions.needsUpdate = true;

    intersection.intersects = true;

    intersects.length = 0;
  } else {
    intersection.intersects = false;
  }

  const gui = new GUI();

  gui.add(params, "minScale", 1, 30);
  gui.add(params, "maxScale", 1, 30);
  gui.add(params, "rotate");
  gui.add(params, "clear");
  gui.open();
}

function shoot(scene, intersectMesh) {
  position.copy(intersection.point);
  orientation.copy(mouseHelper.rotation);

  if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;

  const scale =
    params.minScale + Math.random() * (params.maxScale - params.minScale);
  size.set(scale, scale, scale);

  const material = decalMaterial.clone();
  material.color.setHex(Math.random() * 0xffffff);
  console.log("hitting decal");
  console.log("mesh: ", intersectMesh);
  const m = new THREE.Mesh(
    new DecalGeometry(intersectMesh, position, orientation, size),
    material
  );
  console.log("decal: ", m);

  decals.push(m);
  scene.add(m);
}

function removeDecals(scene) {
  decals.forEach(function (d) {
    scene.remove(d);
  });

  decals.length = 0;
}
function loadModel(scene, model) {
  const loader = new GLTFLoader();

  loader.load(model, function (gltf) {
    mesh = gltf.scene.children[0];
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        modelChildren.push(child);
      }
    });
    mesh.material = new THREE.MeshPhongMaterial({
      specular: 0x111111,
      //						map: textureLoader.load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Map-COL.jpg' ),
      //						specularMap: textureLoader.load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Map-SPEC.jpg' ),
      //						normalMap: textureLoader.load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
      shininess: 25,
    });
    console.log("loaded mesh: ", mesh);
    console.log("mesh: ", mesh);

    scene.add(mesh);
    mesh.rotation.z = THREE.MathUtils.degToRad(90);
    mesh.scale.set(10, 10, 10);
  });
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
export { createDecals };
