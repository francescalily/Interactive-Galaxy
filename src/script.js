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
parameters.count = 1000;
parameters.size = 0.02;

const generateGalaxy = () => {
  const geometry = new THREE.BufferGeometry(); //new instance of geometry - buffer geometry is a class that allows to manage/store geometry data eg vertex positions
  const positions = new Float32Array(parameters.count * 3); //new array to store positions - *3 because each vertex in 3d space x y z

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3; //so every three positions in the array corresponds to one vertex
    positions[i3 + 0] = (Math.random() - 0.5) * 3; // does x
    positions[i3 + 1] = (Math.random() - 0.5) * 3; //does y coordinate
    positions[i3 + 2] = (Math.random() - 0.5) * 3; //does z coordinate of the vertex
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); //creates new attribute where 3 indicates that each vertex position is composed of 3 values

  //now making the material (points way of making particles)
  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  //making points
  const points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

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
