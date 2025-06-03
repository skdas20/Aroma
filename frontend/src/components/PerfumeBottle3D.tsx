"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function PerfumeModel() {
  const modelRef = useRef<THREE.Group>(null);
  
  // Load the GLTF model from public/model folder
  const { scene } = useGLTF("/model/scene.gltf");
  
  // Optional: Add subtle rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });  return (
    <group ref={modelRef}>      <primitive 
        object={scene} 
        scale={30} 
        position={[0, -1.2, 0]} 
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function PerfumeBottle3D() {
  return (
    <div className="w-full h-64 lg:h-[400px] xl:h-[500px]">
      <Canvas 
        camera={{ position: [3, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 7]} 
          intensity={1.0} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.3} />
          <Suspense fallback={null}>
          <PerfumeModel />
        </Suspense>        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate={true}
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}

// Preload the GLTF model for better performance
useGLTF.preload("/model/scene.gltf");
