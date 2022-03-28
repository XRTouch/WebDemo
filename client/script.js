import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { Ciseaux } from "./Ciseaux.js";
import  { Player } from "./Player.js";
import { Plaque } from "./Plaque.js";
import { getResource } from "./essentials.js";
import * as engine from "./Engine.js";
import { loadModel } from "./3DLoader.js";


engine.setup();
const player = new Player();
player.attachCamera(engine.getCamera());

let cubes = [];
let loadPlaque = (plaque) => {
    const model = new Plaque(plaque.textures, plaque.proprietes);
    model.load(plaque.lien);
    model.setPosition(plaque.position.x, plaque.position.y, plaque.position.z);
    model.setRotation(plaque.rotation.x, plaque.rotation.y, plaque.rotation.z);
    cubes.push(model);
};
getResource(["Plaques", "0"]).then(loadPlaque);
getResource(["Plaques", "1"]).then(loadPlaque);
getResource(["Plaques", "2"]).then(loadPlaque);

//creer les ciseaux IRL 
let ciseaux = new Ciseaux();
ciseaux.load();
document.ciseaux = ciseaux;

//animation camera + renderer
let last = 0;
let FPS = 60;
const FPS_COUNTER = document.getElementById("fps-counter")

engine.setAnimationLoop((time) => {
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
    let plaque = null
    ciseaux.setLocked(false);
    cubes.forEach(cube => {
        let p = cube.getPosition();
        let r = cube.getRotation();
        let dist = distance(pos, p);
        if (dist < 1.5) {
            // mettre les ciseaux a la position / rotation pour cette plaque
            cisPos = p;
            let dist = (Ciseaux.askForCube)? 0.32 : 0.6;
            cisPos.add(new THREE.Vector3(dist*Math.cos(-r.y), 0, dist*Math.sin(-r.y)));
            cisRot = cube.modele.quaternion.clone()
            .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2))
            .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2));
            plaque = cube;
            ciseaux.setLocked(true);
        }
    });
    ciseaux.setPosition(cisPos.x, cisPos.y, cisPos.z);
    ciseaux.setRotation(cisRot);
    ciseaux.update(dt);

    engine.render();

    if (ciseaux.locked && Ciseaux.askForCube) {
        if (ciseaux.getAngle() < 30) {
            if (ciseaux.getAngle() < 30-plaque.proprietes.durete) // l'utilsateur force sur les ciseaux 
                plaque.setForcing(true);
            else plaque.setForcing(false);
            if (!plaque.cut)
                ciseaux.setAngle(30);
            else ciseaux.disable();
        }
        else ciseaux.disable();
    } else ciseaux.disable();

    cubes.forEach(plaque => {
        plaque.update(dt);
        plaque.setForcing(false);
    });
});

function distance(p1, p2) {
    let xa = p1.x - p2.x;
    let za = p1.z - p2.z;
    return Math.sqrt(xa*xa + za*za);
}