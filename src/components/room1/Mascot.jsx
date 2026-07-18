import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Vector3, RepeatWrapping } from 'three';
import gsap from 'gsap';

// Component Trợ lý Robot bay 3D với hiệu ứng Sprite Sheet & Đồng hành
function Mascot({ selectedObjectId, roomData, mascotState, onMascotClick, isEditMode }) {
  const spriteRef = useRef();

  // Nạp 4 bộ hình ảnh Sprite Sheet cho 4 trạng thái
  const textureIdle = useTexture('/assets/mascot_idle.png');
  const textureWelcome = useTexture('/assets/mascot_welcome.png');
  const textureThinking = useTexture('/assets/mascot_thinking.png');
  const texturePointing = useTexture('/assets/mascot_pointing.png');

  // Khai báo số lượng khung hình của từng tệp Sprite Sheet nằm ngang
  const config = {
    idle: 8,
    welcome: 13,
    thinking: 8,
    pointing: 7
  };

  // Xác định hướng nhìn mong muốn của Robot
  const desiredFacing = useMemo(() => {
    return selectedObjectId === 'obj_loa' ? 'left' : 'right';
  }, [selectedObjectId]);

  // welcome có mặc định hướng Trái (cần lật để hướng Phải). Các động tác còn lại mặc định hướng Phải
  const isIdleFlipped = desiredFacing === 'left';
  const isWelcomeFlipped = desiredFacing === 'right';
  const isThinkingFlipped = desiredFacing === 'left';
  const isPointingFlipped = desiredFacing === 'left';

  // Cấu hình lặp lại texture cho cả 4 ảnh ngang
  useEffect(() => {
    const multIdle = isIdleFlipped ? -1 : 1;
    const multWelcome = isWelcomeFlipped ? -1 : 1;
    const multThinking = isThinkingFlipped ? -1 : 1;
    const multPointing = isPointingFlipped ? -1 : 1;

    if (textureIdle) {
      textureIdle.wrapS = RepeatWrapping;
      textureIdle.repeat.set(multIdle * (1 / config.idle), 1);
    }
    if (textureWelcome) {
      textureWelcome.wrapS = RepeatWrapping;
      textureWelcome.repeat.set(multWelcome * (1 / config.welcome), 1);
    }
    if (textureThinking) {
      textureThinking.wrapS = RepeatWrapping;
      textureThinking.repeat.set(multThinking * (1 / config.thinking), 1);
    }
    if (texturePointing) {
      texturePointing.wrapS = RepeatWrapping;
      texturePointing.repeat.set(multPointing * (1 / config.pointing), 1);
    }
  }, [textureIdle, textureWelcome, textureThinking, texturePointing, desiredFacing]);

  // Vị trí bến đậu mặc định ở góc phải dưới
  const defaultPos = new Vector3(2.2, -0.5, 0.6);

  const stateStartTimeRef = useRef(null);

  // Khi đổi trạng thái Mascot, reset mốc thời gian bắt đầu
  useEffect(() => {
    stateStartTimeRef.current = null;
  }, [mascotState]);

  useFrame((state) => {
    if (!spriteRef.current) return;
    const time = state.clock.getElapsedTime();

    if (stateStartTimeRef.current === null) {
      stateStartTimeRef.current = time;
    }

    const elapsed = time - stateStartTimeRef.current;

    // 1. Hiệu ứng nhấp nhô lơ lửng tự nhiên
    spriteRef.current.position.y += Math.sin(time * 2.5) * 0.0015;

    // 2. Chạy hoạt ảnh dừng ở khung hình cuối cùng (Không lặp lại)
    const currentFrame = Math.floor(elapsed * 10);

    if (textureIdle) {
      if (mascotState === 'idle') {
        const idx = currentFrame < 6 ? (currentFrame + 2) % 8 : 0;
        textureIdle.offset.x = isIdleFlipped ? (idx + 1) / 8 : idx / 8;
      } else {
        textureIdle.offset.x = isIdleFlipped ? 1 / 8 : 0;
      }
    }
    if (textureWelcome) {
      if (mascotState === 'welcome') {
        const idx = Math.min(currentFrame, 12);
        textureWelcome.offset.x = isWelcomeFlipped ? (idx + 1) / 13 : idx / 13;
      } else {
        textureWelcome.offset.x = isWelcomeFlipped ? 1 / 13 : 0;
      }
    }
    if (textureThinking) {
      if (mascotState === 'thinking') {
        const idx = Math.min(currentFrame, 7);
        textureThinking.offset.x = isThinkingFlipped ? (idx + 1) / 8 : idx / 8;
      } else {
        textureThinking.offset.x = isThinkingFlipped ? 1 / 8 : 0;
      }
    }
    if (texturePointing) {
      if (mascotState === 'pointing') {
        const idx = Math.min(currentFrame, 6);
        texturePointing.offset.x = isPointingFlipped ? (idx + 1) / 7 : idx / 7;
      } else {
        texturePointing.offset.x = isPointingFlipped ? 1 / 7 : 0;
      }
    }
  });

  // Di chuyển mượt mà Mascot đến gần hiện vật đang chọn
  useEffect(() => {
    if (!spriteRef.current) return;

    let targetX = defaultPos.x;
    let targetY = defaultPos.y;
    let targetZ = defaultPos.z;

    if (selectedObjectId) {
      const activeObject = roomData.interactive_objects.find(obj => obj.id === selectedObjectId);
      if (activeObject) {
        const isLoa = activeObject.id === 'obj_loa';
        targetX = activeObject.position[0] + (isLoa ? 0.55 : -0.55);
        targetY = activeObject.position[1] + 0.2;
        targetZ = activeObject.position[2] + 0.15;
      }
    }

    gsap.killTweensOf(spriteRef.current.position);
    gsap.to(spriteRef.current.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 1.2,
      ease: 'power2.out'
    });
  }, [selectedObjectId, roomData]);

  return (
    <group>
      <group
        ref={spriteRef}
        position={[defaultPos.x, defaultPos.y, defaultPos.z]}
        onClick={(e) => {
          e.stopPropagation();
          if (!selectedObjectId && !isEditMode) {
            onMascotClick();
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!selectedObjectId && !isEditMode) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      >
        <sprite scale={[0.65, 0.65, 1]} visible={mascotState === 'idle'}>
          <spriteMaterial map={textureIdle} transparent={true} toneMapped={false} depthWrite={false} />
        </sprite>
        <sprite scale={[0.65, 0.65, 1]} visible={mascotState === 'welcome'}>
          <spriteMaterial map={textureWelcome} transparent={true} toneMapped={false} depthWrite={false} />
        </sprite>
        <sprite scale={[0.65, 0.65, 1]} visible={mascotState === 'thinking'}>
          <spriteMaterial map={textureThinking} transparent={true} toneMapped={false} depthWrite={false} />
        </sprite>
        <sprite scale={[0.65, 0.65, 1]} visible={mascotState === 'pointing'}>
          <spriteMaterial map={texturePointing} transparent={true} toneMapped={false} depthWrite={false} />
        </sprite>
      </group>
    </group>
  );
}

export default Mascot;
