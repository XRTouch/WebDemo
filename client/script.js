import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { Ciseaux } from "./Ciseaux.js";
import * as Loader from "./3DLoader.js";
import  { Player } from "./Player.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x59abba);
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer  = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.5;
document.body.appendChild(renderer.domElement);

camera.position.set(0,1.8,0);
camera.lookAt(-1,1.4,0);

const player = new Player();
player.attachCamera(camera);

//load de l'espace 3D 
Loader.setScene(scene);
Loader.loadModel("./map3D/map.gltf");

//light
const yo = new THREE.AmbientLight(0x404040, 5); // soft white light
scene.add(yo);
var light = new THREE.PointLight(0xffffff, 2.5, 100);
light.castShadow = true;
light.position.set(0, 5, 0);
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);
renderer.setAnimationLoop(render);

//cube 
const geometryCentre = new THREE.BoxGeometry(0.5,0.05,0.8);
const geometryGauche = new THREE.BoxGeometry(0.5,0.02,0.8);
const geometryDroit = new THREE.BoxGeometry(0.6,0.035,1);

let centre = new THREE.MeshStandardMaterial();
let droit = new THREE.MeshStandardMaterial();
let gauche = new THREE.MeshStandardMaterial();

centre.propriete = {  durete : 3}; //fer
const loadertexture = new THREE.TextureLoader();
loadertexture.load('texture/metal/diff.jpg', function(img){ centre.map = img; centre.needsUpdate = true;});
loadertexture.load('texture/metal/nor.exr', function(img){ centre.normalMap = img; centre.needsUpdate = true;});
loadertexture.load('texture/metal/rough.jpg', function(img){ centre.roughnessMap = img; centre.needsUpdate = true;});

droit.propriete = {  durete : 2};//bois

loadertexture.load('texture/wood/diff.jpg', function(img){ droit.map = img; droit.needsUpdate = true;});
loadertexture.load('texture/wood/nor.exr', function(img){ droit.normalMap = img; droit.needsUpdate = true;});
loadertexture.load('texture/wood/rough.jpg', function(img){ droit.roughnessMap = img; droit.needsUpdate = true;});

gauche.propriete = {  durete : 1};//papier

const cube1 = new THREE.Mesh(geometryCentre, centre);//fer
const cube2 = new THREE.Mesh(geometryDroit, droit);//bois
const cube3 = new THREE.Mesh(geometryGauche, gauche);//papier

scene.add(cube1);
scene.add(cube2);
scene.add(cube3);

cube1.position.set(-2.8,1.3,0);
cube2.position.set(-0.8,1.3,-3.9);
cube2.rotation.set(0,-0.78,0);
cube3.position.set(-0.8,1.3,3.9);
cube3.rotation.set(0,0.78,0);

cube1.castShadow = true;
cube2.castShadow = true;
cube3.castShadow = true;

//hitbox des plaque
let box1 = new THREE.Box3().setFromObject(cube1); //fer/centre   
let box2 = new THREE.Box3().setFromObject(cube2); //bois/droit
let box3 = new THREE.Box3().setFromObject(cube3); //papier/gauche

//creer les ciseaux IRL 
let ciseaux = new Ciseaux();
ciseaux.load(scene);

//animation camera + renderer
let last = 0;
let FPS = 60;
const FPS_COUNTER = document.getElementById("fps-counter")
function render(time) {
    let dt = (time - last)/1000;
    last = time;

    const NEWFPS = 1 / dt;
    FPS += (NEWFPS - FPS) * dt;
    FPS_COUNTER.innerHTML = "FPS: "+Math.round(FPS);

    player.update(dt);
    let lookPos = player.getLookPos();
    let camRot = player.getCameraRot();
    ciseaux.setPosition(lookPos.x, lookPos.y, lookPos.z);
    ciseaux.setRotation(camRot.z, camRot.y, camRot.x);
    ciseaux.modele.translateY(-0.2);
    ciseaux.update(dt);
    player.update(dt);
    
    renderer.render(scene, camera);
}