import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap } from 'gsap'

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100);
camera.position.set(0, 0.2, 0.5);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target = new THREE.Vector3(0, 0.2, 0);
controls.enableDamping = true

// Birthday Cake
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/static/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

let cake = new THREE.Object3D();

gltfLoader.load(
    '/static/models/cake/gltf-DRACO/cake.gltf',
    (gltf) =>
    {
        console.log(gltf);
        cake = gltf.scene;   
        scene.add(cake);
    }
)

// Lights
const dLight = new THREE.DirectionalLight('#ffffff', 1.5);
const dLight2 = new THREE.DirectionalLight('#ffffff', 1.5);
dLight.position.set(1.3, 3.0, 0.0);
dLight2.position.set(-1.3, 3.0, 0.0);
scene.add(dLight, dLight2);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();