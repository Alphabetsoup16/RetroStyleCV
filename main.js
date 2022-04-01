import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000)
camera.position.setZ(20);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#canvas')});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const pointLight1 = new THREE.PointLight(0xBF40BF);
pointLight1.position.set(5, -28.5, 5);

const pointLight2 = new THREE.PointLight(0x12f09b);
pointLight2.position.set(5, 5, 5);

scene.add(pointLight1, pointLight2);

const rhombusGeometry = new THREE.OctahedronGeometry(1, 0);
const sphereGeometry = new THREE.SphereGeometry(0.3, 20, 20);
const whiteMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
const metallicWhite = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  metalness: 0.1,
  roughness: 0.2,
  transparent: true,
  opacity: 0.7
})
const rhombus = new THREE.Mesh(rhombusGeometry, metallicWhite);
rhombus.position.set(6, 4, 3)
const rhombus2 = rhombus.clone();
rhombus2.position.set(-7, -4, 2);
scene.add(rhombus, rhombus2);

const buildMeshWithRandomPositionAndRotation = (geometry, material)=> {
  const mesh = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(170));
  mesh.position.set(x, y, z)

  const [rx, ry, rz] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(1));
  mesh.rotation.set(rx, ry, rz)

  scene.add(mesh)
}

Array(55).fill().map(() => buildMeshWithRandomPositionAndRotation(rhombusGeometry, whiteMaterial));
Array(50).fill().map(() => buildMeshWithRandomPositionAndRotation(sphereGeometry, whiteMaterial));
Array(55).fill().map(() => buildMeshWithRandomPositionAndRotation(new THREE.DodecahedronGeometry(3, 0), metallicWhite));


const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/WeaveSteel_NormalMap.jpg');
const BaseColorTexture = textureLoader.load('/WeaveSteel_Color.jpg');
const RoughnessTexture = textureLoader.load('/WeaveSteel_Roughness.jpg');
const HeightMapTexture = textureLoader.load('/WeaveSteel_HeightMap.jpg');
const AmbientOccultionTexture = textureLoader.load('/WeaveSteel_AmbientOccultion.jpg');
const MetallicTexture = textureLoader.load('/WeaveSteel_Metallic.jpg');
const texturedSphere = new THREE.MeshStandardMaterial({
  map: BaseColorTexture,
  metalness: 0.1,
  roughnessMap: RoughnessTexture,
  roughness: 0.5,
  normalMap: normalTexture,
  displacementMap: HeightMapTexture,
  displacementScale: 0.05,
  aoMap: AmbientOccultionTexture
});

const centralSphereGeometry = new THREE.SphereGeometry(4, 64, 64);
const centralSphere = new THREE.Mesh(centralSphereGeometry, texturedSphere);
centralSphere.geometry.attributes.uv2 = centralSphere.geometry.attributes.uv
scene.add(centralSphere);

const animateMeshes = [centralSphere, rhombus, rhombus2]
const animate = () => {
  requestAnimationFrame(animate);
  animateMeshes.map(mesh => mesh.rotation.y += 0.002);
  renderer.render(scene, camera);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );
animate();

const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * 0.008 + 20;
  camera.position.y = t * 0.008;
  camera.rotation.x = t * 0.00095;
}

document.body.onscroll = moveCamera;
