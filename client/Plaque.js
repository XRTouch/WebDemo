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
                console.log(Ciseaux.angle);
                Ciseaux.angle = Math.max(Math.min(val - 44, 180), 0);
            });
        }
        this.cible = new THREE.Vector3();
        this.modele = new THREE.Mesh();
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

    setPosition(x, y, z) {
        this.modele.position.set(x, y, z);
        this.modele.translateY(-0.2);
    }

    setRotation(r) {
        this.modele.rotation.set(0, 1.05, 0);
    }

    load(scene) {
        const loader = new GLTFLoader();
        loader.load('./map3D/ciseaux.glb', glb => {
            console.log(glb);
            this.modele = glb.scene;
            glb.scene.traverse(node => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            })
            glb.scene.scale.set(0.1, 0.1, 0.1);
            scene.add(glb.scene);
        }, undefined, function (error) {
            console.error(error);
        });
    }

    update(dt = 0) {
        let radian = map(this.getAngle(), 0, 70, 0.43, -0.08);
        this.modele.children[0]?.children[1]?.rotation.set(-1.57, radian, 1.57);
        this.modele.children[0]?.children[0]?.rotation.set(0, 0, radian);
    }
}