"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, PerspectiveCamera, useTexture } from "@react-three/drei"
import * as THREE from "three"

function FloatingParticles({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const light = useRef<THREE.PointLight>(null)

  useEffect(() => {
    if (!mesh.current) return

    // Create random positions for particles
    const dummy = new THREE.Object3D()
    const matrix = new THREE.Matrix4()

    for (let i = 0; i < count; i++) {
      dummy.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10)

      const scale = Math.random() * 0.2 + 0.05
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()

      mesh.current.setMatrixAt(i, dummy.matrix)
    }

    mesh.current.instanceMatrix.needsUpdate = true
  }, [count])

  useFrame(({ clock }) => {
    if (light.current) {
      const time = clock.getElapsedTime()
      light.current.position.x = Math.sin(time * 0.3) * 8
      light.current.position.y = Math.cos(time * 0.2) * 8
      light.current.position.z = Math.sin(time * 0.1) * 8
    }
  })

  return (
    <>
      <pointLight ref={light} distance={20} intensity={2} color="#5d00ff" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#5d00ff"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </instancedMesh>
    </>
  )
}

function AnimatedBackground() {
  const texture = useTexture("/placeholder.svg?height=1000&width=1000")
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

export default function LoginScene() {
  return (
    <Canvas className="h-full w-full">
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <color attach="background" args={["#000000"]} />

      <AnimatedBackground />
      <FloatingParticles count={150} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[3, 2, -2]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#5d00ff"
            roughness={0.2}
            metalness={0.8}
            emissive="#5d00ff"
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
      <Environment preset="night" />
    </Canvas>
  )
}

