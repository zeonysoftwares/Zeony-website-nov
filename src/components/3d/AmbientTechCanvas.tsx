"use client";

import React, { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const emptySubscribe = () => () => {};
const serverCount = 0;
let cachedCount: number | null = null;

function getClientCount(): number {
  if (cachedCount !== null) return cachedCount;
  if (typeof window === "undefined") return 0;
  const isLowPower = window.innerWidth < 768 || (navigator.hardwareConcurrency || 4) <= 2;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    cachedCount = gl ? (isLowPower ? 45 : 110) : 0;
  } catch {
    cachedCount = 0;
  }
  return cachedCount;
}

function ParticleField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (((i * 37) % 100) / 100 - 0.5) * 14;
      positions[i * 3 + 1] = (((i * 67) % 100) / 100 - 0.5) * 8;
      positions[i * 3 + 2] = (((i * 97) % 100) / 100 - 0.5) * 6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: "#38bdf8",
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });

    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      state.pointer.y * 0.08,
      0.03
    );
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export function AmbientTechCanvas({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const count = useSyncExternalStore(emptySubscribe, getClientCount, () => serverCount);

  if (shouldReduceMotion || count === 0) {
    return null;
  }

  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <ParticleField count={count} />
      </Canvas>
    </div>
  );
}
