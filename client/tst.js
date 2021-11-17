socket = io();

function setForce(val) {
    socket.emit("custom/setForce", val);
}
let cursor = document.getElementById("range");
socket.on("custom/getAngle", val => {
    cursor.value = val;
    setForce(val);
})