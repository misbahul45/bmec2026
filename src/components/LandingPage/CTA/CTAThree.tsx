import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function CTAThree() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth || 800
    const h = mount.clientHeight || 500

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000)
    camera.position.z = 32

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const shapes = [
      { geo: new THREE.IcosahedronGeometry(3.2, 0), x: -14, y: 6, z: -8, speed: 0.35, offset: 0, rotX: 0.003, rotY: 0.002, opacity: 0.18 },
      { geo: new THREE.OctahedronGeometry(2.2, 0), x: 13, y: -5, z: -6, speed: 0.45, offset: 1.4, rotX: 0.002, rotY: 0.004, opacity: 0.14 },
      { geo: new THREE.TetrahedronGeometry(1.8, 0), x: 16, y: 9, z: -4, speed: 0.6, offset: 2.8, rotX: 0.004, rotY: 0.002, opacity: 0.12 },
      { geo: new THREE.IcosahedronGeometry(1.4, 0), x: -15, y: -8, z: -3, speed: 0.5, offset: 3.5, rotX: 0.003, rotY: 0.003, opacity: 0.16 },
      { geo: new THREE.OctahedronGeometry(1.0, 0), x: 4, y: -11, z: -10, speed: 0.28, offset: 0.8, rotX: 0.002, rotY: 0.002, opacity: 0.10 },
    ]

    const meshes = shapes.map((s) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ffffff'),
        wireframe: true,
        transparent: true,
        opacity: s.opacity,
      })
      const mesh = new THREE.Mesh(s.geo, mat)
      mesh.position.set(s.x, s.y, s.z)
      mesh.userData = { originX: s.x, originY: s.y, speed: s.speed, offset: s.offset, rotX: s.rotX, rotY: s.rotY }
      scene.add(mesh)
      return mesh
    })

    const count = 60
    const pos = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 55
      pos[i * 3 + 1] = (Math.random() - 0.5) * 38
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12
      speeds[i] = 0.12 + Math.random() * 0.25
      offsets[i] = Math.random() * Math.PI * 2
    }
    const basePos = pos.slice()
    const ptGeo = new THREE.BufferGeometry()
    ptGeo.setAttribute('position', new THREE.BufferAttribute(pos.slice(), 3))
    const ptMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.22, sizeAttenuation: true })
    const points = new THREE.Points(ptGeo, ptMat)
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

      meshes.forEach((mesh) => {
        const ud = mesh.userData
        mesh.position.x = ud.originX + Math.sin(elapsed * ud.speed + ud.offset) * 0.8 + mouse.x * 0.5
        mesh.position.y = ud.originY + Math.cos(elapsed * ud.speed * 0.7 + ud.offset) * 0.6 + mouse.y * 0.4
        mesh.rotation.x += ud.rotX
        mesh.rotation.y += ud.rotY
      })

      for (let i = 0; i < count; i++) {
        posAttr.setX(i, basePos[i * 3] + Math.sin(elapsed * speeds[i] + offsets[i]) * 0.4 + mouse.x * 0.5)
        posAttr.setY(i, basePos[i * 3 + 1] + Math.cos(elapsed * speeds[i] * 0.8 + offsets[i]) * 0.3 + mouse.y * 0.35)
      }
      posAttr.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      shapes.forEach((s) => s.geo.dispose())
      meshes.forEach((m) => (m.material as THREE.Material).dispose())
      ptGeo.dispose()
      ptMat.dispose()
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
