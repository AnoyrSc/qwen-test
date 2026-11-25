import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState, pointerState } from '../state'

/* ------------------------------------------------------------------ */
/*  Hero object — faceted glass-like crystal with inner core           */
/* ------------------------------------------------------------------ */

export function HeroCrystal() {
  const group = useRef()
  const outer = useRef()
  const core = useRef()
  const ring = useRef()

  const outerMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0d0d14'),
        metalness: 0.9,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        envMapIntensity: 1.4,
        flatShading: true,
      }),
    [],
  )

  const coreMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#c9f24d'),
        transparent: true,
        opacity: 0.85,
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const p = scrollState.hero // 0..1 progress through hero

    if (group.current) {
      // idle float + mouse parallax + scroll-driven drift/rotation
      const targetX = pointerState.x * 0.35
      const targetY = pointerState.y * 0.25
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX + p * Math.PI * 0.9, 0.06)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY * 0.5 + p * 0.5, 0.06)
      group.current.position.y = Math.sin(t * 0.7) * 0.08 - p * 1.2
      group.current.position.z = -p * 3.5
      const s = 1 - p * 0.35
      group.current.scale.setScalar(s)
    }
    if (outer.current) {
      outer.current.rotation.z = t * 0.12
      outer.current.rotation.x = Math.sin(t * 0.35) * 0.15
    }
    if (core.current) {
      core.current.rotation.y = -t * 0.6
      core.current.rotation.z = t * 0.4
      const pulse = 1 + Math.sin(t * 2.2) * 0.06
      core.current.scale.setScalar(pulse)
      coreMat.opacity = 0.85 - p * 0.5
    }
    if (ring.current) {
      ring.current.rotation.x = t * 0.25
      ring.current.rotation.y = -t * 0.18
    }
  })

  return (
    <group ref={group} position={[1.6, 0.1, 0]}>
      <mesh ref={outer} material={outerMat}>
        <icosahedronGeometry args={[1.5, 1]} />
      </mesh>
      <mesh ref={core} material={coreMat}>
        <octahedronGeometry args={[0.55, 0]} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.3, 0.012, 8, 128]} />
        <meshBasicMaterial color="#eceae4" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.4, 0]}>
        <torusGeometry args={[2.05, 0.006, 8, 128]} />
        <meshBasicMaterial color="#c9f24d" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Particle field — GPU points drifting in depth                      */
/* ------------------------------------------------------------------ */

export function ParticleField({ count = 1400 }) {
  const points = useRef()

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // distribute in a wide slab around camera path
      positions[i * 3 + 0] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4
      seeds[i] = Math.random()
    }
    return { positions, seeds }
  }, [count])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color('#b9b6ad'),
        size: 0.035,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (points.current) {
      points.current.rotation.y = t * 0.012 + scrollState.progress * 0.4
      points.current.position.y = Math.sin(t * 0.1) * 0.2
      // subtle breathing via scale instead of per-particle CPU updates
      const s = 1 + Math.sin(t * 0.2) * 0.015
      points.current.scale.set(s, s, 1)
      mat.opacity = 0.5 + Math.sin(seeds[0] * 6.28 + t) * 0.08
    }
  })

  return (
    <points ref={points} material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  )
}

/* ------------------------------------------------------------------ */
/*  Flowing ribbon lines — thin tubes weaving through space            */
/* ------------------------------------------------------------------ */

function makeRibbonCurve(seed, radius, yAmp) {
  const pts = []
  const N = 48
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2
    const r = radius + Math.sin(a * 3 + seed) * 0.5
    pts.push(
      new THREE.Vector3(
        Math.cos(a) * r,
        Math.sin(a * 2 + seed) * yAmp + Math.cos(a * 5 + seed * 2) * 0.18,
        Math.sin(a) * r * 0.8,
      ),
    )
  }
  return new THREE.CatmullRomCurve3(pts, true)
}

export function Ribbons() {
  const group = useRef()

  const geometries = useMemo(() => {
    const curves = [
      makeRibbonCurve(0.0, 4.2, 0.9),
      makeRibbonCurve(2.1, 5.4, 1.3),
      makeRibbonCurve(4.4, 3.4, 0.6),
    ]
    return curves.map((c) => new THREE.TubeGeometry(c, 180, 0.008, 5, true))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = t * 0.03 + scrollState.progress * 1.2
      group.current.rotation.x = Math.sin(t * 0.08) * 0.1 + scrollState.progress * 0.4
      group.current.position.z = -scrollState.progress * 6
    }
  })

  return (
    <group ref={group} position={[0.5, 0, -4]}>
      {geometries.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshBasicMaterial
            color={i === 1 ? '#c9f24d' : '#5d5a52'}
            transparent
            opacity={i === 1 ? 0.35 : 0.22}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Camera rig — scroll + pointer driven, damped                       */
/* ------------------------------------------------------------------ */

const camTargets = [
  // hero
  { pos: [0, 0, 7], look: [0.6, 0, 0] },
  // manifesto
  { pos: [0.4, 0.4, 6.4], look: [0.2, 0.2, 0] },
  // work
  { pos: [-0.6, 0.2, 6.8], look: [-0.4, 0, 0] },
  // services
  { pos: [0.3, -0.4, 6.2], look: [0.4, -0.3, 0] },
  // process
  { pos: [0, 0.5, 7.6], look: [0, 0.4, 0] },
  // contact
  { pos: [0, 0, 6.6], look: [0, 0, 0] },
]

export function CameraRig() {
  useFrame(({ camera }) => {
    const p = scrollState.progress * (camTargets.length - 1)
    const i = Math.min(Math.floor(p), camTargets.length - 2)
    const f = THREE.MathUtils.smoothstep(p - i, 0, 1)

    const a = camTargets[i]
    const b = camTargets[i + 1]

    const tx = THREE.MathUtils.lerp(a.pos[0], b.pos[0], f) + pointerState.x * 0.35
    const ty = THREE.MathUtils.lerp(a.pos[1], b.pos[1], f) + pointerState.y * 0.25
    const tz = THREE.MathUtils.lerp(a.pos[2], b.pos[2], f)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.05)

    const lx = THREE.MathUtils.lerp(a.look[0], b.look[0], f)
    const ly = THREE.MathUtils.lerp(a.look[1], b.look[1], f)
    camera.lookAt(lx, ly, 0)
  })
  return null
}

/* ------------------------------------------------------------------ */
/*  Lighting setup                                                     */
/* ------------------------------------------------------------------ */

export function StageLighting() {
  const key = useRef()
  useFrame(() => {
    if (key.current) {
      key.current.position.x = 4 + pointerState.x * 2
      key.current.position.y = 3 + pointerState.y * 1.5
    }
  })
  return (
    <>
      <ambientLight intensity={0.35} color="#8a8f9c" />
      <directionalLight ref={key} position={[4, 3, 5]} intensity={2.2} color="#fffdf2" />
      <pointLight position={[-6, -2, 3]} intensity={10} distance={14} color="#2b4cff" />
      <pointLight position={[2.2, 0.2, 2.5]} intensity={6} distance={8} color="#c9f24d" />
    </>
  )
}
