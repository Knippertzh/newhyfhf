"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, PerspectiveCamera } from "@react-three/drei"
import type * as THREE from "three"

function FloatingParticles({ count = 100, color = "#5d00ff" }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const light = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.1
    }

    if (light.current) {
      const time = clock.getElapsedTime()
      light.current.position.x = Math.sin(time * 0.3) * 8
      light.current.position.y = Math.cos(time * 0.2) * 8
      light.current.position.z = Math.sin(time * 0.1) * 8
    }
  })

  return (
    <>
      <pointLight ref={light} distance={20} intensity={2} color={color} />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </instancedMesh>
    </>
  )
}

function AnimatedBackground() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0, -10]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#000000"
        emissive="#1a0033"
        emissiveIntensity={0.2}
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  )
}

interface PageBackgroundProps {
  intensity?: "low" | "medium" | "high"
  color?: string
}

export default function PageBackground({ intensity = "medium", color = "#5d00ff" }: PageBackgroundProps) {
  // Adjust particle count based on intensity
  const particleCount = intensity === "low" ? 50 : intensity === "medium" ? 100 : 150

  return (
    <div className="fixed inset-0 z-[-1]">
      <Canvas className="h-full w-full">
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <color attach="background" args={["#000000"]} />

        <AnimatedBackground />
        <FloatingParticles count={particleCount} color={color} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[3, 2, -2]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              metalness={0.8}
              emissive={color}
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>

        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
          <mesh position={[-4, -2, -1]}>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial
              color="#00a3ff"
              roughness={0.2}
              metalness={0.8}
              emissive="#00a3ff"
              emissiveIntensity={0.4}
              wireframe
            />
          </mesh>
        </Float>

        <ambientLight intensity={0.2} />
        <Environment files="/environments/dikhololo_night_1k.hdr" />
      </Canvas>
    </div>
  )
}

