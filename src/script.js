import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//galaxy

//need an object to add tweaks to gui
const parameters = {};
parameters.count = 100000;
parameters.size = 0.001;
parameters.radius = 5;
parameters.branches = 3;

//have to use null because otherwise the parameters will not be destroyed
let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  //gets rid of galaxy when something in there
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry(); //new instance of geometry - buffer geometry is a class that allows to manage/store geometry data eg vertex positions
  const positions = new Float32Array(parameters.count * 3); //new array to store positions - *3 because each vertex in 3d space x y z

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3; //so every three positions in the array corresponds to one vertex

    const radius = Math.random() * parameters.radius;
    const branchAngle = i % parameters.branches;
    const branches = Math.random() * parameters.branches;
    positions[i3 + 0] = radius * branchAngle; // does x
    positions[i3 + 1] = 0; //does y coordinate
    positions[i3 + 2] = 0; //does z coordinate of the vertex
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); //creates new attribute where 3 indicates that each vertex position is composed of 3 values

  //now making the material (points way of making particles)
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  //making points
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy); //onFinishChange means it will change the galaxy when the user lets go of using the slider

gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
