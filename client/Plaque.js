import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import { loadModel } from './3DLoader.js';

export class Plaque {
    constructor(textures, proprietes) {
        this.textures = textures;
        /**@type {{temps: number, durete: number}} */
        this.proprietes = proprietes;
        this.startTemps = this.proprietes.temps;
        this.material = new THREE.MeshStandardMaterial();
        this.modele = new THREE.Mesh();
        this.modele.castShadow = true;
        this.modele.receiveShadow = true;
        this.hitbox = new THREE.Box3().setFromObject(this.modele);
        this.cut = false;
        this.forcing = false;
        this.speed = 5;
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
            model.traverse(node => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material.morphTarget = true;
                }
            });
            model.children[0].position.copy(this.modele.position);
            model.children[0].rotation.copy(this.modele.rotation);
            this.modele = model.children[0];
            this.material = this.modele.material;
            this.modele.material.morphTarget = true;
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
    }

    update(dt = 0) {
        if (this.forcing && !this.cut) {
            this.proprietes.temps -= dt;
            if (this.proprietes.temps <= 0) {
                this.cut = true;
                this.proprietes.temps = 2;
            }
        }
        if (!this.forcing && this.cut) {
            this.proprietes.temps -= dt;
            if (this.proprietes.temps <= 0) {
                this.cut = false;
                this.proprietes.temps = this.startTemps;
            }
        }
        if (this.modele.morphTargetInfluences == undefined) return;
        if (!this.cut) {
            if (this.modele.morphTargetInfluences[0] > 0)
                this.modele.morphTargetInfluences[0] += (0 - this.modele.morphTargetInfluences[0]) * dt * this.speed;
        } else {
            if (this.modele.morphTargetInfluences[0] < 1)
                this.modele.morphTargetInfluences[0] += (1 - this.modele.morphTargetInfluences[0]) * dt * this.speed;
        }
    }
}