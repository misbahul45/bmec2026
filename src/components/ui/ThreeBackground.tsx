import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-foreground")
      .trim();

    const color = new THREE.Color(primaryColor);

    interface ShapeConfig {
      geo: THREE.BufferGeometry;
      opacity: number;
      x: number;
      y: number;
      z: number;
      floatSpeed: number;
      floatOffset: number;
      rotX: number;
      rotY: number;
    }

    const configs: ShapeConfig[] = [
      {
        geo: new THREE.IcosahedronGeometry(2.8, 0),
        opacity: 0.06,
        x: -14,
        y: 8,
        z: -5,
        floatSpeed: 0.55,
        floatOffset: 0,
        rotX: 0.003,
        rotY: 0.002,
      },
      {
        geo: new THREE.OctahedronGeometry(2.0, 0),
        opacity: 0.07,
        x: 12,
        y: -6,
        z: -8,
        floatSpeed: 0.4,
        floatOffset: 1.0,
        rotX: 0.002,
        rotY: 0.004,
      },
      {
        geo: new THREE.TetrahedronGeometry(1.6, 0),
        opacity: 0.05,
        x: 16,
        y: 10,
        z: -3,
        floatSpeed: 0.7,
        floatOffset: 2.0,
        rotX: 0.004,
        rotY: 0.002,
      },
      {
        geo: new THREE.IcosahedronGeometry(1.4, 0),
        opacity: 0.08,
        x: -16,
        y: -9,
        z: -2,
        floatSpeed: 0.5,
        floatOffset: 3.1,
        rotX: 0.003,
        rotY: 0.003,
      },
      {
        geo: new THREE.OctahedronGeometry(3.2, 0),
        opacity: 0.04,
        x: 0,
        y: -12,
        z: -12,
        floatSpeed: 0.3,
        floatOffset: 0.5,
        rotX: 0.001,
        rotY: 0.002,
      },
      {
        geo: new THREE.TetrahedronGeometry(1.0, 0),
        opacity: 0.07,
        x: -8,
        y: 13,
        z: -6,
        floatSpeed: 0.65,
        floatOffset: 4.2,
        rotX: 0.005,
        rotY: 0.003,
      },
    ];

    const meshes = configs.map((cfg) => {
      const mat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: cfg.opacity,
      });

      const mesh = new THREE.Mesh(cfg.geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);

      mesh.userData = {
        originY: cfg.y,
        originX: cfg.x,
        floatSpeed: cfg.floatSpeed,
        floatOffset: cfg.floatOffset,
        rotX: cfg.rotX,
        rotY: cfg.rotY,
      };

      scene.add(mesh);
      return mesh;
    });

    let animId: number;
    let elapsed = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      elapsed += clock.getDelta();

      meshes.forEach((mesh) => {
        const ud = mesh.userData;

        mesh.position.y =
          ud.originY +
          Math.sin(elapsed * ud.floatSpeed + ud.floatOffset) * 1.4;

        mesh.position.x =
          ud.originX +
          Math.cos(elapsed * ud.floatSpeed * 0.6 + ud.floatOffset) * 0.8;

        mesh.rotation.x += ud.rotX;
        mesh.rotation.y += ud.rotY;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);

      meshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });

      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-inherit"
    />
  );
};

export default ThreeBackground;