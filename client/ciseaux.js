//import * as engine from './Engine.js';
import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';
import * as Loader from './3DLoader.js';
import { getResource } from './essentials.js';
import { map } from "./essentials.js";

export class Ciseaux {
    /** Socket de connection entre les ciseaux et le serveur */
    static socket = null;
    /**@type {number} Angle des ciseaux */
    static angle = 0;
    static movements = [];

    /**
     * Initialise les ciseaux
     */
    constructor() {
        this.cible = new THREE.Vector3();
        this.modele = new THREE.Mesh();
        this.posTarget = new THREE.Vector3();
        this.rotTarget = new THREE.Quaternion();
        this.animSpeed = 4;
        this.locked = false;
        this.enabled = false;
        this.time = 0;
    }

    static updateMovement(val) {
        // TODO: noise dans les valeurs de l'accelerometre (filtre?)
        // + faire en sorte de detecter le mouvement arriere - avant en fonction de la diff de valeur dans le temps
        Ciseaux.movements.push(val);
        if (Ciseaux.movements.length > 50) Ciseaux.movements.shift();

        let moy = 0;
        let max = 0;
        let min = 0;
        for (let i = 0; i < Ciseaux.movements.length; i++) {
            moy += Ciseaux.movements[i];
            if (Ciseaux.movements[i] > max) max = Ciseaux.movements[i];
            if (Ciseaux.movements[i] < min) min = Ciseaux.movements[i];
        }
        moy /= Ciseaux.movements.length;
        console.log(Ciseaux.movements);

        console.log("diff: "+ (max - min));
    }

    /**
     * Change l'angle des ciseaux (en degres, entre 0 et 70)
     * @param {number} angle nouvel angle des ciseaux (0-70)
     */
    setAngle(angle) {
        this.enabled = true;
        Ciseaux.socket.emit("custom/setAngle", angle);
    }

    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        Ciseaux.socket.emit("custom/disable");
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

    getPosition() {
        return this.modele.position.clone();
    }

    getRotation() {
        return this.modele.rotation.clone();
    }

    /**
     * Charge le modele 3D des ciseaux dans la scene
     */
    load() {
        const promise = new Promise((resolve, reject) => {
            getResource(["Modeles", "2", "lien"]).then(data => {
                Loader.loadModel(data).then(model => {
                    this.modele = model;
                    model.scale.set(0.05, 0.05, 0.05);
                    resolve();
                });
            });
        });
        return promise;
    }

    setLocked(state) {
        this.locked = state;
    }

    /**
     * Actualise l'etat des ciseaux
     */
    update(dt = 0) {
        this.time += dt;
        this.modele.position.copy(this.posTarget);
        this.modele.quaternion.copy(this.rotTarget.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.45)));

        if (this.modele.children.length == 0) return;
        let radian = map(this.getAngle(), 0, 70, 0.43, -0.08);
        this.modele.children[0].children[1].rotation.set(-1.57, radian, 1.57);
        this.modele.children[0].children[0].rotation.set(0, 0, radian);
    }
}