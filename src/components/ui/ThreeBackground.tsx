import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  className?: string;
  gridColor?: string;
  particleColor?: string;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  className = "",
  gridColor = "#10b981", // Emerald 500
  particleColor = "#3b82f6", // Blue 500
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 1. Cadastral Land 3D Wireframe Grid Plane
    const gridGeometry = new THREE.PlaneGeometry(60, 60, 40, 40);
    const posAttribute = gridGeometry.attributes.position;

    // Displace vertices to create subtle undulating land terrain
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const z = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 1.8;
      posAttribute.setZ(i, z);
    }
    gridGeometry.computeVertexNormals();

    const gridMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(gridColor),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2.2;
    scene.add(gridMesh);

    // 2. Floating Land GIS Data Particles
    const particlesCount = 200;
    const particlePositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 50;
      particlePositions[i + 1] = Math.random() * 15;
      particlePositions[i + 2] = (Math.random() - 0.5) * 50;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(particleColor),
      size: 0.25,
      transparent: true,
      opacity: 0.7,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Lighting
    const pointLight = new THREE.PointLight(0x10b981, 2, 50);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate terrain grid & wave movement
      gridMesh.rotation.z = elapsedTime * 0.03;
      particleSystem.rotation.y = elapsedTime * 0.05;

      // Parallax smooth camera shift
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 3 + 15 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      gridGeometry.dispose();
      gridMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [gridColor, particleColor]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};

export default ThreeBackground;
