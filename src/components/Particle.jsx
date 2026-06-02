import React from "react";

function Particle({ x, y }) {
  return (
    <div
      className="particle"
      style={{
        left: x,
        top: y,
      }}
    />
  );
}

export default Particle;
