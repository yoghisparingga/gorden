/* =========================================================================
 * Curtain.jsx — Satu panel gorden 3D: lipatan kain + animasi tertiup angin
 * ========================================================================= */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Curtain({
  side = "left",
  winW,
  winH,
  sill,
  openness,
  texture,
  opacity = 1,
  z = 0,
  breeze = true,
}) {
  const meshRef = useRef();

  // Dimensi panel berdasarkan buka/tutup
  const dims = useMemo(() => {
    const halfWin = winW / 2 + 0.06;
    const panelW = THREE.MathUtils.lerp(halfWin, halfWin * 0.32, openness);
    const height = winH + 0.28;
    const top = sill + winH + 0.14;
    const centerY = top - height / 2;
    const centerX = side === "left" ? -halfWin + panelW / 2 : halfWin - panelW / 2;
    const foldCount = Math.max(4, Math.round(panelW * 7));
    const foldAmp = THREE.MathUtils.lerp(0.05, 0.14, openness);
    return { panelW, height, centerX, centerY, foldCount, foldAmp };
  }, [winW, winH, sill, openness, side]);

  // Geometri dengan lipatan (displacement z)
  const geometry = useMemo(() => {
    const { panelW, height, foldCount, foldAmp } = dims;
    const segX = THREE.MathUtils.clamp(Math.round(panelW * 24), 10, 64);
    const segY = 18;
    const geo = new THREE.PlaneGeometry(panelW, height, segX, segY);
    const pos = geo.attributes.position;
    const n = pos.count;
    const baseZ = new Float32Array(n);
    const uArr = new Float32Array(n);
    const vw = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = x / panelW + 0.5; // 0..1
      const fold = Math.sin(u * foldCount * Math.PI * 2) * foldAmp;
      // sedikit melengkung ke dalam di tepi
      const edge = Math.cos((u - 0.5) * Math.PI) * 0.02;
      const zz = fold - edge;
      baseZ[i] = zz;
      uArr[i] = u;
      vw[i] = (height / 2 - y) / height; // 0 atas → 1 bawah
      pos.setZ(i, zz);
    }
    geo.userData = { baseZ, uArr, vw, foldCount };
    geo.computeVertexNormals();
    return geo;
  }, [dims]);

  // Repeat tekstur sesuai ukuran panel
  const tex = useMemo(() => {
    if (!texture) return null;
    texture.repeat.set(
      Math.max(1, Math.round(dims.panelW / 0.6)),
      Math.max(1, Math.round(dims.height / 0.6))
    );
    texture.needsUpdate = true;
    return texture;
  }, [texture, dims]);

  // Animasi angin
  useFrame(({ clock }) => {
    if (!breeze || !meshRef.current) return;
    const geo = meshRef.current.geometry;
    const { baseZ, uArr, vw, foldCount } = geo.userData;
    const pos = geo.attributes.position;
    const t = clock.getElapsedTime();
    const amp = 0.035 + openness * 0.03;
    for (let i = 0; i < pos.count; i++) {
      const sway = Math.sin(uArr[i] * foldCount * 1.3 + t * 1.6) * amp * vw[i];
      pos.setZ(i, baseZ[i] + sway);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[dims.centerX, dims.centerY, z]} castShadow>
      <meshPhysicalMaterial
        map={tex}
        color="#ffffff"
        roughness={0.85}
        metalness={0}
        sheen={0.6}
        sheenRoughness={0.75}
        sheenColor="#ffffff"
        envMapIntensity={0.28}
        side={THREE.DoubleSide}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
