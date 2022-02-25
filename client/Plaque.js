import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';

export class Plaque {
    constructor(textures, proprietes) {
        this.textures = textures;
        this.proprietes = proprietes;
        this.material = new THREE.MeshStandardMaterial();
        this.modele = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.03,0.8), this.material);
        this.modele.castShadow = true;
        this.modele.receiveShadow = true;
        this.hitbox = new THREE.Box3().setFromObject(this.modele);
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

    load() {
        if (this.textures.length == 0) {
            this.material.color = new THREE.Color(0xffffff);
            this.material.needsUpdate = true;
            return;
        }
        const loadertexture = new THREE.TextureLoader();
        loadertexture.load(this.textures[0], (img) => { this.material.map = img; this.material.needsUpdate = true;});
        loadertexture.load(this.textures[1], (img) => { this.material.normalMap = img; this.material.needsUpdate = true;});
        loadertexture.load(this.textures[2], (img) => { this.material.roughnessMap = img; this.material.needsUpdate = true;});
    }

    update(dt = 0) {
        
    }
}