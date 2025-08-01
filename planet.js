// globe.js
import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('globe-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2.5;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

// Globe
const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
const globeMaterial = new THREE.MeshStandardMaterial({
  color: 0x001f3f,
  emissive: 0x112244,
  metalness: 0.6,
  roughness: 0.5
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 3, 5);
scene.add(dirLight);

// Convert lat/lon to 3D position
function latLonToVector3(lat, lon, radius = 1.01) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// Marker setup
const markers = [
  {
    lat: 10,
    lon: 77,
    title: "Wildlife AI",
    desc: "Predicting biodiversity changes with real-time data."
  },
  {
    lat: 48.85,
    lon: 2.35,
    title: "Climate AI",
    desc: "Monitoring emissions from satellites and sensors."
  },
  {
    lat: -33.9,
    lon: 151.2,
    title: "Ocean AI",
    desc: "Tracking ocean currents and plastic pollution."
  }
];

const markerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff });
const markerGeometry = new THREE.SphereGeometry(0.015, 32, 32);

markers.forEach(({ lat, lon, title, desc }) => {
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.copy(latLonToVector3(lat, lon));
  marker.userData = { title, desc };
  scene.add(marker);
});

// Raycasting for click interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoCard = document.getElementById('infoCard');
const cardTitle = document.getElementById('card-title');
const cardDesc = document.getElementById('card-description');

function onMouseClick(event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    const obj = intersects[i].object;
    if (obj.userData && obj.userData.title) {
      cardTitle.textContent = obj.userData.title;
      cardDesc.textContent = obj.userData.desc;
      infoCard.style.display = 'block';
      return;
    }
  }

  infoCard.style.display = 'none';
}

canvas.addEventListener('click', onMouseClick);

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
