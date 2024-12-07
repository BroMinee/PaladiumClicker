'use client';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';
import { OrbitControls, Text } from '@react-three/drei';
import { Canvas, useLoader } from "@react-three/fiber";
import { Button } from "@/components/ui/button.tsx";
import { GLTF, GLTFLoader } from "three-stdlib";
import { ModelName } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import {
  formatPrice,
  montureGetCoef,
  montureGetLevelFromXp,
  mountureGetNeededXpForLevel,
  petGetCoef,
  petGetLevelFromXp,
  petGetNeededXpForLevel
} from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";


function convertMontureTypeIdToModelName(montureTypeId: number): ModelName {
  switch (montureTypeId) {
    case 1:
      return "dancarok";
    case 2:
      return "ravirok";
    case 3:
      return "tedarok";
    default:
      return "dancarok";
  }
}

function convertPetSkinToModelName(petSkin: string): ModelName {
  switch (petSkin) {
    case "arty":
      return "arty";
    case "cat":
      return "cat";
    case "dog":
      return "dog";
    case "dragon":
      return "dragon";
    case "feng_uang":
      return "feng_uang";
    case "kapio_koi":
      return "kapio_koi"
    case "pet_blobfish":
      return "pet_blobfish"
    case "pet_mini_golem":
      return "pet_mini_golem"
    case "pet_ufo":
      return "pet_ufo"
    case "pet_zombie_hand":
      return "pet_zombie_hand"
    case "rabbit":
      return "rabbit"
    case "pet_ender_dragon":
      return "pet_ender_dragon"
    case "pet_reindeer":
      return "pet_reindeer"
    default:
      return "arty";
  }
}

