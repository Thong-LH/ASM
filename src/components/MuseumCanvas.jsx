import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import MuseumScene from './MuseumScene';

export default function MuseumCanvas({ roomData, selectedObjectId, onSelectObject }) {
  const { camera_initial, objects, background } = roomData;

  return (
    <div className="canvas-container">
      <Canvas
        camera={{
          position: camera_initial.position,
          fov: camera_initial.fov,
          near: 0.1,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
        // Nhận diện click chuột ra khoảng không để reset camera
        onPointerMissed={() => onSelectObject(null)}
      >
        {/* Ánh sáng dịu nhẹ bao trùm */}
        <ambientLight intensity={0.6} />
        
        {/* Ánh sáng chính tạo khối đổ bóng */}
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow
        />
        
        {/* Ánh sáng phụ tạo chiều sâu màu sắc */}
        <pointLight 
          position={[-4, 3, -2]} 
          intensity={0.6} 
          color="#ff7a5a" 
        />
        <pointLight 
          position={[4, -2, 2]} 
          intensity={0.4} 
          color="#00ffff" 
        />

        <Suspense fallback={null}>
          <MuseumScene
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={onSelectObject}
            cameraInitial={camera_initial}
            background={background}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
