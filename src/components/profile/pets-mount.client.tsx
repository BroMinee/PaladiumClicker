"use client";

import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Mesh } from "three";
import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Button } from "@/components/ui/button";
import { GLTF, GLTFLoader } from "three-stdlib";
import { ModelName } from "@/types";
import { Card } from "@/components/ui/card";

import {
  convertMontureTypeIdToModelName,
  convertPetSkinToModelName,
  formatPrice,
  montureGetCoef,
  montureGetLevelFromXp,
  mountureGetNeededXpForLevel,
  petGetCoef,
  petGetLevelFromXp,
  petGetNeededXpForLevel
} from "@/lib/misc";
import { cn } from "@/lib/utils";

/**
 * Display the player pet and mount
 */
export function PetMountSection() {
  const { data: playerInfo } = usePlayerInfoStore();
  if (!playerInfo) {
    return <LoadingSpinner />;
  }
  return (<div className="flex flex-row w-full gap-4">
    <div className="flex-1">
      <PetOrMountCanvas mount={false}/>
    </div>
    <div className="flex-1">
      <PetOrMountCanvas mount={true}/>
    </div>
  </div>);
}

/**
 * Render the player pet or mount
 * @param mount - boolean, true if we are displaying a mount otherwise it's a pet
 */
export function PetOrMountCanvas({ mount = false }: { mount?: boolean }) {
  const { data: playerInfo } = usePlayerInfoStore();

  let modelName: ModelName = "arty";
  let petName: string = "";
  let petLevel: number = 0;
  let petXp: number = 0;
  let petCoef: number = 0;
  let xpNeeded: number = 0;

  if (playerInfo && mount && playerInfo.mount) {
    modelName = convertMontureTypeIdToModelName(playerInfo.mount.mountType);
    petName = playerInfo.mount.name;
    petXp = playerInfo.mount.xp;
    petLevel = montureGetLevelFromXp(playerInfo.mount.xp);
    petCoef = montureGetCoef(playerInfo.mount.xp, petLevel);
    xpNeeded = mountureGetNeededXpForLevel(petLevel);
  } else if (playerInfo && !mount && playerInfo.pet) {
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
  const [selectedAnimation, setSelectedAnimation] = useState<string>("");
  const [arAvailable, setArAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (myModel.animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(myModel.scene);
      setMixer(newMixer);

      myModel.scene.traverse((child) => {
        if (child instanceof Mesh) {
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
      navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
        setArAvailable(supported);
      });
    }
  }, []);

  const launchAR = () => {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
        if (supported) {
          console.log("AR is supported on this device!");
          const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.xr.enabled = true;

          document.body.appendChild(renderer.domElement);

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

          if (mount) {
            myModel.scene.scale.set(0.1, 0.1, 0.1);
          } else {
            myModel.scene.scale.set(0.2, 0.2, 0.2);
          }

          myModel.scene.position.set(0, 0, -0.5); // Place à 50 cm devant la caméra
          scene.add(myModel.scene);

          const arMixer = new THREE.AnimationMixer(myModel.scene);
          if (myModel.animations.length > 1) {
            const animationClip = myModel.animations[0];
            const arAction = arMixer.clipAction(animationClip);
            arAction.play();
          }

          renderer.xr.setReferenceSpaceType("local");

          renderer.xr.addEventListener("sessionend", () => {
            document.body.removeChild(renderer.domElement);
          });

          const animate = () => {
            renderer.setAnimationLoop(() => {
              renderer.render(scene, camera);
            });
          };

          if (navigator.xr && "requestSession" in navigator.xr) {
            navigator.xr.requestSession("immersive-ar", {}).then((session) => {
              renderer.xr.setSession(session);
              animate();
            });
          }
        } else {
          alert("AR not supported on this device.");
        }
      });
    } else {
      alert("WebXR is not available on your browser.");
    }
  };

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  if (mount && !playerInfo.mount) {
    return <DisplayEmptyCanvas text="Aucune monture équipée"/>;
  }

  if (!mount && !playerInfo.pet) {
    return <DisplayEmptyCanvas text="Aucun pet équipé"/>;
  }

  return (
    <Card className="flex flex-col overflow-hidden border-secondary bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 h-full mt-5">
      <div className="relative w-full h-[400px] bg-gradient-to-b from-background/30 to-background/90 group rounded-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div>
            <h3 className="font-mc text-2xl font-bold text-primary tracking-wide">{petName}</h3>
            <div className="h-1 w-full bg-primary rounded-full mt-1"/>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-none items-end">
          <div className="flex flex-col gap-1 text-sm font-medium text-muted-foreground bg-background/40 backdrop-blur-md p-2 rounded-md border border-white/5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Niveau</span>
              <span className="text-foreground font-bold font-mono">{petLevel} <span className="text-xs text-primary font-normal">({Math.round(petCoef * 100)}%)</span></span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">XP</span>
              <span className="text-foreground font-mono text-xs">{formatPrice(Math.round(petXp))} / {formatPrice(Math.round(xpNeeded))}</span>
            </div>
          </div>
        </div>

        <div className={cn("absolute top-4 left-1/2 -translate-x-1/2 z-10", arAvailable === false && "hidden")}>
          <Button onClick={launchAR}
            disabled={!arAvailable}
            size="icon"
            variant="outline"
            className={cn("h-10 w-10 rounded-full backdrop-blur-md bg-background/50 border-white/10 hover:bg-primary hover:text-primary-foreground transition-colors", !arAvailable && "opacity-50 cursor-not-allowed")}
            title={arAvailable ? "Voir en Réalité Augmentée" : "AR indisponible sur cet appareil"}
          >
            <span className="font-bold text-xs">AR</span>
          </Button>
        </div>

        <Canvas style={{ height: "100%", width: "100%" }} className="cursor-move">
          <primitive object={myModel.scene} rotation={[0, Math.PI * 3 / 4, 0]} scale={mount ? [1, 1, 1] : [2, 2, 2]} position={[0, -1, 0]} />
          <OrbitControls enableDamping={true} target={[0, 0, 0]} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <div className="p-4 bg-card/80 border-t border-secondary/50 flex flex-col gap-3">
        <p className="text-xs text-center text-muted-foreground uppercase tracking-widest font-semibold">Animations</p>
        <DisplayAnimationButtons myModel={myModel} handleAnimationChange={handleAnimationChange}
          selectedAnimation={selectedAnimation} className="flex flex-wrap justify-center gap-2"/>
      </div>
    </Card>
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
          className="font-mc text-xs h-8 px-3"
          variant={selectedAnimation === animation.name ? "default" : "secondary"}
          size="sm"
        >
          {animation.name.split(".")[animation.name.split(".").length - 1]}
        </Button>
      ))}
    </div>
  );
}

function DisplayEmptyCanvas({ text }: { text: string }) {
  return (
    <Card className="flex flex-col items-center justify-center h-[500px] w-full bg-card/50 border-dashed border-2 border-secondary mt-5">
      <Canvas style={{ height: "500px", width: "100%" }}>
        <Text fontSize={0.5} color="#6B7280" position={[0, 0, 0]} maxWidth={4} textAlign="center">
          {text}
        </Text>
        <OrbitControls enableDamping={true} autoRotate/>
      </Canvas>
    </Card>
  );
}