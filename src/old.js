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

const generateGalaxy = () => {
  //gets rid of galaxy when something in there
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry();

  //new instance of geometry - buffer geometry is a class that allows to manage/store geometry data eg vertex positions
  const positions = new Float32Array(parameters.count * 3); //new array to store positions - *3 because each vertex in 3d space x y z

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3; //so every three positions in the array corresponds to one vertex

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // does x
    positions[i3 + 1] = randomY; //does y coordinate
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; //does z coordinate of the vertex
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); //creates new attribute where 3 indicates that each vertex position is composed of 3 values

  //now making the material (points way of making particles)
  material = new THREE.PointsMaterial({
    // color: 0x000000,
    transparent: true,
    //map: particleTexture,
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
