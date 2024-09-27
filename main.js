const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './ghs.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		const ghost = await loadGLTF("./ghost/scene.gltf");
		ghost.scene.scale.set(0.3, 0.3, 0.3);
		ghost.scene.position.set(0, -0.2, 0);
		
		const ghostMixer = new THREE.AnimationMixer(ghost.scene);
		const ghostAction = ghostMixer.clipAction(ghost.animations[0]);
		ghostAction.play();
		// calling ghostClip and we are loading the audio from our hard disk
		const ghostAclip = await loadAudio("./sound/ghost.mp3");
		// we instantiated the THREE listener component using airListener variable
		const ghostListener = new THREE.AudioListener();
		// instantiated a speaker positional audio as ghostAudio
		const ghostAudio = new THREE.PositionalAudio(ghostListener);	
		
		
		const horse = await loadGLTF("./horse/scene.gltf");
		horse.scene.scale.set(0.4, 0.4, 0.4);
		horse.scene.position.set(0, -0.3, 0);
		
		const horseMixer = new THREE.AnimationMixer(horse.scene);
		const horseAction = horseMixer.clipAction(horse.animations[0]);
		horseAction.play();
		
		const horseAclip = await loadAudio("./sound/horse.mp3");
		const horseListener = new THREE.AudioListener();
		const horseAudio = new THREE.PositionalAudio(horseListener);	
		
		const shark = await loadGLTF("./shark/scene.gltf");
		shark.scene.scale.set(0.1, 0.1, 0.1);
		shark.scene.position.set(0, -0.3, 0);
		
		const sharkMixer = new THREE.AnimationMixer(shark.scene);
		const sharkAction = sharkMixer.clipAction(shark.animations[0]);
		sharkAction.play();
		
		const sharkAclip = await loadAudio("./sound/shark.mp3");
		const sharkListener = new THREE.AudioListener();
		const sharkAudio = new THREE.PositionalAudio(sharkListener);	
		
		const ghostAnchor = mindarThree.addAnchor(0);
		ghostAnchor.group.add(ghost.scene);
		// added listener to the camera
		camera.add(ghostListener);
		// we set the referal distance from which the audio should fade out
		ghostAudio.setRefDistance(100);
		// set the buffer of audio to stream
		ghostAudio.setBuffer(ghostAclip);
		// we sset the audio to loop
		ghostAudio.setLoop(true);
		// we added the audio to the anchor of ghost which will be activated on seeing  the ghost image
		ghostAnchor.group.add(ghostAudio)
		
		// make ghost audio play only when the target of ghost image is detected
		ghostAnchor.onTargetFound = () => {
			ghostAudio.play();
		}
		// make ghost audio pause then the target image is lost in the camera
		ghostAnchor.onTargetLost = () => {
			ghostAudio.pause();
		}
		
		
		const horseAnchor = mindarThree.addAnchor(1);
		horseAnchor.group.add(horse.scene);
		
		camera.add(horseListener);
		horseAudio.setRefDistance(100);
		horseAudio.setBuffer(horseAclip);
		horseAudio.setLoop(true);
		horseAnchor.group.add(horseAudio)
		horseAnchor.onTargetFound = () => {
			horseAudio.play();
		}
		horseAnchor.onTargetLost = () => {
			horseAudio.pause();
		}
		
		
		const sharkAnchor = mindarThree.addAnchor(2);
		sharkAnchor.group.add(shark.scene);
		
		camera.add(sharkListener);
		sharkAudio.setRefDistance(100);
		sharkAudio.setBuffer(sharkAclip);
		sharkAudio.setLoop(true);
		sharkAnchor.group.add(sharkAudio)
		sharkAnchor.onTargetFound = () => {
			sharkAudio.play();
		}
		sharkAnchor.onTargetLost = () => {
			sharkAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			ghostMixer.update(delta);
			horseMixer.update(delta);
			sharkMixer.update(delta);
			shark.scene.rotation.set(0, shark.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});
