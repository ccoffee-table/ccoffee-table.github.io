// Import the required Three.js modules
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.120.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/GLTFLoader.js";
import { WindowResize } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/utils/WindowResize.js";

// Set up the Three.js environment
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set the initial size of the renderer
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Set up the WindowResize helper to automatically handle
// resizing the window
const windowResize = new WindowResize( renderer, camera );

// Declare the variables for the 3D models
let face;
let leftEye;
let rightEye;

// Load the 3D model of the face
const faceLoader = new GLTFLoader();
faceLoader.load( "models/face.glb", function( gltf ) {
  face = gltf.scene;
  scene.add( face );
  face.scale.set(0.5, 0.5, 0.5);
  camera.position.z = 5;
  face.rotation.y = 0;

  // Set up the event listener to rotate the face and eyes
  // based on mouse movement
  document.addEventListener( "mousemove", function( event ) {
    // Calculate the new rotation of the face based on the
    // mouse position
    const rotSpeed = 0.01;
    face.rotation.y = ( event.clientX - window.innerWidth / 2 ) * rotSpeed;

    // Calculate the direction vector of the eyes based on the
    // mouse position and set the rotation of the eyes so that
    // they are pointed in that direction
    const vector = new THREE.Vector3();
    vector.set(
      2 * (event.clientX / window.innerWidth) - 1,
      -2 * (event.clientY / window.innerHeight) + 1,
      0.5 );
    vector.unproject( camera );
    const dir = vector.sub( camera.position ).normalize();
    const distance = - camera.position.z / dir.z;
    const pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
    const target = new THREE.Vector3().addVectors( camera.position, dir );
    leftEye.lookAt( target );
    rightEye.lookAt( target );
  });
});

// Load the 3D model of the left eye
const leftEyeLoader = new GLTFLoader();
leftEyeLoader.load( "models/left_eye.glb", function( gltf ) {
  leftEye = gltf.scene;
  scene.add( leftEye );
  leftEye.scale.set(0.5, 0.5, 0.5);
});

// Load the 3D model of the right eye
const rightEyeLoader = new GLTFLoader();
rightEyeLoader.load( "models/right_eye.glb", function( gltf ) {
  rightEye = gltf.scene;
  scene.add( rightEye );
  rightEye.scale.set(0.5, 0.5, 0.5);
});

// Set up the animation loop to render the scene
function animate() {
requestAnimationFrame( animate );
renderer.render( scene, camera );
}
animate();
