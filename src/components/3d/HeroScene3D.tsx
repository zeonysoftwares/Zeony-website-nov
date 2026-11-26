"use client";

import React, { Component, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
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

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const emptySubscribe = () => () => {};

function getDeviceSnapshot(): { canRender: boolean; isMobile: boolean } {
  if (typeof window === "undefined") {
    return { canRender: false, isMobile: false };
  }
  const mobile = window.innerWidth < 768 || (navigator.hardwareConcurrency || 4) <= 2;
  let glAvailable = false;
  try {
    const canvas = document.createElement("canvas");
    glAvailable = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    glAvailable = false;
  }
  return { canRender: glAvailable, isMobile: mobile };
}

const serverSnapshot = { canRender: false, isMobile: false };
let cachedClientSnapshot: { canRender: boolean; isMobile: boolean } | null = null;
function getCachedClientSnapshot() {
  if (!cachedClientSnapshot) {
    cachedClientSnapshot = getDeviceSnapshot();
  }
  return cachedClientSnapshot;
}

function TechCoreGroup({ isMobile }: { isMobile: boolean }) {
  const rootRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = isMobile ? 80 : 200;

  const { particleGeo, particleMat, lineGeo, lineMat, orbitLine } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + ((i * 73) % 100) / 38;
      const theta = (i * 2.39996) % (Math.PI * 2);
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: "#38bdf8",
      size: isMobile ? 0.032 : 0.026,
      transparent: true,
      opacity: 0.72,
      sizeAttenuation: true,
    });

    const orbitPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      orbitPoints.push(
        new THREE.Vector3(Math.cos(a) * 2.55, Math.sin(a) * 0.65, Math.sin(a) * 2.55)
      );
    }
    const lGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const lMat = new THREE.LineBasicMaterial({
      color: "#3b82f6",
      transparent: true,
      opacity: 0.35,
    });
    const lineObj = new THREE.Line(lGeo, lMat);

    return { particleGeo: pGeo, particleMat: pMat, lineGeo: lGeo, lineMat: lMat, orbitLine: lineObj };
  }, [particleCount, isMobile]);

  useEffect(() => {
    return () => {
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [particleGeo, particleMat, lineGeo, lineMat]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (rootRef.current) {
      const targetX = state.pointer.y * 0.24;
      const targetY = state.pointer.x * 0.36;
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetX, 0.06);
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetY, 0.06);
      rootRef.current.position.y = Math.sin(t * 0.9) * 0.09;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.35;
      coreRef.current.rotation.x += delta * 0.18;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.22;
      wireRef.current.rotation.z += delta * 0.12;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.28;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x -= delta * 0.32;
      innerRingRef.current.rotation.y += delta * 0.15;
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.y += delta * 0.25;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.04;
    }
  });

  const satellitePositions: [number, number, number][] = [
    [2.1, 0.75, 0.4],
    [-2.0, -0.65, 0.8],
    [0.5, 1.85, -1.1],
    [-1.1, 1.25, -1.6],
    [1.45, -1.35, -0.9],
  ];

  return (
    <group ref={rootRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshPhysicalMaterial
          color="#1d4ed8"
          emissive="#0f296b"
          emissiveIntensity={0.6}
          roughness={0.14}
          metalness={0.75}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.42, 1]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.32} />
      </mesh>

      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0.3, 0]}>
        <torusGeometry args={[1.95, 0.025, 16, 96]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#2563eb"
          emissiveIntensity={0.45}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={innerRingRef} rotation={[-Math.PI / 4, -0.4, 0.4]}>
        <torusGeometry args={[1.65, 0.018, 16, 84]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      <group ref={nodesRef}>
        <primitive object={orbitLine} />
        {satellitePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            {i % 2 === 0 ? (
              <boxGeometry args={[0.18, 0.18, 0.18]} />
            ) : (
              <octahedronGeometry args={[0.14, 0]} />
            )}
            <meshStandardMaterial
              color={i % 2 === 0 ? "#38bdf8" : "#3b82f6"}
              emissive={i % 2 === 0 ? "#0284c7" : "#1d4ed8"}
              emissiveIntensity={0.65}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      <points ref={particlesRef} geometry={particleGeo} material={particleMat} />
    </group>
  );
}

function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 via-sky-500/20 to-cyan-400/20 blur-2xl" />
    </div>
  );
}

export function HeroScene3D({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const device = useSyncExternalStore(
    emptySubscribe,
    getCachedClientSnapshot,
    () => serverSnapshot
  );

  if (shouldReduceMotion || !device.canRender) {
    return (
      <div className={className}>
        <StaticFallback />
      </div>
    );
  }

  return (
    <div className={className}>
      <WebGLErrorBoundary fallback={<StaticFallback />}>
        <Canvas
          dpr={device.isMobile ? [1, 1.25] : [1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 5.6], fov: 44 }}
          style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
        >
          <ambientLight intensity={0.65} />
          <directionalLight position={[5, 5, 5]} intensity={1.8} color="#eff6ff" />
          <pointLight position={[-4, -3, 3]} intensity={1.5} color="#06b6d4" />
          <pointLight position={[3, 4, -2]} intensity={1.2} color="#3b82f6" />
          <TechCoreGroup isMobile={device.isMobile} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
