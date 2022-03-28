import { Ciseaux } from "./Ciseaux.js";

export function map(val, in_min, in_max, out_min, out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

export function init() {
    if (Ciseaux.socket == null) {
        Ciseaux.socket = io();
        Ciseaux.socket.on("custom/getAngle", val => {
            Ciseaux.angle = Math.max(Math.min(val - 3, 180), 0);
        });
        Ciseaux.socket.on("custom/getMovement", Ciseaux.updateMovement);
    }
}

let ID_COUNTER = 1;
export function getResource(path) {
    return new Promise((resolve, reject) => {
        if (Ciseaux.socket == null) init();
        const curID = ID_COUNTER++;
        Ciseaux.socket.emit("custom/getResource", {path: path, id: curID});
        Ciseaux.socket.on("custom/setResource", data => {
            if (data.id == curID) resolve(data.data);
        });
    });
}