import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// 牛油灯组件
export default function ButterLamp() {
  // 灯光和火焰动画引用
  const lightRef = useRef();
  const flame1Ref = useRef();
  const flame2Ref = useRef();
  const flame3Ref = useRef();

  // 火焰和灯光动画
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 灯光闪烁效果
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(time * 6) * 0.8;
    }

    // 最外层火焰动画
    if (flame1Ref.current) {
      flame1Ref.current.scale.x = 1 + Math.sin(time * 8) * 0.2;
      flame1Ref.current.scale.z = 1 + Math.sin(time * 7) * 0.18;
      flame1Ref.current.rotation.y = Math.sin(time * 3) * 0.1;
    }

    // 中层火焰动画
    if (flame2Ref.current) {
      flame2Ref.current.scale.x = 1 + Math.sin(time * 9) * 0.15;
      flame2Ref.current.scale.z = 1 + Math.sin(time * 8) * 0.12;
      flame2Ref.current.rotation.y = Math.sin(time * 4) * 0.08;
    }

    // 内层火焰动画
    if (flame3Ref.current) {
      flame3Ref.current.scale.x = 1 + Math.sin(time * 10) * 0.1;
      flame3Ref.current.scale.z = 1 + Math.sin(time * 9) * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 底部金属底座 */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 0.1, 32]} />
        <meshStandardMaterial color="#daa520" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 牛油表面 - 金色圆盘模拟蜡烛融化表面 */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ff6600"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* 灯芯 - 深棕色小圆柱 */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.7, 8]} />
        <meshStandardMaterial color="#2d181086" roughness={0.5} />
      </mesh>

      {/* 最外层火焰 - 深红色 */}
      <mesh ref={flame1Ref} position={[0, 0.35, 0]}>
        <coneGeometry args={[0.3, 0.7, 32]} />
        <meshBasicMaterial color="#a6ff00" transparent opacity={1} />
      </mesh>

      {/* 第二层火焰 - 橙色 */}
      <mesh ref={flame2Ref} position={[0, 0.33, 0]}>
        <coneGeometry args={[0.08, 0.28, 16]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.98} />
      </mesh>

      {/* 第三层火焰 - 橙黄色 */}
      <mesh ref={flame3Ref} position={[0, 0.31, 0]}>
        <coneGeometry args={[0.06, 0.22, 16]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.95} />
      </mesh>

      {/* 第四层火焰 - 黄色 */}
      <mesh position={[0, 0.29, 0]}>
        <coneGeometry args={[0.04, 0.15, 12]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.95} />
      </mesh>

      {/* 第五层火焰 - 亮黄色 */}
      <mesh position={[0, 0.27, 0]}>
        <coneGeometry args={[0.02, 0.08, 8]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.98} />
      </mesh>

      {/* 第六层火焰 - 白色火芯 */}
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.01, 0.04, 6]} />
        <meshBasicMaterial color="#ffffaa" transparent opacity={1} />
      </mesh>

      {/* 透明玻璃容器 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 1.0, 32]} />
        <meshPhysicalMaterial
          color="#fffaf0"
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0}
          transmission={0.85}
          thickness={0.3}
        />
      </mesh>

      {/* 点光源 - 模拟烛光 */}
      <pointLight
        ref={lightRef}
        position={[0, 0.35, 0]}
        intensity={3}
        color="#ffaa33"
        distance={4}
      />

      {/* 最底部底座 */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.1, 32]} />
        <meshStandardMaterial
          color="#daa520"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}
