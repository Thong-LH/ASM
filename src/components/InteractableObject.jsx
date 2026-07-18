import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Edges } from '@react-three/drei';
import * as THREE from 'three';

// Boundary bắt lỗi nạp ảnh để chuyển sang hiển thị Card Neon fallback
class ImageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Không log tràn lan ra console
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Component render ảnh cắt nền thực tế dùng Drei Image
function CutoutImage({ url, hovered, isSelected }) {
  const imageRef = useRef();

  // Tween nhẹ màu sắc hoặc độ trong suốt của ảnh bằng GSAP hoặc qua state
  // Ở đây Drei Image hỗ trợ thuộc tính color (RGB tint) và opacity
  const tintColor = isSelected ? '#ffffff' : (hovered ? '#ffe5df' : '#ffffff');
  
  // Tự động scale nhịp thở nhẹ nếu vật phẩm đang được chọn
  useFrame((state) => {
    if (isSelected && imageRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(elapsed * 2) * 0.02;
      imageRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      <Image
        ref={imageRef}
        url={url}
        transparent
        color={tintColor}
        opacity={1}
      />
      {/* Vẽ viền sáng tinh tế xung quanh ảnh khi hover hoặc selected */}
      {(hovered || isSelected) && (
        <mesh>
          <planeGeometry args={[1.05, 1.05]} />
          <meshBasicMaterial color={isSelected ? '#ff5e3a' : '#ff7a5a'} transparent opacity={0.2} />
          <Edges color={isSelected ? '#ff5e3a' : '#ff7a5a'} lineWidth={2} />
        </mesh>
      )}
    </group>
  );
}

// Bounding Box Neon nghệ thuật làm fallback cho ảnh 2D
function NeonFallbackCard({ hovered, isSelected }) {
  const cardRef = useRef();

  useFrame((state) => {
    if (cardRef.current) {
      // Xoay nhẹ góc nghiêng để tạo cảm giác không gian
      cardRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
      cardRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.5) * 0.08;

      // Pulse nhẹ theo nhịp
      const elapsed = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.03;
      cardRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const neonColor = isSelected ? '#ff5e3a' : (hovered ? '#ff7a5a' : '#00e5ff');
  const emissiveColor = isSelected ? '#ff5e3a' : (hovered ? '#ff7a5a' : '#007b8b');
  const opacity = hovered ? 0.35 : 0.15;

  return (
    <mesh ref={cardRef}>
      {/* Tấm phẳng tượng trưng cho tỷ lệ ảnh 2D */}
      <planeGeometry args={[1.0, 1.0]} />
      
      <meshStandardMaterial 
        color={hovered ? '#ff5e3a' : '#151b26'} 
        transparent 
        opacity={opacity} 
        roughness={0.2}
        metalness={0.8}
        emissive={emissiveColor}
        emissiveIntensity={hovered ? 1.2 : 0.3}
        side={THREE.DoubleSide}
      />

      <Edges
        threshold={15}
        color={neonColor}
        lineWidth={3.0}
      />
    </mesh>
  );
}

export default function InteractableObject({ 
  id, 
  imageUrl, 
  position, 
  scale, 
  rotation, 
  onClick, 
  isSelected 
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();

  // Reset pointer khi unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Tính toán scale tổng thể dựa trên hover và selected
  const activeScale = [
    scale[0] * (isSelected ? 1.05 : (hovered ? 1.08 : 1.0)),
    scale[1] * (isSelected ? 1.05 : (hovered ? 1.08 : 1.0)),
    scale[2]
  ];

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={activeScale}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <ImageErrorBoundary 
        fallback={
          <NeonFallbackCard 
            hovered={hovered} 
            isSelected={isSelected} 
          />
        }
      >
        <CutoutImage 
          url={imageUrl} 
          isSelected={isSelected}
          hovered={hovered} 
        />
      </ImageErrorBoundary>
    </group>
  );
}
