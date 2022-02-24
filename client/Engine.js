import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import * as Loader from "./3DLoader.js";
import { getResource } from "./essentials.js";
let scene = null, camera = null, renderer = null;

export function setup() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x59abba);
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer  = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.5;
    document.body.appendChild(renderer.domElement);

    window.onresize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    //load de l'espace 3D 
    Loader.setScene(scene);
    let cookie = localStorage.getItem("highres");
    if (cookie != null && cookie == "true")
    getResource(["Modeles", "1", "lien"]).then(data => {
        Loader.loadModel(data);
    });
    else getResource(["Modeles", "0", "lien"]).then(data => {
        Loader.loadModel(data);
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
}

export function render() {
    renderer.render(scene, camera);
}

export function getCamera() {
    return camera;
}

export function setAnimationLoop(callback) {
    renderer.setAnimationLoop(callback);
}

export function getScene() {
    return scene;
}