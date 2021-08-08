import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import confetti from 'canvas-confetti'
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
camera.position.set(0, 0.485, 0.783);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target = new THREE.Vector3(0, 0.2, 0);
controls.enableDamping = true

// Birthday Cake
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/birthday-cake/dist/static/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

let cake = new THREE.Group();
let text = new THREE.Group();

gltfLoader.load(
    '/birthday-cake/dist/static/models/cake/gltf-DRACO/cake.gltf',
    (gltf) => {
        cake = gltf.scene;
        scene.add(cake);

        candleAnim();
        confettiAnim();
    }
)

gltfLoader.load(
    '/birthday-cake/dist/static/models/text/gltf-DRACO/text.gltf',
    (gltf) => {
        text = gltf.scene;

        text.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material = new THREE.MeshPhongMaterial({ color: 0x540851 });
            }
        });
        text.position.y = 0.12;
        text.scale.set(0.08, 0.08, 0.08);
        text.name = "Text"
        scene.add(text);
    }
)

// Directional Light
const dLightRight = new THREE.DirectionalLight('#ffffff', 1.5);
const dLightLeft = new THREE.DirectionalLight('#ffffff', 1.5);
const dLightFront = new THREE.DirectionalLight('#ffffff', 0.8);
dLightRight.position.set(1.3, 3.0, 0.0);
dLightLeft.position.set(-1.3, 3.0, 0.0);
dLightFront.position.set(0, 0, 0.5);

// Hemisphere Light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 50, 0);

// Point Light
const candleLight = new THREE.PointLight(0xfffcbb, 0.4, 0.26);
candleLight.position.set(0, 0.3, 0);
candleLight.scale.set(0.02, 0.02, 0.02)

scene.add(dLightRight, dLightLeft, dLightFront, candleLight);

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const randomInRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

const confettiAnim = () => {
    let duration = 15 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    let interval = setInterval(() => {
        let timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            confettiAnim();
        }

        let particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

const candleAnim = () => {
    const timeline = gsap.timeline({ onComplete: () => candleAnim() });
    const candleIntensity = Math.random() * 8;

    timeline.to(candleLight, { intensity: candleIntensity, duration: 0.5, yoyo: true })
}

//Animate
const tick = () => {
    // Update controls
    controls.update();

    cake.rotation.y = cake.rotation.y + 0.005
    text.rotation.z = text.rotation.z + 0.005

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();