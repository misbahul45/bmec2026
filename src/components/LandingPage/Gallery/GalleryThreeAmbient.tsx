import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function GalleryThreeAmbient() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth || 800
    const h = mount.clientHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
    camera.position.z = 28

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const count = 80
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
      speeds[i] = 0.15 + Math.random() * 0.3
      offsets[i] = Math.random() * Math.PI * 2
    }

    const geo = new THREE.BufferGeometry()
    const basePos = positions.slice()
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color('oklch(0.75 0.08 230)'),
      size: 0.14,
      transparent: true,
      opacity: 0.28,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    let animId: number
    let elapsed = 0
    let lastTime = performance.now()
    let mouse = { x: 0, y: 0 }

    const onMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)

    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const now = performance.now()
      elapsed += (now - lastTime) * 0.001
      lastTime = now

      for (let i = 0; i < count; i++) {
        posAttr.setX(i, basePos[i * 3] + Math.sin(elapsed * speeds[i] + offsets[i]) * 0.5 + mouse.x * 0.6)
        posAttr.setY(i, basePos[i * 3 + 1] + Math.cos(elapsed * speeds[i] * 0.7 + offsets[i]) * 0.4 + mouse.y * 0.4)
      }
      posAttr.needsUpdate = true
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
