import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import * as Loader from './3DLoader.js';

export class Ciseaux {
    /** Socket de connection entre les ciseaux et le serveur */
    static socket = null;
    /**@type {number} Angle des ciseaux */
    static angle = 0;

    /**
     * Initialise les ciseaux
     */
    constructor() {
        if (Ciseaux.socket == null) {
            Ciseaux.socket = io();
            Ciseaux.socket.on("custom/getAngle", val => {
                Ciseaux.angle = Math.max(Math.min(val - 44, 180), 0);
            });
        }
        this.cible = new THREE.Vector3();
        this.modele = new THREE.Mesh();
        this.posTarget = new THREE.Vector3();
        this.rotTarget = new THREE.Quaternion();
        this.animSpeed = 4;
    }

    /**
     * Change l'angle des ciseaux (en degres, entre 0 et 70)
     * @param {number} angle nouvel angle des ciseaux (0-70)
     */
    setAngle(angle) {
        socket.emit("custom/setAngle", angle);
    }

    /**
     * Retourne l'angle des ciseaux
     * @returns angle des ciseaux en degres
     */
    getAngle() {
        return Ciseaux.angle;
    }

    /**
     * Change la position des ciseaux
     * @param {number} x position x
     * @param {number} y position y
     * @param {number} z position z
     */
    setPosition(x, y, z) {
        this.posTarget.set(x, y, z);
    }

    /**
     * Change la rotation des ciseaux
     * @param {number} rot rotation
     */
    setRotation(rot) {
        this.rotTarget.copy(rot);
    }

    /**
     * Charge le modele 3D des ciseaux dans la scene
     */
    load() {
        Loader.loadModel("./map3D/ciseaux.glb").then(model => {
            this.modele = model;
            model.scale.set(0.05, 0.05, 0.05);
        });
    }

    /**
     * Actualise l'etat des ciseaux
     */
    update(dt = 0) {
        /*
        this.modele.position.set(
            this.modele.position.x + (this.posTarget.x - this.modele.position.x) * dt,
            1.3,
            this.modele.position.z + (this.posTarget.z - this.modele.position.z) * dt
        );
        this.modele.rotation.set(
            this.modele.rotation.x + (this.rotTarget.x - this.modele.rotation.x) * dt,
            this.modele.rotation.y + (this.rotTarget.y - this.modele.rotation.y) * dt,
            this.modele.rotation.z + (this.rotTarget.z - this.modele.rotation.z) * dt
        );
        */
        this.modele.position.copy(this.posTarget);
        this.modele.quaternion.copy(this.rotTarget.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.45)));

        let radian = map(this.getAngle(), 0, 70, 0.43, -0.08);
        this.modele.children[0]?.children[1]?.rotation.set(-1.57, radian, 1.57);
        this.modele.children[0]?.children[0]?.rotation.set(0, 0, radian);
    }
}