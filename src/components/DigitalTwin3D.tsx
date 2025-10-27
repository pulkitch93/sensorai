import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Asset } from "@/types/asset";

interface DigitalTwin3DProps {
  assets: Asset[];
  onAssetClick: (assetId: string) => void;
}

export const DigitalTwin3D = ({ assets, onAssetClick }: DigitalTwin3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const assetMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    scene.fog = new THREE.Fog(0x0d1117, 30, 80);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 35);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x4080ff, 0.5);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    // Floor grid
    const gridHelper = new THREE.GridHelper(60, 20, 0x00bfff, 0x1a2332);
    scene.add(gridHelper);

    // Floor plane
    const floorGeometry = new THREE.PlaneGeometry(60, 60);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0f1419,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create assets
    assets.forEach((asset) => {
      const geometry = new THREE.BoxGeometry(4, 6, 4);
      
      let color: number;
      let emissive: number;
      switch (asset.status) {
        case 'healthy':
          color = 0x10b981;
          emissive = 0x10b981;
          break;
        case 'warning':
          color = 0xf59e0b;
          emissive = 0xf59e0b;
          break;
        case 'critical':
          color = 0xef4444;
          emissive = 0xef4444;
          break;
        default:
          color = 0x6b7280;
          emissive = 0x6b7280;
      }

      const material = new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: 0.2,
        roughness: 0.4,
        metalness: 0.6,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(asset.location.x, 3, asset.location.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { assetId: asset.id };

      scene.add(mesh);
      assetMeshesRef.current.set(asset.id, mesh);

      // Add label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 512;
      canvas.height = 128;
      context.fillStyle = '#0d1117';
      context.fillRect(0, 0, 512, 128);
      context.font = 'bold 48px Arial';
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.fillText(asset.name, 256, 70);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(asset.location.x, 8, asset.location.z);
      sprite.scale.set(8, 2, 1);
      scene.add(sprite);
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        Array.from(assetMeshesRef.current.values())
      );

      if (intersects.length > 0) {
        const assetId = intersects[0].object.userData.assetId;
        setSelectedAsset(assetId);
        onAssetClick(assetId);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation
    let angle = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      // Gentle camera orbit
      angle += 0.001;
      camera.position.x = Math.sin(angle) * 35;
      camera.position.z = Math.cos(angle) * 35;
      camera.lookAt(0, 0, 0);

      // Pulse selected asset
      if (selectedAsset) {
        const mesh = assetMeshesRef.current.get(selectedAsset);
        if (mesh && mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [assets, selectedAsset, onAssetClick]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden border border-border" />
  );
};
