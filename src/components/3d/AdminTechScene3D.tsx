"use client";

import React, { useRef, useMemo, useState, useEffect, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("WebGL Scene encountered an error, falling back:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function FloatingCrystalCore({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = isMobile ? 60 : 140;

  const { particleGeo, particleMat } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + (i % 25) * 0.08;
      const angle = (i * 2.399) % (Math.PI * 2);
      const y = (i / particleCount - 0.5) * 3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: "#60a5fa",
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    return { particleGeo: geo, particleMat: mat };
  }, [particleCount]);

  useEffect(() => {
    return () => {
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [particleGeo, particleMat]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.12;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.35 + time * 0.15,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.25,
        0.05
      );
    }
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.2;
      outerRef.current.rotation.x += delta * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.35;
      innerRef.current.rotation.z += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#3b82f6"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Orbital Torus Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.4} />
      </mesh>

      {/* Secondary Orbital Ring */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[1.6, 0.015, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>

      {/* Floating Ambient Particles */}
      <points ref={particlesRef} geometry={particleGeo} material={particleMat} />
    </group>
  );
}

export function AdminTechScene3D({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      setCanRender(gl);
      setIsMobile(window.innerWidth < 768);
    } catch {
      setCanRender(false);
    }
  }, []);

  const fallback = (
    <div className={`pointer-events-none relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent blur-2xl" />
    </div>
  );

  if (!isMounted || !canRender || shouldReduceMotion) {
    return fallback;
  }

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <div className={`pointer-events-none relative ${className}`} aria-hidden="true">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          camera={{ position: [0, 0, 4.6], fov: 45 }}
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#60a5fa" />
          <pointLight position={[-5, -5, -3]} intensity={0.8} color="#818cf8" />
          <FloatingCrystalCore isMobile={isMobile} />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
