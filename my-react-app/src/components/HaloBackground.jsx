import { useEffect, useRef } from "react";
import * as THREE from "three";
import HALO from "vanta/dist/vanta.halo.min";

export default function HaloBox({
  width = 300,
  height = 300,
  baseColor = 0x2979ff,
  className = "",
}) {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      vantaEffect.current = HALO({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        baseColor,
        backgroundColor: 0x00000000, // прозрачный фон
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [baseColor]);

  return (
    <div
      ref={vantaRef}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}
