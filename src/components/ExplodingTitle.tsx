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

  useEffect(() => {
    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (font: Font) => {
      const textGeo = new TextGeometry("Berecouf", {
        font: font,
        size: 1.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005,
        bevelSegments: 3,
      });
      textGeo.center();
      textGeo.scale(1, 1, 0.02); // Réduction explicite de la profondeur visuelle

      const bufferGeo = textGeo as unknown as THREE.BufferGeometry;
      setGeometry(bufferGeo);

      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#2563eb"); // blue-600
      gradient.addColorStop(0.5, "#7c3aed"); // violet-600
      gradient.addColorStop(1, "#ec4899"); // fuchsia-600 (rose)
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, 1);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

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

    const t = state.clock.getElapsedTime();
    const scale = 1 + 0.06 * Math.sin(t * 2) + 0.03 * Math.sin(t * 5);
    meshRef.current.scale.set(scale, scale, scale);

    const positionAttr = geometry.attributes.position;
    const positions = positionAttr.array as Float32Array;

    if (!originalPositions.current) {
      originalPositions.current = positions.slice();
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse.current, state.camera);
    const intersects = raycaster.intersectObject(meshRef.current);

    const temp = new THREE.Vector3();
    const cursor = intersects[0]?.point ?? raycaster.ray.at(0, new THREE.Vector3());

    for (let i = 0; i < positionAttr.count; i++) {
      temp.fromArray(originalPositions.current, i * 3);
      const distance = temp.distanceTo(cursor);
      const force = Math.max(0, 1.5 - distance);

      const direction = temp.clone().sub(cursor).normalize();
      const offset = direction.multiplyScalar(force * 0.1);
      temp.add(offset);

      positions[i * 3 + 0] += (temp.x - positions[i * 3 + 0]) * 0.1;
      positions[i * 3 + 1] += (temp.y - positions[i * 3 + 1]) * 0.1;
      positions[i * 3 + 2] += (temp.z - positions[i * 3 + 2]) * 0.1;
    }

    positionAttr.needsUpdate = true;
  });

  if (!geometry || !material) return null;
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0, 0]}
    />
  );
}

export default function ExplodingTitle() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 15], fov: 30 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <TitleMesh />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
