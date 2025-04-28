"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { OrbitControls } from "@react-three/drei";

function TitleMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [material, setMaterial] = useState<THREE.MeshBasicMaterial | null>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const mouse = useRef(new THREE.Vector2());

  // ** Nouveau ** : facteur d'échelle de base selon la taille d'écran
  const [baseScale, setBaseScale] = useState(1);
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      // On veut qu'à 1440px de large = scale 1, et descendre jusqu'à 0.5 à 480px
      const s = Math.min(1, Math.max(0.1, w / 1440));
      setBaseScale(s);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

      // Gradient sur un canvas 1px de haut
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, 256, 0);
      gradient.addColorStop(0, "#2563eb");
      gradient.addColorStop(0.5, "#7c3aed");
      gradient.addColorStop(1, "#ec4899");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 1);

      const texture = new THREE.CanvasTexture(canvas);
      setMaterial(
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
        })
      );
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handleMouseMove);
    return () => window.removeEventListener("pointermove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !geometry) return;

    // Animation d'explosion
    const t = state.clock.getElapsedTime();
    const anim = 1 + 0.06 * Math.sin(t * 2) + 0.03 * Math.sin(t * 5);

    // On combine l'animation et le baseScale pour la taille finale
    const finalScale = baseScale * anim;
    meshRef.current.scale.set(finalScale, finalScale, finalScale);

    // Gestion du "repoussement" au passage de la souris (inchangé)
    const posAttr = geometry.attributes.position;
    const positions = posAttr.array as Float32Array;
    if (!originalPositions.current) {
      originalPositions.current = positions.slice();
    }
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse.current, state.camera);
    const hits = ray.intersectObject(meshRef.current);
    const cursor = hits[0]?.point ?? ray.ray.at(0, new THREE.Vector3());
    const temp = new THREE.Vector3();

    for (let i = 0; i < posAttr.count; i++) {
      temp.fromArray(originalPositions.current!, i * 3);
      const dist = temp.distanceTo(cursor);
      const force = Math.max(0, 1.5 - dist);
      const dir = temp.clone().sub(cursor).normalize();
      const offset = dir.multiplyScalar(force * 0.1);
      temp.add(offset);

      positions[i * 3 + 0] += (temp.x - positions[i * 3 + 0]) * 0.1;
      positions[i * 3 + 1] += (temp.y - positions[i * 3 + 1]) * 0.1;
      positions[i * 3 + 2] += (temp.z - positions[i * 3 + 2]) * 0.1;
    }
    posAttr.needsUpdate = true;
  });

  if (!geometry || !material) return null;
  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

export default function ExplodingTitle() {
  return (
    // On garde le plein écran
    <div className="w-full h-screen bg-black">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 15], fov: 30 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <TitleMesh />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
