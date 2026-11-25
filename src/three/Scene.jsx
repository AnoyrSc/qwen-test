import { Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HeroCrystal, ParticleField, Ribbons, CameraRig, StageLighting } from './SceneElements'

/* Procedural studio environment — no external HDR fetch, fully offline */
function StudioEnvironment() {
  const env = useMemo(() => {
    // build a small emissive scene as the environment source
    const src = new THREE.Scene()
    const geo = new THREE.SphereGeometry(10, 24, 16)
    const mat = new THREE.MeshBasicMaterial({ color: '#0c0c12', side: THREE.BackSide })
    src.add(new THREE.Mesh(geo, mat))

    const panelGeo = new THREE.PlaneGeometry(6, 3)
    const warm = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: '#fff5dd' }))
    warm.position.set(4, 4, -3)
    warm.lookAt(0, 0, 0)
    src.add(warm)

    const cool = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: '#3b5bff' }))
    cool.position.set(-5, -2, 4)
    cool.lookAt(0, 0, 0)
    src.add(cool)

    const lime = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 2.5),
      new THREE.MeshBasicMaterial({ color: '#c9f24d' }),
    )
    lime.position.set(2, -1, 5)
    lime.lookAt(0, 0, 0)
    src.add(lime)

    // PMREM needs a renderer; we create it lazily inside the canvas tree instead.
    return { src, panelGeo }
  }, [])

  // dispose helper geometries on unmount handled by R3F for meshes in tree;
  // this off-tree scene is cleaned manually below
  useFrame(({ gl, scene }) => {
    if (!env.tex) {
      const p = new THREE.PMREMGenerator(gl)
      env.tex = p.fromScene(env.src, 0.04).texture
      scene.environment = env.tex
      p.dispose()
      env.src.traverse((o) => o.geometry && o.geometry.dispose())
      env.src.traverse((o) => o.material && o.material.dispose())
    }
  })

  return null
}

export default function Scene() {
  return (
    <div className="app-canvas">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#060608']} />
          <fog attach="fog" args={['#060608', 8, 26]} />
          <StudioEnvironment />
          <StageLighting />
          <HeroCrystal />
          <ParticleField />
          <Ribbons />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  )
}
