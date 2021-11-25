import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js';



            //creation de la scene , camera
			const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer  = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);


            //creation du cube 3D
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({color :0x00ff00});
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            //creation de la line rouge
            const material2 = new THREE.LineBasicMaterial({color : 0xFF0000});
            const points = [] ;
            points.push(new THREE.Vector3(-2,0,0));
            points.push(new THREE.Vector3(2,0,0));
            
            const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry2, material2);  
            scene.add(line);
            camera.position.z = 20;



            //creation d'un cone 
            /*const geometry4 = new THREE.ConeGeometry( 8, 20, 8 );
            const material4 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            const cone = new THREE.Mesh( geometry4, material4 );
            scene.add(cone);*/


        /*    const light = new THREE.AmbientLight(0x404040, 2); // soft white light
            scene.add(light);
*/
            //creation de texte
           /* var fontload = new THREE.FontLoader();
            fontload.load('./font/LucidaBrightRegular.ttf', function(font) {

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
            */

            //controle camera autour d'un objet
           /* const controls = new OrbitControls(camera, renderer.domElement);
             camera.position.set(0, 20, 100);
             camera.update();
*/


            //load de l'espace 3D 
/*

            const loader = new THREE.GLTFLoader();

            loader.load('./map3D/map.gltf', function(gltf){
                scene.add(gltf.scene);
            }, undefined, function(error){
                console.error(error);
            });

*/
            function animate(){
                requestAnimationFrame(animate);
                //controls.update();
                renderer.render(scene, camera);
                

               //animation du cube
                 cube.rotation.x += 0.015;
                 cube.rotation.y += 0.01;


                //amination du cone 
                cone.rotation.x += 0.01;
                cone.rotation.y += 0.01;
                cone.rotation.z += 0.01;
            }
            animate();