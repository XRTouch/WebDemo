import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { Ciseaux } from "./Ciseaux.js";
import  { Player } from "./Player.js";
import * as engine from "./Engine.js";

engine.setup();
const player = new Player();
player.attachCamera(engine.getCamera());

//cube 
const geometryCentre = new THREE.BoxGeometry(0.5,0.05,0.8);
const geometryGauche = new THREE.BoxGeometry(0.5,0.01,0.8);
const geometryDroit = new THREE.BoxGeometry(0.5,0.03,0.8);

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

engine.getScene().add(cube1);
engine.getScene().add(cube2);
engine.getScene().add(cube3);
let cubes = [cube1, cube2, cube3];

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
ciseaux.load();

//animation camera + renderer
let last = 0;
let FPS = 60;
const FPS_COUNTER = document.getElementById("fps-counter")

engine.setAnimationLoop(render);
function render(time) {
    let dt = (time - last)/1000;
    last = time;

    if (dt < 0.5) {
        const NEWFPS = 1 / dt;
        FPS += (NEWFPS - FPS) * dt;
        FPS_COUNTER.innerHTML = "FPS: "+Math.round(FPS);
    }

    player.update(dt);
    let cisPos = player.getLookPos();
    cisPos.y -= 0.2;
    let cisRot = player.getCameraRot();
    player.update(dt);

    let pos = player.getPosition();
    cubes.forEach(cube => {
        let p = cube.position;
        let dist = distance(pos, p);
        if (dist < 1.5) {
            // mettre les ciseaux a la position / rotation pour cette plaque
            cisPos = p.clone();
            cisPos.add(new THREE.Vector3(0.32*Math.cos(-cube.rotation.y), 0, 0.32*Math.sin(-cube.rotation.y)));
            cisRot = cube.quaternion.clone()
            .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2))
            .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2));
        }
    });
    
    ciseaux.setPosition(cisPos.x, cisPos.y, cisPos.z);
    ciseaux.setRotation(cisRot);
    ciseaux.update(dt);

    engine.render();
}

function distance(p1, p2) {
    let xa = p1.x - p2.x;
    let za = p1.z - p2.z;
    return Math.sqrt(xa*xa + za*za);
}