export function PetCanvas({ monture = false }: { monture?: boolean }) {
  const { data: playerInfo } = usePlayerInfoStore();




  let modelName: ModelName = "arty";
  let petName: string = "";
  let petLevel: number = 0;
  let petXp: number = 0;
  let petCoef: number = 0;
  let xpNeeded: number = 0;

  if (playerInfo && monture && playerInfo.mount) {
    modelName = convertMontureTypeIdToModelName(playerInfo.mount.mountType);
    petName = playerInfo.mount.name;
    petXp = playerInfo.mount.xp;
    petLevel = montureGetLevelFromXp(playerInfo.mount.xp);
    petCoef = montureGetCoef(playerInfo.mount.xp, petLevel);
    xpNeeded = mountureGetNeededXpForLevel(petLevel);
  } else if (playerInfo && !monture && playerInfo.pet) {
    modelName = convertPetSkinToModelName(playerInfo.pet.currentSkin);
    petName = playerInfo.pet.currentSkin.replaceAll("pet_", "").split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase());
    petLevel = petGetLevelFromXp(playerInfo.pet.experience);
    petXp = petLevel === 100 ? 100 : playerInfo.pet.experience - petGetNeededXpForLevel(petLevel - 1);

    xpNeeded = petLevel === 100 ? 100 : petGetNeededXpForLevel(petLevel) - petGetNeededXpForLevel(petLevel - 1);
    petCoef = petGetCoef(petXp, xpNeeded);
  }


  // noinspection TypeScriptValidateTypes
  const myModel: GLTF = useLoader(GLTFLoader, `/Model3D/${modelName}.gltf`);
  const [mixer, setMixer] = useState<any>(null);
  const [actions, setActions] = useState<any>({});
  const [currentAction, setCurrentAction] = useState<any>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<string>('');
  const [arAvailable, setArAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (myModel.animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(myModel.scene);
      setMixer(newMixer);

      myModel.scene.traverse((child) => {
        if (child instanceof Mesh) {
          // noinspection TypeScriptUnresolvedReference
          child.material = new THREE.MeshBasicMaterial({
            map: child.material.map,
            transparent: true,
            side: THREE.DoubleSide,
          });
        }
      });

      const newActions = myModel.animations.reduce((acc: any, anim) => {
        const action = newMixer.clipAction(anim);
        acc[anim.name] = action;
        return acc;
      }, {});

      setActions(newActions);

      if (myModel.animations.length > 0) {
        setSelectedAnimation(myModel.animations[0].name);
        setCurrentAction(newActions[myModel.animations[0].name]);
        newActions[myModel.animations[0].name].play();
      }
    }
  }, [myModel]);

  useEffect(() => {
    if (mixer) {
      const clock = new THREE.Clock();

      const animate = () => {
        if (mixer) {
          mixer.update(clock.getDelta());
        }

        requestAnimationFrame(animate);
      };

      animate();
    }
  }, [mixer]);

  const handleAnimationChange = (name: string) => {
    if (actions[name]) {
      if (currentAction) {
        currentAction.stop();
      }
      const newAction = actions[name];
      newAction.reset().play();
      setCurrentAction(newAction);
      setSelectedAnimation(name);
    }
  };

  useEffect(() => {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setArAvailable(supported);
      });
    }
  }, []);

  const launchAR = () => {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
          console.log('AR is supported on this device!');
          const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.xr.enabled = true;

          document.body.appendChild(renderer.domElement);

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);


          if (monture)
            myModel.scene.scale.set(0.1, 0.1, 0.1);
          else
            myModel.scene.scale.set(0.2, 0.2, 0.2)

          myModel.scene.position.set(0, 0, -0.5); // Place à 50 cm devant la caméra
          scene.add(myModel.scene);


          const arMixer = new THREE.AnimationMixer(myModel.scene);
          if (myModel.animations.length > 1) {
            const animationClip = myModel.animations[0];
            const arAction = arMixer.clipAction(animationClip);
            arAction.play();
          }


          renderer.xr.setReferenceSpaceType('local');

          // renderer.xr.addEventListener('sessionstart', () => {
          // });

          renderer.xr.addEventListener('sessionend', () => {
            document.body.removeChild(renderer.domElement);
          });

          const animate = () => {
            renderer.setAnimationLoop(() => {
              renderer.render(scene, camera);
            });
          };

          if (navigator.xr && "requestSession" in navigator.xr) {
            navigator.xr.requestSession('immersive-ar', {}).then((session) => {
              renderer.xr.setSession(session);
              animate();
            });
          }
        } else {
          alert('AR not supported on this device.');
        }
      });
    } else {
      alert('WebXR is not available on your browser.');
    }
  };


  if (!playerInfo)
    return null;

  if (monture && !playerInfo.mount)
    return <DisplayEmptyCanvas text="Aucune monture équipée"/>;

  if (!monture && !playerInfo.pet)
    return <DisplayEmptyCanvas text="Aucun pet équipé"/>;

  return (
    <div className="flex flex-col mt-5">
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="font-mc text-primary">{petName}<span/>

        </span>
        <span className="font-mc text-primary">Level : <span
          className="text-primary-foreground">{petLevel} ({Math.round(petCoef * 100)}%)</span>
        </span>
        <span
          className="font-mc text-primary">Xp : <span
          className="text-primary-foreground">{formatPrice(Math.round(petXp))} / {formatPrice(Math.round(xpNeeded))}</span>
        </span>
        <Button onClick={launchAR}
                disabled={!arAvailable}
                className={cn("font-mc", !arAvailable && "py-6")}>
          {arAvailable ? "Voir en AR" : <span>AR indisponible<br/>Sur votre appareil</span>}
        </Button>
        <DisplayAnimationButtons myModel={myModel} handleAnimationChange={handleAnimationChange}
                                 selectedAnimation={selectedAnimation} className="flex lg:hidden"/>
      </div>


      <Canvas style={{ height: '500px', width: '100%' }}>
        <primitive object={myModel.scene} rotation={[0, Math.PI * 3 / 4, 0]} scale={monture ? [1, 1, 1] : [2, 2, 2]}/>
        <OrbitControls enableDamping={true} target={myModel.scene.position}/>
      </Canvas>

      <DisplayAnimationButtons myModel={myModel} handleAnimationChange={handleAnimationChange}
                               selectedAnimation={selectedAnimation} className="hidden lg:flex"/>

    </div>
  );
}

function DisplayAnimationButtons({ myModel, handleAnimationChange, selectedAnimation, className }: {
  myModel: GLTF,
  handleAnimationChange: (name: string) => void,
  selectedAnimation: string,
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap flex-row gap-2 items-center justify-center", className)}>
      {myModel.animations.map((animation) => (
        <Button
          key={animation.name}
          disabled={selectedAnimation === animation.name}
          onClick={() => handleAnimationChange(animation.name)}
          className="font-mc"
        >
          {animation.name.split(".")[animation.name.split(".").length - 1]}
        </Button>
      ))}
    </div>
  )
}

function DisplayEmptyCanvas({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center mt-5">
      <Canvas style={{ height: '500px', width: '100%' }}>
        <Text fontSize={0.75} color="#DE5000">{text}</Text>
        <OrbitControls enableDamping={true}/>
      </Canvas>
    </div>
  )
}