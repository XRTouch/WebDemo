import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { loadModel } from './3DLoader.js';

export class Plaque {
    constructor(textures, proprietes) {
        this.textures = textures;
        this.proprietes = proprietes;
        this.material = new THREE.MeshStandardMaterial();
        this.modele = new THREE.Mesh();
        this.modele.castShadow = true;
        this.modele.receiveShadow = true;
        this.hitbox = new THREE.Box3().setFromObject(this.modele);
        this.cut = false;
        this.forcing = false;
    }

    setForcing(bool) {
        this.forcing = bool;
    }

    setPosition(x, y, z) {
        this.modele.position.set(x, y, z);
    }

    setRotation(x, y, z) {
        this.modele.rotation.set(x, y, z);
    }

    getPosition() {
        return this.modele.position.clone();
    }

    getRotation() {
        return this.modele.rotation.clone();
    }

    load(path) {
        loadModel(path).then(model => {
            model.children[0].position.copy(this.modele.position);
            model.children[0].rotation.copy(this.modele.rotation);
            this.modele = model.children[0];
            this.modele.material = this.material;
        });
        if (this.textures.length == 0) {
            this.material.color = new THREE.Color(0xffffff);
            this.material.needsUpdate = true;
            return;
        }
        const loadertexture = new THREE.TextureLoader();
        loadertexture.load(this.textures[0], (img) => { this.material.map = img; this.material.needsUpdate = true;});
        loadertexture.load(this.textures[1], (img) => { this.material.normalMap = img; this.material.needsUpdate = true;});
        loadertexture.load(this.textures[2], (img) => { this.material.roughnessMap = img; this.material.needsUpdate = true;});

        // TODO
        // faire un compteur si forcing est a true pour casser la plaque (en fonction de temps dans this.proprietes)
        // et modifier le this.model.morthTargetInfluence[0] pour la casser
    }

    update(dt = 0) {
        
    }
}