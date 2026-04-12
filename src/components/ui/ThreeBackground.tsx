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

    const style = getComputedStyle(document.documentElement);
    const primaryRaw = style.getPropertyValue("--primary").trim();
    const secondaryRaw = style.getPropertyValue("--secondary").trim();
    const accentRaw = style.getPropertyValue("--accent").trim();

    const primaryColor = new THREE.Color().setStyle(`oklch(${primaryRaw})`);
    const secondaryColor = new THREE.Color().setStyle(`oklch(${secondaryRaw})`);
    const accentColor = new THREE.Color().setStyle(`oklch(${accentRaw})`);

    const palette = [primaryColor, secondaryColor, accentColor];

    interface ShapeConfig {
      geo: THREE.BufferGeometry;
      color: THREE.Color;
      isGlass: boolean;
      opacity: number;
      x: number;
      y: number;
      z: number;
      scale: number;
      floatSpeed: number;
      floatOffset: number;
      rotX: number;
      rotY: number;
      rotZ: number;
    }

    const configs: ShapeConfig[] = [
      {
        geo: new THREE.IcosahedronGeometry(3.2, 1),
        color: primaryColor,
        isGlass: true,
        opacity: 0.18,
        x: -13,
        y: 7,
        z: -4,
        scale: 1,
        floatSpeed: 0.4,
        floatOffset: 0,
        rotX: 0.002,
        rotY: 0.003,
        rotZ: 0.001,
      },
      {
        geo: new THREE.OctahedronGeometry(2.4, 0),
        color: secondaryColor,
        isGlass: true,
        opacity: 0.2,
        x: 13,
        y: -5,
        z: -6,
        scale: 1,
        floatSpeed: 0.35,
        floatOffset: 1.2,
        rotX: 0.003,
        rotY: 0.002,
        rotZ: 0.002,
      },
      {
        geo: new THREE.TetrahedronGeometry(2.0, 0),
        color: accentColor,
        isGlass: true,
        opacity: 0.15,
        x: 15,
        y: 9,
        z: -2,
        scale: 1,
        floatSpeed: 0.55,
        floatOffset: 2.3,
        rotX: 0.004,
        rotY: 0.001,
        rotZ: 0.003,
      },
      {
        geo: new THREE.IcosahedronGeometry(1.6, 0),
        color: primaryColor,
        isGlass: false,
        opacity: 0.12,
        x: -15,
        y: -8,
        z: -1,
        scale: 1,
        floatSpeed: 0.45,
        floatOffset: 3.4,
        rotX: 0.003,
        rotY: 0.004,
        rotZ: 0.001,
      },
      {
        geo: new THREE.OctahedronGeometry(3.8, 0),
        color: secondaryColor,
        isGlass: false,
        opacity: 0.06,
        x: 1,
        y: -13,
        z: -14,
        scale: 1,
        floatSpeed: 0.25,
        floatOffset: 0.7,
        rotX: 0.001,
        rotY: 0.002,
        rotZ: 0.002,
      },
      {
        geo: new THREE.TetrahedronGeometry(1.2, 0),
        color: accentColor,
        isGlass: false,
        opacity: 0.1,
        x: -7,
        y: 14,
        z: -5,
        scale: 1,
        floatSpeed: 0.6,
        floatOffset: 4.5,
        rotX: 0.005,
        rotY: 0.003,
        rotZ: 0.002,
      },
      {
        geo: new THREE.IcosahedronGeometry(0.9, 0),
        color: primaryColor,
        isGlass: true,
        opacity: 0.25,
        x: 6,
        y: 12,
        z: 2,
        scale: 1,
        floatSpeed: 0.7,
        floatOffset: 1.8,
        rotX: 0.006,
        rotY: 0.004,
        rotZ: 0.003,
      },
      {
        geo: new THREE.OctahedronGeometry(1.1, 0),
        color: secondaryColor,
        isGlass: true,
        opacity: 0.22,
        x: -5,
        y: -13,
        z: 3,
        scale: 1,
        floatSpeed: 0.5,
        floatOffset: 5.1,
        rotX: 0.002,
        rotY: 0.005,
        rotZ: 0.002,
      },
    ];

    const solidMeshes: THREE.Mesh[] = [];
    const wireMeshes: THREE.Mesh[] = [];

    configs.forEach((cfg) => {
      const solidMat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.isGlass ? cfg.opacity * 1.5 : cfg.opacity,
        roughness: 0.05,
        metalness: 0.0,
        transmission: cfg.isGlass ? 0.6 : 0.0,
        thickness: 1.5,
        side: THREE.FrontSide,
        depthWrite: false,
      });

      const wireMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: cfg.isGlass ? 0.35 : 0.15,
      });

      const solid = new THREE.Mesh(cfg.geo.clone(), solidMat);
      const wire = new THREE.Mesh(cfg.geo.clone(), wireMat);

      const userData = {
        originY: cfg.y,
        originX: cfg.x,
        floatSpeed: cfg.floatSpeed,
        floatOffset: cfg.floatOffset,
        rotX: cfg.rotX,
        rotY: cfg.rotY,
        rotZ: cfg.rotZ,
      };

      solid.position.set(cfg.x, cfg.y, cfg.z);
      wire.position.set(cfg.x, cfg.y, cfg.z);
      solid.userData = userData;
      wire.userData = userData;

      scene.add(solid);
      scene.add(wire);
      solidMeshes.push(solid);
      wireMeshes.push(wire);
    });

    const particleCount = 180;
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
      particleSpeeds[i] = 0.2 + Math.random() * 0.5;
      particleOffsets[i] = Math.random() * Math.PI * 2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: primaryColor,
      size: 0.12,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const linePositions: number[] = [];
    const lineColors: number[] = [];

    for (let i = 0; i < configs.length; i++) {
      for (let j = i + 1; j < configs.length; j++) {
        const dist = new THREE.Vector3(
          configs[i].x - configs[j].x,
          configs[i].y - configs[j].y,
          configs[i].z - configs[j].z
        ).length();

        if (dist < 22) {
          linePositions.push(configs[i].x, configs[i].y, configs[i].z);
          linePositions.push(configs[j].x, configs[j].y, configs[j].z);
          lineColors.push(...palette[i % 3].toArray(), ...palette[j % 3].toArray());
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(lineColors), 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(primaryColor, 3, 60);
    light1.position.set(-10, 10, 15);
    scene.add(light1);

    const light2 = new THREE.PointLight(accentColor, 2, 50);
    light2.position.set(10, -8, 10);
    scene.add(light2);

    const light3 = new THREE.PointLight(secondaryColor, 2, 50);
    light3.position.set(0, 5, -5);
    scene.add(light3);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      targetMouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    mount.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    let elapsed = 0;
    const clock = new THREE.Clock();
    const posArr = particleGeo.attributes.position.array as Float32Array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += delta;

      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;

      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      solidMeshes.forEach((mesh) => {
        const ud = mesh.userData;
        mesh.position.y = ud.originY + Math.sin(elapsed * ud.floatSpeed + ud.floatOffset) * 1.6;
        mesh.position.x = ud.originX + Math.cos(elapsed * ud.floatSpeed * 0.5 + ud.floatOffset) * 0.9;
        mesh.rotation.x += ud.rotX;
        mesh.rotation.y += ud.rotY;
        mesh.rotation.z += ud.rotZ;
      });

      wireMeshes.forEach((mesh, i) => {
        const solid = solidMeshes[i];
        mesh.position.copy(solid.position);
        mesh.rotation.copy(solid.rotation);
      });

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += Math.sin(elapsed * particleSpeeds[i] + particleOffsets[i]) * 0.008;
        posArr[i * 3] += Math.cos(elapsed * particleSpeeds[i] * 0.7 + particleOffsets[i]) * 0.004;
      }
      particleGeo.attributes.position.needsUpdate = true;

      light1.position.x = Math.sin(elapsed * 0.3) * 12;
      light1.position.y = Math.cos(elapsed * 0.2) * 8;
      light2.position.x = Math.cos(elapsed * 0.25) * 10;
      light2.position.z = Math.sin(elapsed * 0.35) * 8 + 10;

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
      mount.removeEventListener("mousemove", handleMouseMove);

      solidMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      wireMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });

      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
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