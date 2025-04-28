// src/components/ExplodingTitle.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { OrbitControls } from "@react-three/drei";

// -----------------------------------------------------------------------------
// Le texte 3D animé (explosion + répulsion)
// -----------------------------------------------------------------------------
function TitleMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [material, setMaterial] = useState<THREE.MeshBasicMaterial | null>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const mouse = useRef(new THREE.Vector2());

  // ** Scale responsive **
  const [baseScale, setBaseScale] = useState(1);
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      // 1440px -> scale 1, 480px -> scale 0.1
      setBaseScale(Math.min(1, Math.max(0.1, w / 1440)));
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ** Chargement géométrie + création du gradient **
  useEffect(() => {
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (font: Font) => {
      const textGeo = new TextGeometry("Berecouf", {
        font,
        size: 1.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005,
        bevelSegments: 3,
      });
      textGeo.center();
      textGeo.scale(1, 1, 0.02);
      setGeometry(textGeo as unknown as THREE.BufferGeometry);

      // un canvas de 1px de haut pour le dégradé
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createLinearGradient(0, 0, 256, 0);
      grad.addColorStop(0, "#2563eb");
      grad.addColorStop(0.5, "#7c3aed");
      grad.addColorStop(1, "#ec4899");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 1);
      const texture = new THREE.CanvasTexture(canvas);

      setMaterial(new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
      }));
    });

    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // ** Boucle d’animation R3F ** (explosion + répulsion)
  useFrame((state) => {
    if (!meshRef.current || !geometry) return;
    const t = state.clock.getElapsedTime();
    const anim = 1 + 0.06 * Math.sin(t * 2) + 0.03 * Math.sin(t * 5);
    meshRef.current.scale.setScalar(baseScale * anim);

    const posAttr = geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    if (!originalPositions.current) originalPositions.current = arr.slice();

    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse.current, state.camera);
    const hit = ray.intersectObject(meshRef.current)[0];
    const cursor = hit ? hit.point : ray.ray.at(0, new THREE.Vector3());
    const tmp = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      tmp.fromArray(originalPositions.current!, i * 3);
      const d = tmp.distanceTo(cursor);
      const f = Math.max(0, 1.5 - d);
      tmp.add(tmp.clone().sub(cursor).normalize().multiplyScalar(f * 0.1));

      arr[i * 3 + 0] += (tmp.x - arr[i * 3 + 0]) * 0.1;
      arr[i * 3 + 1] += (tmp.y - arr[i * 3 + 1]) * 0.1;
      arr[i * 3 + 2] += (tmp.z - arr[i * 3 + 2]) * 0.1;
    }
    posAttr.needsUpdate = true;
  });

  if (!geometry || !material) return null;
  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

// -----------------------------------------------------------------------------
// Animateur de remise en place fluide
// -----------------------------------------------------------------------------
type ResetAnimatorProps = {
  controlsRef: React.RefObject<ThreeOrbitControls>;
  isDraggingRef: React.MutableRefObject<boolean>;
  lastReleaseRef: React.MutableRefObject<number>;
  delay?: number;
  duration?: number;
};

function ResetAnimator({
  controlsRef,
  isDraggingRef,
  lastReleaseRef,
  delay = 2000,
  duration = 1,
}: ResetAnimatorProps) {
  const resetting = useRef(false);
  const progress = useRef(0);
  const prevCam = useRef(new THREE.Vector3());
  const prevTgt = useRef(new THREE.Vector3());
  const initCam = new THREE.Vector3(0, 0, 15);
  const initTgt = new THREE.Vector3(0, 0, 0);

  useFrame((state) => {
    const cam = state.camera;
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    // démarrer l’animation si inactif depuis > delay
    if (
      !resetting.current &&
      !isDraggingRef.current &&
      Date.now() - lastReleaseRef.current > delay
    ) {
      resetting.current = true;
      progress.current = 0;
      prevCam.current.copy(cam.position);
      prevTgt.current.copy(ctrl.target);
    }

    if (resetting.current) {
      const dt = state.clock.getDelta();
      progress.current = Math.min(1, progress.current + dt / duration);

      cam.position.lerpVectors(prevCam.current, initCam, progress.current);
      ctrl.target.lerpVectors(prevTgt.current, initTgt, progress.current);
      ctrl.update();

      if (progress.current >= 1) {
        resetting.current = false;
        lastReleaseRef.current = Date.now();
      }
    }
  });

  return null;
}

// -----------------------------------------------------------------------------
// Composant racine
// -----------------------------------------------------------------------------
export default function ExplodingTitle() {
  const controlsRef = useRef<ThreeOrbitControls>(null);
  const isDragging = useRef(false);
  const lastRelease = useRef(Date.now());

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 15], fov: 30 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <TitleMesh />

        {/* On injecte l’animateur de reset DANS le Canvas */}
        <ResetAnimator
          controlsRef={controlsRef}
          isDraggingRef={isDragging}
          lastReleaseRef={lastRelease}
          delay={2000}
          duration={1}
        />

        {/* OrbitControls avec onStart/onEnd pour mettre à jour isDragging & lastRelease */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          onStart={() => { isDragging.current = true; }}
          onEnd={() => {
            isDragging.current = false;
            lastRelease.current = Date.now();
          }}
        />
      </Canvas>
    </div>
  );
}
