import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

// 牛油灯组件
export default function ButterLamp({ onClick }) {
  // 灯光和火焰动画引用
  const lightRef = useRef();
  const flame1Ref = useRef();
  const flame2Ref = useRef();
  const flame3Ref = useRef();
  const sparkleRefs = useRef([]);
  const [isOn, setIsOn] = useState(true);
  const [flameIntensity, setFlameIntensity] = useState(1);

  // 闪烁装饰粒子位置
  const sparklePositions = [
    [0.8, 0.3, 0.2],
    [-0.7, 0.5, 0.3],
    [0.5, -0.2, 0.6],
    [-0.6, 0.2, -0.4],
    [0.9, 0.6, -0.2],
    [-0.8, 0.4, 0.5],
    [0.4, 0.7, 0.7],
    [-0.5, -0.1, 0.8],
    [0.6, 0.4, -0.6],
    [-0.9, 0.6, -0.3],
    [0.3, -0.3, -0.7],
    [-0.4, 0.1, 0.9],
  ];

  // 点击处理函数
  const handleClick = (e) => {
    e.stopPropagation();
    if (isOn) {
      // 熄灭动画
      setFlameIntensity(0);
      setTimeout(() => setIsOn(false), 300);
    } else {
      // 点燃动画
      setIsOn(true);
      setFlameIntensity(1);
    }
    if (onClick) onClick();
  };

  // 计算火焰透明度 - 外层暗，内层亮
  const getFlameOpacity = (index, total) => {
    if (!isOn) return 0;
    // 从外到内透明度递增：0.3 -> 0.5 -> 0.7 -> 0.85 -> 0.95 -> 1.0
    const baseOpacity = 0.25 + (index / total) * 0.75;
    return baseOpacity * flameIntensity;
  };

  // 火焰和灯光动画
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 灯光闪烁效果
    if (lightRef.current) {
      if (isOn) {
        lightRef.current.intensity = 3 + Math.sin(time * 6) * 0.8;
      } else {
        lightRef.current.intensity = 0;
      }
    }

    // 最外层火焰动画
    if (flame1Ref.current) {
      flame1Ref.current.scale.x = 1 + Math.sin(time * 8) * 0.2;
      flame1Ref.current.scale.z = 1 + Math.sin(time * 7) * 0.18;
      flame1Ref.current.rotation.y = Math.sin(time * 3) * 0.1;
      flame1Ref.current.scale.y = 0.3 + flameIntensity * 0.7;
    }

    // 中层火焰动画
    if (flame2Ref.current) {
      flame2Ref.current.scale.x = 1 + Math.sin(time * 9) * 0.15;
      flame2Ref.current.scale.z = 1 + Math.sin(time * 8) * 0.12;
      flame2Ref.current.rotation.y = Math.sin(time * 4) * 0.08;
      flame2Ref.current.scale.y = 0.3 + flameIntensity * 0.7;
    }

    // 内层火焰动画
    if (flame3Ref.current) {
      flame3Ref.current.scale.x = 1 + Math.sin(time * 10) * 0.1;
      flame3Ref.current.scale.z = 1 + Math.sin(time * 9) * 0.08;
      flame3Ref.current.scale.y = 0.3 + flameIntensity * 0.7;
    }

    // 闪烁装饰动画
    sparkleRefs.current.forEach((ref, i) => {
      if (ref) {
        const phase = i * 0.5;
        const scale = isOn ? 0.3 + Math.sin(time * 3 + phase) * 0.3 : 0;
        ref.scale.set(scale, scale, scale);
        ref.material.opacity = isOn
          ? 0.3 + Math.sin(time * 4 + phase) * 0.4
          : 0;
      }
    });
  });

  return (
    <group position={[0, 0, 0]} onClick={handleClick}>
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
          emissiveIntensity={isOn ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.6}
        />
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

      {/* 灯芯 - 深棕色小圆柱，从牛油表面延伸到容器外 */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.012, 0.015, 0.78, 8]} />
        <meshStandardMaterial color="#2d181086" roughness={0.5} />
      </mesh>

      {/* 最外层火焰 - 深红色，燃烧在容器上方 */}
      <mesh ref={flame1Ref} position={[0, 0.63, 0]}>
        <coneGeometry args={[0.08, 0.28, 16]} />
        <meshBasicMaterial
          color="#ff2200"
          transparent
          opacity={getFlameOpacity(0, 5)}
        />
      </mesh>

      {/* 第二层火焰 - 橙色 */}
      <mesh ref={flame2Ref} position={[0, 0.61, 0]}>
        <coneGeometry args={[0.06, 0.24, 16]} />
        <meshBasicMaterial
          color="#ff5500"
          transparent
          opacity={getFlameOpacity(1, 5)}
        />
      </mesh>

      {/* 第三层火焰 - 橙黄色 */}
      <mesh ref={flame3Ref} position={[0, 0.59, 0]}>
        <coneGeometry args={[0.04, 0.18, 16]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={getFlameOpacity(2, 5)}
        />
      </mesh>

      {/* 第四层火焰 - 黄色 */}
      <mesh position={[0, 0.57, 0]}>
        <coneGeometry args={[0.025, 0.12, 12]} />
        <meshBasicMaterial
          color="#ffbb00"
          transparent
          opacity={getFlameOpacity(3, 5)}
        />
      </mesh>

      {/* 第五层火焰 - 亮黄色 */}
      <mesh position={[0, 0.57, 0]}>
        <coneGeometry args={[0.015, 0.08, 8]} />
        <meshBasicMaterial
          color="#ffee00"
          transparent
          opacity={getFlameOpacity(4, 5)}
        />
      </mesh>

      {/* 第六层火焰 - 白色火芯 */}
      <mesh position={[0, 0.56, 0]}>
        <coneGeometry args={[0.006, 0.04, 6]} />
        <meshBasicMaterial
          color="#ffffcc"
          transparent
          opacity={getFlameOpacity(5, 5)}
        />
      </mesh>

      {/* 闪烁装饰粒子 */}
      {sparklePositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (sparkleRefs.current[i] = el)}
          position={pos}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ffffaa" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* 点光源 - 模拟烛光 */}
      <pointLight
        ref={lightRef}
        position={[0, 0.65, 0]}
        intensity={3}
        color="#ffaa33"
        distance={4}
      />

      {/* 最底部底座 */}
      <mesh position={[0, -0.43, 0]}>
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
