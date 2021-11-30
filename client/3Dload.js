

import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';
import { FirstPersonControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/FirstPersonControls.js';
//import { PointerLockControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/loaders/PointerLockControls.js';





//creation de la scene , camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x59abba);
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer  = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.5;
document.body.appendChild(renderer.domElement);


camera.position.set(0,1.8,0);
camera.lookAt(-1,1.4,0);

//camera rotation 
/*
var controls = new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.4;
controls.movementSpeed = 20;
controls.noFly = true;
controls.lookVertical = true;
controls.constrainVertical = true;
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
controls.lon = -150;
controls.lat = 120;

camera.position.set(0,1.8,0);
camera.lookAt(-1,1.4,0);
*/



//load de l'espace 3D 
const loader = new GLTFLoader();

loader.load('./map3D/map.gltf', function(gltf){
    gltf.scene.traverse(node => {
        if(node.isMesh){
            node.castShadow = true;        
            node.receiveShadow = true;
        }
    })
    scene.add(gltf.scene);
    console.log('slt');
}, undefined, function(error){
    console.error(error);
});

//load des ciseaux

var ciseaux = null;
loader.load('./map3D/ciseaux.glb', function(glb){
    console.log(glb);
    ciseaux = glb.scene;
    glb.scene.traverse(node => {
        if(node.isMesh){
            node.castShadow = true;        
            node.receiveShadow = true;
        }
    })
    glb.scene.scale.set(0.1,0.1,0.1);
    scene.add(glb.scene);
    console.log('yo');
}, undefined, function(error){
    console.error(error);
});



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

let plaqueVerre = {
    durete = 2
    //green
};
let plaqueFeuille = {
    durete = 1
    //blue
};
let plaqueFer = {
    durete = 3
    //red
};


const geometryCentre = new THREE.BoxGeometry(0.5,0.05,0.8);
const geometryGauche = new THREE.BoxGeometry(0.5,0.02,0.8);
const geometryDroit = new THREE.BoxGeometry(0.6,0.035,1);
const material = new THREE.MeshStandardMaterial({color :0x00ff00});
const cube1 = new THREE.Mesh(geometryCentre, material);
const cube2 = new THREE.Mesh(geometryDroit, material);
const cube3 = new THREE.Mesh(geometryGauche, material);
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

//x = -2.8 y = 1.3 z=0
//x = 0.8  y = 1.3  z = -3.9 
//x = 0.8 y = 1.3 z = 3.9

let last = 0;
let moveX = 0;
let moveY = 0;
let keys = {z: 0, q: 0, s: 0, d: 0};

function updateKey(code, state) {
    keys[code] = state;
    moveX = keys["d"] - keys["q"];
    moveY = keys["s"] - keys["z"];
}

window.addEventListener("keydown", ev => {
    let k = ev.key.toLowerCase();
    switch (k) {
        case "z":
        case "q":
        case "s":
        case "d":
            updateKey(ev.key, 1);
            break;
        default: break;
    }
});
window.addEventListener("keyup", ev => {
    let k = ev.key.toLowerCase();
    switch (k) {
        case "z":
        case "q":
        case "s":
        case "d":
            updateKey(ev.key, 0);
            break;
        default: break;
    }
});

let mouseDelta = {x: 0, y: 0};
let camRot = {x: 0, y: 0};
window.addEventListener("mousemove", ev => {
    mouseDelta.x += ev.movementX;
    mouseDelta.y += ev.movementY;
});

//animation camera + renderer
function render(time){



    renderer.render(scene, camera);

    let dt = (time - last)/1000;
    last = time;
    let newPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    let mx = Math.cos(camera.rotation.z)*moveX + Math.sin(camera.rotation.z)*moveY;
    let my = -Math.sin(camera.rotation.z)*moveX + Math.cos(camera.rotation.z)*moveY;
    newPos.x += mx * dt * 2;
    newPos.z += my * dt * 2;
    camera.position.set(newPos.x, newPos.y, newPos.z);

    // change camera orientation
    camRot.x += mouseDelta.x * 0.01;
    camRot.y += mouseDelta.y * 0.01;
    mouseDelta = {x: 0, y: 0};
    var lookPos = {
        x : Math.cos(camRot.x) * Math.sin(camRot.y) + camera.position.x,
        y :  Math.cos(camRot.y) + camera.position.y,
        z : Math.sin(camRot.x) * Math.sin(camRot.y) + camera.position.z
    };
    camera.lookAt(lookPos.x, lookPos.y, lookPos.z);
    if(ciseaux != null){
        ciseaux.children[0].children[1].morphTargetInfluences[1] = 1;
        ciseaux.children[0].children[0].morphTargetInfluences[1] = 1;   
        
        ciseaux.children[0].children[1].updateMorphTargets();
        ciseaux.children[0].children[0].updateMorphTargets();
        ciseaux.position.set(lookPos.x, lookPos.y, lookPos.z);
    }

    //animation du cube
    // cube1.rotation.x += 0.015;
    // cube1.rotation.y += 0.01;
    // cube2.rotation.x += 0.015;
    // cube2.rotation.y += 0.01;
    // cube3.rotation.x += 0.015;
    // cube3.rotation.y += 0.01;
}





