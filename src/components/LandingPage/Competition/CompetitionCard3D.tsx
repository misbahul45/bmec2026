import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import type { Competition } from './data'
import { accentTokens } from './data'
import { Check } from 'lucide-react'

interface Props {
  comp: Competition
}

function useThreeCard(mountRef: React.RefObject<HTMLDivElement | null>, accentCss: string) {
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth || 400
    const h = mount.clientHeight || 300

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.z = 18

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const shapes = [
      { geo: new THREE.IcosahedronGeometry(1.6, 0), x: 3, y: 1.5, z: -2, speed: 0.4, offset: 0 },
      { geo: new THREE.OctahedronGeometry(1.0, 0), x: -3, y: -1, z: -4, speed: 0.6, offset: 1.2 },
      { geo: new THREE.TetrahedronGeometry(0.8, 0), x: 1, y: -2.5, z: -1, speed: 0.5, offset: 2.4 },
    ]

    const meshes = shapes.map((s) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentCss),
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      })
      const mesh = new THREE.Mesh(s.geo, mat)
      mesh.position.set(s.x, s.y, s.z)
      mesh.userData = { originX: s.x, originY: s.y, speed: s.speed, offset: s.offset }
      scene.add(mesh)
      return mesh
    })

    let animId: number
    let elapsed = 0
    let lastTime = performance.now()
    let mouse = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2
    }
    mount.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const now = performance.now()
      elapsed += (now - lastTime) * 0.001
      lastTime = now

      meshes.forEach((mesh) => {
        const ud = mesh.userData
        mesh.position.x = ud.originX + Math.sin(elapsed * ud.speed + ud.offset) * 0.5 + mouse.x * 0.4
        mesh.position.y = ud.originY + Math.cos(elapsed * ud.speed * 0.8 + ud.offset) * 0.4 + mouse.y * 0.3
        mesh.rotation.x += 0.004
        mesh.rotation.y += 0.003
      })

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
      window.removeEventListener('resize', onResize)
      mount.removeEventListener('mousemove', onMouseMove)
      shapes.forEach((s) => s.geo.dispose())
      meshes.forEach((m) => (m.material as THREE.Material).dispose())
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])
}

export function CompetitionCard3D({ comp }: Props) {
  const threeRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const tokens = accentTokens[comp.accent]
  const { Icon } = comp

  useThreeCard(threeRef, tokens.glow)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, {
      rotateY: x * 8,
      rotateX: -y * 8,
      scale: 1.02,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative rounded-2xl border bg-card shadow-lg overflow-hidden ${tokens.border}`}
      style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
    >
      <div ref={threeRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className={`h-1 w-full ${tokens.bar}`} />

      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-xl ${tokens.bg} border ${tokens.border} flex items-center justify-center shrink-0`}>
            <Icon size={18} className={tokens.text} />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground block">{comp.label}</span>
            <h3 className="text-lg font-bold text-card-foreground leading-tight">{comp.title}</h3>
          </div>
          <span className={`ml-auto text-xs font-bold border rounded-full px-3 py-1 shrink-0 ${tokens.badge}`}>
            {comp.prize}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{comp.subtitle}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {comp.tags.map((t) => (
            <span key={t} className={`text-[10px] font-medium border rounded-full px-2 py-0.5 ${tokens.badge}`}>
              {t}
            </span>
          ))}
        </div>

        <ul className="space-y-1.5">
          {comp.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <Check size={12} className={`${tokens.text} mt-0.5 shrink-0`} />
              <span className="text-xs text-card-foreground leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>

        {comp.scoreTable && (
          <div className="mt-4 rounded-xl overflow-hidden border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className={`${tokens.bg}`}>
                  {['Level', 'Benar', 'Salah', 'Kosong'].map((h) => (
                    <th key={h} className={`px-3 py-2 text-left font-semibold uppercase tracking-wide text-[10px] ${tokens.text}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comp.scoreTable.map((row) => (
                  <tr key={row.level} className="border-t border-border">
                    <td className="px-3 py-2 font-medium text-card-foreground">{row.level}</td>
                    <td className="px-3 py-2 text-green-600 font-semibold">{row.correct}</td>
                    <td className="px-3 py-2 text-destructive font-semibold">{row.wrong}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.empty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {comp.stages && (
          <div className="mt-4 flex items-center gap-1.5 flex-wrap">
            {comp.stages.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className={`text-[10px] font-semibold border rounded-full px-2.5 py-0.5 ${tokens.badge}`}>{s}</span>
                {i < comp.stages!.length - 1 && (
                  <span className="text-muted-foreground text-[10px]">→</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
