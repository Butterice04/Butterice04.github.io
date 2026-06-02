import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ButterLamp from "./components/ButterLamp";
import Particle from "./components/Particle";

const wishes = [
  "愿你平安喜乐",
  "愿你心想事成",
  "愿你万事如意",
  "愿你福寿安康",
  "愿你前程似锦",
  "愿你喜乐安宁",
  "愿你阖家幸福",
  "愿你梦想成真",
  "愿你顺风顺水",
  "愿你笑口常开",
];

function App() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("butterLampCount");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [particles, setParticles] = useState([]);
  const [showWish, setShowWish] = useState(false);
  const [currentWish, setCurrentWish] = useState("");
  const lastClickTime = useRef(0);

  useEffect(() => {
    localStorage.setItem("butterLampCount", count.toString());
  }, [count]);

  const handleClick = (event) => {
    const now = Date.now();
    if (now - lastClickTime.current < 200) return;
    lastClickTime.current = now;

    setCount((prev) => prev + 1);

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 50,
      y: y + (Math.random() - 0.5) * 30,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
      );
    }, 3000);

    if (count > 0 && count % 10 === 0) {
      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      setCurrentWish(randomWish);
      setShowWish(true);
      setTimeout(() => setShowWish(false), 3000);
    }
  };

  const closeWish = () => {
    setShowWish(false);
  };

  return (
    <div className="lamp-container" onClick={handleClick}>
      <div className="lamp-title">🕯️ 电子牛油灯 🕯️</div>

      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 1, 5], fov: 50 }}
          style={{ background: "#1a1a2e" }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 3, 2]} intensity={1} color="#ffffff" />
          <pointLight position={[-2, 2, -2]} intensity={0.5} color="#ffd700" />
          <ButterLamp />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

      <div className="lamp-counter">{count}</div>
      <div className="lamp-hint">点击牛油灯祈福</div>

      <div className="lamp-particles">
        {particles.map((particle) => (
          <Particle key={particle.id} x={particle.x} y={particle.y} />
        ))}
      </div>

      {showWish && (
        <div className="wish-modal">
          <div className="wish-text">{currentWish}</div>
          <div className="wish-count">祈福次数: {count}</div>
          <button className="wish-close" onClick={closeWish}>
            收到祝福
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
