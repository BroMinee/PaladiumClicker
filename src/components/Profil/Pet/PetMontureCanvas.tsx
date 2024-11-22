'use client';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from "@react-three/fiber";
import { Button } from "@/components/ui/button.tsx";
import {  GLTF, GLTFLoader } from "three-stdlib";
import { ModelName } from "@/types";



export function PetCanvas({ modelName, monture }: { modelName: ModelName, monture?: boolean }) {
  // noinspection TypeScriptValidateTypes
  const myModel: GLTF = useLoader(GLTFLoader, `/Model3D/${modelName}.gltf`);
  const [mixer, setMixer] = useState<any>(null);
  const [actions, setActions] = useState<any>({});
  const [currentAction, setCurrentAction] = useState<any>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<string>('');


  useEffect(() => {
    // Set up animations if available
    if (myModel.animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(myModel.scene);
      setMixer(newMixer);

      myModel.scene.traverse((child) => {
        if (child instanceof Mesh) {
          // noinspection TypeScriptUnresolvedReference
          child.material = new THREE.MeshBasicMaterial({
            map: child.material.map, // Use existing texture map
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

      // Set the first animation as default
      if (myModel.animations.length > 0) {
        console.log(myModel.animations);
        setSelectedAnimation(myModel.animations[0].name);
        setCurrentAction(newActions[myModel.animations[0].name]);
        newActions[myModel.animations[0].name].play();
      }
    }
  }, [myModel]);

  // Update the animation time and mixer
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



  return (
    <div className="flex flex-col gap-2 items-center justify-center mt-5">
      <span style={{ fontFamily: "minecraft" }} className="text-primary">Pet name</span>
      <span style={{ fontFamily: "minecraft" }} className="text-primary">Pet Level</span>
      <span style={{ fontFamily: "minecraft" }} className="text-primary">Pet Xp</span>
      <Canvas style={{ height: '500px', width: '100%' }}>
        <primitive object={myModel.scene} rotation={[0, Math.PI * 3 / 4, 0]} scale={monture ? [1, 1, 1] : [2, 2, 2]}/>
        <OrbitControls enableDamping={true} target={myModel.scene.position}/>
      </Canvas>
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
    </div>
  );
}
