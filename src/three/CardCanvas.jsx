import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Per-card mini scenes — lightweight, low-poly, unique per variant  */
/* ------------------------------------------------------------------ */

function Knot({ color = '#c9f24d' }) {
  const mesh = useRef()
  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    mesh.current.rotation.x = t * 0.35
    mesh.current.rotation.y = t * 0.5
    mesh.current.position.y = Math.sin(t * 0.8) * 0.12
  })
  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1.05, 0.32, 160, 24]} />
      <meshPhysicalMaterial
        color="#14141c"
        metalness={0.95}
        roughness={0.18}
        clearcoat={1}
        emissive={color}
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

function Shards({ color = '#7ea0ff' }) {
  const group = useRef()
  const items = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        pos: [
          (Math.sin(i * 13.7) * 1.4),
          (Math.cos(i * 7.3) * 1.1),
          (Math.sin(i * 3.1) * 0.8),
        ],
        rot: [i * 0.7, i * 1.3, i * 0.4],
        scale: 0.28 + ((i * 37) % 10) / 22,
        speed: 0.3 + ((i * 17) % 10) / 14,
      })),
    [],
  )
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.rotation.y = t * 0.18
    group.current.children.forEach((c, i) => {
      c.rotation.z = t * items[i].speed
      c.position.y = items[i].pos[1] + Math.sin(t * 0.7 + i) * 0.15
    })
  })
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={it.rot} scale={it.scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? color : '#1b1b24'}
            metalness={0.7}
            roughness={0.3}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

function SphereField({ color = '#c9f24d' }) {
  const group = useRef()
  const points = useMemo(() => {
    const arr = []
    const N = 90
    for (let i = 0; i < N; i++) {
      // fibonacci sphere
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * Math.PI * (3 - Math.sqrt(5))
      arr.push([Math.cos(phi) * r, y, Math.sin(phi) * r])
    }
    return arr
  }, [])
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.25
  })
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.02, 48, 48]} />
        <meshPhysicalMaterial color="#101018" metalness={1} roughness={0.12} clearcoat={0.6} />
      </mesh>
      {points.map((p, i) => (
        <mesh key={i} position={[p[0] * 1.18, p[1] * 1.18, p[2] * 1.18]}>
          <sphereGeometry args={[0.028, 6, 6]} />
          <meshBasicMaterial color={i % 7 === 0 ? color : '#8b887f'} />
        </mesh>
      ))}
    </group>
  )
}

function MiniLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fffaf0" />
      <pointLight position={[-3, -1, 2]} intensity={5} distance={9} color="#2b4cff" />
    </>
  )
}

export default function CardCanvas({ variant = 0 }) {
  const scene = [
    <Knot key="k" />,
    <Shards key="s" color="#7ea0ff" />,
    <SphereField key="p" />,
    <Shards key="s2" color="#c9f24d" />,
  ][variant % 4]

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
      frameloop="always"
    >
      <MiniLights />
      {scene}
    </Canvas>
  )
}
