import * as THREE from "https://cdn.skypack.dev/three@0.134.0";


			const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer  = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({color :0x00ff00});
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);


            const material2 = new THREE.LineBasicMaterial({color : 0xFF0000});
            const points = [] ;
            points.push(new THREE.Vector3(-2,0,0));
            points.push(new THREE.Vector3(2,0,0));
            
            const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry2, material2);  
            scene.add(line);
            camera.position.z = 3;


            var fontload = new THREE.FontLoader().load('./fonts/helvetiker_bold.typeface.js', function(fontload) {

                const geometry3 = new THREE.TextGeometry( 'XrTouch', {
                    font: font, 
                    size: 80,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 8,
                    bevelOffset: 0,
                    bevelSegments: 5
                } );
            } );

            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff });

            var mesh = new THREE.Mesh( geometry3, textMaterial );

            scene.add( mesh );


            function animate(){
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
                cube.rotation.x += 0.015;
                cube.rotation.y += 0.01;
            }
            animate();