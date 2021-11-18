// Art 109 Three.js Demo Site
// client3.js
// A three.js scene which uses basic shapes to generate a scene which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core
import * as THREE from "../senbazuru/buildJS/three.module.js";
// Import pointer lock controls
import { PointerLockControls } from "../senbazuru/sourceJS/PointerLockControls.js";
//Import GLTF Loader
import {
  GLTFLoader
} from "../senbazuru/sourceJS/GLTFLoader.js";

// Establish variables
let camera, scene, renderer, controls;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFd6FF);
  //color of the world edge
  //scene.fog = new THREE.Fog(0xFFd6FF, 0, 750);

  // Define scene lighting
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("intro");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

//---floor code---//
  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);

//---Generate objects (cubes) *replace with cranes*---//
  /*const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

  position = boxGeometry.attributes.position;
  const colorsBox = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0, Math.random() * 0.25 + 0.75);
    colorsBox.push(color.r, color.g, color.b);
  }

  boxGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsBox, 3)
  );

//number of boxes/cranes
  for (let i = 0; i < 1000; i++) {
    const boxMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: true
    });
    boxMaterial.color.setHSL(
      Math.random() * 0.2 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75
    );

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = Math.floor(Math.random() * 20 * 10) * 20;
    box.position.y = Math.floor(Math.random() * 20) * 20 * 10;
    box.position.z = Math.floor(Math.random() * 20 * 10) * 20;

    // Insert completed boxes into the scene
    scene.add(box);
    objects.push(box);
  }*/

//---crane code---//
  // Material to be added to static model
//var newMaterial2 = new THREE.MeshStandardMaterial({
//  color: 0x99B9FF
//});

let crane;
// Load static model, add material, and add it to the scene
const loader2 = new GLTFLoader().load(
  "../senbazuru/GLTFS/AnimatedCrane.glb",
  function(gltf) {
    // Scan loaded model for mesh and apply defined material if mesh is present
    gltf.scene.traverse(function(child) {
      if (child.isMesh) {
        child.material = newMaterial2;
      }
    });
    // set position and scale
    crane = gltf.scene;
  //  crane.position.set(0, 0, 500);
  //  crane.rotation.set(0, 0, 0);
  //  crane.scale.set(5, 5, 5);
    const craneGeometry = new THREE.craneGeometry(20, 20, 20).toNonIndexed();

    position = craneGeometry.attributes.position;
    const colorsCrane = [];

    for (let i = 0, l = position.count; i < l; i++) {
      color.setHSL(Math.random() * 0.3 + 0.5, 0, Math.random() * 0.25 + 0.75);
      colorsCrane.push(color.r, color.g, color.b);
    }

    craneGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsCrane, 3)
    );

    for (let i = 0; i < 1000; i++) {
      const craneMaterial = new THREE.MeshStandardMaterial({
        //specular: 0xffffff,
        flatShading: true,
        vertexColors: true
      });

    const crane = new THREE.Mesh(craneGeometry, craneMaterial);
    crane.position.x = Math.floor(Math.random() * 20 * 10) * 20;
    crane.position.y = Math.floor(Math.random() * 20) * 20 * 10;
    crane.position.z = Math.floor(Math.random() * 20 * 10) * 20;

    // Add model to scene
    scene.add(crane);
      }
    });

  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}
