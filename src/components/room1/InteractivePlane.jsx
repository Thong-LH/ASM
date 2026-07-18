import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { TransformControls, useTexture } from '@react-three/drei';
import { Vector3, RepeatWrapping } from 'three';

// Component chứa vật thể tương tác 2D
function InteractivePlane({
  id,
  imageUrl,
  position,
  scale,
  isSelected,
  onSelect,
  isEditMode,
  transformMode,
  onUpdateTransform,
  chatOpen
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Tính toán scale tuyệt đối (luôn dương) để tránh culling mặt trong ThreeJS
  const absScale = [Math.abs(scale[0]), scale[1], scale[2]];
  const isFlipped = scale[0] < 0;

  // Nạp texture của ảnh vật phẩm
  const baseTexture = useTexture(imageUrl);

  // Tạo texture riêng biệt cho từng đối tượng và tự động lật UV (mirror) nếu scale X âm
  const texture = React.useMemo(() => {
    if (!baseTexture) return null;
    const tex = baseTexture.clone();
    if (isFlipped) {
      tex.wrapS = RepeatWrapping;
      tex.repeat.x = -1;
      tex.offset.x = 1;
    } else {
      tex.repeat.x = 1;
      tex.offset.x = 0;
    }
    tex.needsUpdate = true;
    return tex;
  }, [baseTexture, isFlipped]);

  // Hiệu ứng Hover dạng Lerp (Mượt mà như lò xo - Spring)
  useFrame(() => {
    if (meshRef.current && !isEditMode) {
      const targetScaleFactor = (hovered && !chatOpen) ? 1.05 : 1.0;
      const targetScale = new Vector3(
        absScale[0] * targetScaleFactor,
        absScale[1] * targetScaleFactor,
        absScale[2]
      );
      meshRef.current.scale.lerp(targetScale, 0.15);
    }
  });

  // Thay đổi cursor chuột khi hover
  useEffect(() => {
    if (hovered && !isEditMode && !chatOpen) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, isEditMode, chatOpen]);

  // Xử lý sự kiện kéo thả & co giãn trong Edit Mode
  const handleObjectChange = () => {
    if (meshRef.current) {
      const pos = meshRef.current.position;
      const scl = meshRef.current.scale;

      const originalSignX = Math.sign(scale[0]);
      const roundedPos = [
        Math.round(pos.x * 100) / 100,
        Math.round(pos.y * 100) / 100,
        Math.round(pos.z * 100) / 100
      ];
      const roundedScale = [
        Math.round(scl.x * originalSignX * 100) / 100,
        Math.round(scl.y * 100) / 100,
        Math.round(scl.z * 100) / 100
      ];
      onUpdateTransform(id, roundedPos, roundedScale);
    }
  };

  return (
    <group>
      <Suspense fallback={
        <mesh position={position} scale={absScale}>
          <planeGeometry />
          <meshBasicMaterial color="#ff5e3a" transparent opacity={0.2} />
        </mesh>
      }>
        <mesh
          ref={meshRef}
          position={position}
          scale={absScale}
          onClick={(e) => {
            e.stopPropagation();
            if (!isEditMode && !chatOpen) onSelect(id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (!isEditMode && !chatOpen) setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            if (!isEditMode && !chatOpen) setHovered(false);
          }}
        >
          <planeGeometry />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      </Suspense>

      {/* Widget hỗ trợ kéo thả & co giãn vật thể trong chế độ Edit Mode */}
      {isEditMode && (
        <TransformControls
          object={meshRef}
          mode={transformMode}
          showZ={false}
          onObjectChange={handleObjectChange}
        />
      )}
    </group>
  );
}

export default InteractivePlane;
