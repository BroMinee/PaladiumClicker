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


  const myModel: GLTF = useLoader(GLTFLoader, `/Model3D/${modelName}.gltf`);
  const [mixer, setMixer] = useState<any>(null);
  const [actions, setActions] = useState<any>({});
  const [currentAction, setCurrentAction] = useState<any>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<string>('');
  // const [isARSupported, setIsARSupported] = useState<boolean>(false);
  // const [isARMode, setIsARMode] = useState<boolean>(false);

  // useEffect(() => {
  //   if (navigator.xr) {
  //     navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
  //       setIsARSupported(supported);
  //     });
  //   }
  // }, []);

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

  // const handleARButtonClick = () => {
  //   setIsARMode(true);
  // };

  if (!playerInfo)
    return null;

  if (monture && !playerInfo.mount)
    return <DisplayEmptyCanvas text="Aucune monture équipée"/>;

  if (!monture && !playerInfo.pet)
    return <DisplayEmptyCanvas text="Aucun pet équipé"/>;

  return (
    <div className="flex flex-col gap-2 items-center justify-center mt-5">
      {/*<Button onClick={handleARButtonClick} disabled={!(isARSupported && !isARMode)}>*/}
      {/*  {(isARSupported && !isARMode) ? "Activer le mode AR" : "Mode AR non supporté"}*/}
      {/*</Button>*/}
      <span style={{ fontFamily: "minecraft" }} className="text-primary">{petName}</span>
      <span style={{ fontFamily: "minecraft" }}
            className="text-primary">Level : {petLevel} ({Math.round(petCoef * 100)}%)</span>
      <span style={{ fontFamily: "minecraft" }}
            className="text-primary">Xp : {formatPrice(Math.round(petXp))} / {formatPrice(Math.round(xpNeeded))}</span>
      {/*{isARMode ? (*/}
      {/*  <Canvas style={{ height: '500px', width: '100%' }}>*/}
      {/*    <primitive object={myModel.scene} rotation={[0, Math.PI * 3 / 4, 0]} scale={monture ? [1, 1, 1] : [2, 2, 2]}/>*/}
      {/*  </Canvas>*/}
      {/*) : (*/}
      <Canvas style={{ height: '500px', width: '100%' }}>
        <primitive object={myModel.scene} rotation={[0, Math.PI * 3 / 4, 0]} scale={monture ? [1, 1, 1] : [2, 2, 2]}/>
        <OrbitControls enableDamping={true} target={myModel.scene.position}/>
      </Canvas>
      {/*)}*/}
      <div className="flex flex-row gap-2 items-center justify-center">
        {myModel.animations.map((animation) => (
          <Button
            key={animation.name}
            disabled={selectedAnimation === animation.name}
            onClick={() => handleAnimationChange(animation.name)}
            style={{ fontFamily: "Minecraft" }}
          >
            {animation.name.split(".")[animation.name.split(".").length - 1]}
          </Button>
        ))}
      </div>
      {/**/}
      {/*{isARMode && <ARButton sessionInit={{ optionalFeatures: ['local-floor', 'bounded-floor'] }}/>}*/}
    </div>
  );
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