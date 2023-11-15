import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import GUI from "lil-gui";

const gui = new GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const textureLoader = new THREE.TextureLoader();
// const particleTexture = textureLoader.load("./textures/particles/pdLogo.png");

//need an object to add tweaks to gui
const parameters = {};
parameters.pointDensity = 10;
// parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = "#93F23A";
parameters.outsideColor = "#C70C00";

let particleGeometry = null;
let particleMaterial = null;
let particleMesh = null;

const generateGalaxy = () => {
  if (particleMesh !== null) {
    particleGeometry.dispose();
    particleMaterial.dispose();
    scene.remove(particleMesh);
  }
  const loader = new SVGLoader();
  loader.load("./textures/particles/pdLogo.svg", function (data) {
    const paths = data.paths;
    const particles = [];

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      // Extract points from the path
      const points = path.subPaths.flatMap((subPath) =>
        subPath.getPoints(parameters.pointDensity)
      );

      particles.push(...points);
    }

    // Create particle geometry
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    particles.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = 0;
    });
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const radius = Math.random() * parameters.radius;

    // Create particle material
    particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: parameters.size,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create particle mesh and add to the scene
    particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleMesh);
    particleMesh.scale.set(0.0005, 0.0005, 0.0005);
    const box = new THREE.Box3().setFromObject(particleMesh);
    const center = box.getCenter(new THREE.Vector3());
    particleMesh.position.x += particleMesh.position.x - center.x;
    particleMesh.position.y += particleMesh.position.y - center.y;
    particleMesh.position.z += particleMesh.position.z - center.z;
  });
};
generateGalaxy();

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

gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);

gui.add(parameters, "insideColor").onFinishChange(generateGalaxy);

gui.add(parameters, "outsideColor").onFinishChange(generateGalaxy);

gui
  .add(parameters, "pointDensity")
  .min(1)
  .max(200)
  .step(1)
  .onFinishChange(generateGalaxy);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

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

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(0xffffff, 0);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// const loader = new SVGLoader();

// // load a SVG resource
// let pdGeometry = loader.load(
//   // resource URL
//   "./textures/particles/pdLogo.svg",
//   // called when the resource is loaded
//   function (data) {
//     const paths = data.paths;
//     const particles = [];
//     const group = new THREE.Group();
//     console.log("group", group);
//     console.log(data);

//     for (let i = 0; i < paths.length; i++) {
//       const path = paths[i];

//       const points = path.subPaths
//         .flatMap((subPath) => subPath.getPoints())
//         .filter((point) => !isNaN(point.x) && !isNaN(point.y));
//       particles.push(...points);

//       const particleGeometry = new THREE.BufferGeometry();
//       const positions = new Float32Array(points.length * 3);
//       points.forEach((point, i) => {
//         positions[i * 3] = point.x;
//         positions[i * 3 + 1] = point.y;
//         positions[i * 3 + 2] = 0;
//       });
//       particleGeometry.setAttribute(
//         "position",
//         new THREE.BufferAttribute(positions, 3)
//       );
//       console.log("points", points);
//       console.log("particles", particles);
//       console.log("positions", positions);

//       const material = new THREE.PointsMaterial({
//         color: 0xffffff,
//         size: 0.1,
//         transparent: true,
//         blending: THREE.AdditiveBlending,
//       });

//       const particleMesh = new THREE.Points(particleGeometry, material);

//       scene.add(particleMesh);

//       const shapes = SVGLoader.createShapes(path);
//       console.log(path);

//       for (let j = 0; j < shapes.length; j++) {
//         const shape = shapes[j];
//         const geometry = new THREE.ShapeGeometry(shape);
//         const mesh = new THREE.Mesh(geometry, material);
//         group.add(mesh);
//       }
//     }

//     scene.add(group);
//     //group.position.set(0, 0, 0);
//     group.scale.set(0.0005, 0.0005, 0.0005);
//     const box = new THREE.Box3().setFromObject(group);
//     const center = box.getCenter(new THREE.Vector3());
//     group.position.x += group.position.x - center.x;
//     group.position.y += group.position.y - center.y;
//     group.position.z += group.position.z - center.z; // Adjust scaling if necessary
//   },
//   // called when loading is in progresses
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   },
//   // called when loading has errors
//   function (error) {
//     console.log("An error happened", error);
//   }
// );

//galaxy

//have to use null because otherwise the parameters will not be destroyed

// const generateGalaxy = () => {
//   //gets rid of galaxy when something in there
//   if (points !== null) {
//     geometry.dispose();
//     material.dispose();
//     scene.remove(points);
//   }
//   geometry = new THREE.BufferGeometry();

//   //new instance of geometry - buffer geometry is a class that allows to manage/store geometry data eg vertex positions
//   const positions = new Float32Array(parameters.count * 3); //new array to store positions - *3 because each vertex in 3d space x y z

//   for (let i = 0; i < parameters.count; i++) {
//     const i3 = i * 3; //so every three positions in the array corresponds to one vertex

//     const radius = Math.random() * parameters.radius;
//     const spinAngle = radius * parameters.spin;
//     const branchAngle =
//       ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

//     const randomX =
//       Math.pow(Math.random(), parameters.randomnessPower) *
//       (Math.random() < 0.5 ? 1 : -1);
//     const randomY =
//       Math.pow(Math.random(), parameters.randomnessPower) *
//       (Math.random() < 0.5 ? 1 : -1);
//     const randomZ =
//       Math.pow(Math.random(), parameters.randomnessPower) *
//       (Math.random() < 0.5 ? 1 : -1);

//     positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // does x
//     positions[i3 + 1] = randomY; //does y coordinate
//     positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; //does z coordinate of the vertex
//   }
//   geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); //creates new attribute where 3 indicates that each vertex position is composed of 3 values

//   //now making the material (points way of making particles)
//   material = new THREE.PointsMaterial({
//     // color: 0x000000,
//     transparent: true,
//     //map: particleTexture,
//     size: parameters.size,
//     sizeAttenuation: true,
//     depthWrite: false,
//     blending: THREE.AdditiveBlending,
//   });

//   //making points
//   points = new THREE.Points(geometry, material);
//   scene.add(points);
// };

// generateGalaxy();
