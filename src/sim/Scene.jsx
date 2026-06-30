/* =========================================================================
 * Scene.jsx — Ruangan 3D: dinding/lantai, jendela + langit, lampu,
 * gorden, vitrase, dekorasi, dan kamera (orbit manual + mode tour).
 * ========================================================================= */
import { useMemo, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Curtain from "./Curtain.jsx";
import { makeFabricTexture } from "../lib/fabric.js";

extend({ OrbitControls });

const ROOM = { W: 6, H: 3.2, D: 6 };

function makeSky() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256;
  const c = cv.getContext("2d");
  const g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#aedcf2");
  g.addColorStop(0.55, "#dceef6");
  g.addColorStop(1, "#eef7e6");
  c.fillStyle = g;
  c.fillRect(0, 0, 256, 256);
  c.fillStyle = "rgba(255,243,200,0.95)";
  c.beginPath();
  c.arc(185, 64, 26, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "rgba(120,165,120,0.5)";
  c.beginPath();
  c.moveTo(0, 205);
  c.lineTo(70, 150);
  c.lineTo(135, 188);
  c.lineTo(205, 138);
  c.lineTo(256, 182);
  c.lineTo(256, 256);
  c.lineTo(0, 256);
  c.closePath();
  c.fill();
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function lighten(hex, amt) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((x) => x + x).join("") : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c) => Math.min(255, Math.round(c + (255 - c) * amt));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function CameraRig({ tour }) {
  const { camera, gl } = useThree();
  const controls = useRef();
  const tt = useRef(0);
  const target = useMemo(() => new THREE.Vector3(0, 1.45, -2), []);
  useFrame((_, dt) => {
    if (tour) {
      tt.current += dt;
      const a = Math.sin(tt.current * 0.22) * 0.95;
      const radius = 4.4 + Math.sin(tt.current * 0.17) * 0.7;
      const h = 1.6 + Math.sin(tt.current * 0.28) * 0.3;
      camera.position.set(target.x + Math.sin(a) * radius, h, target.z + Math.cos(a) * radius);
      camera.lookAt(target);
    } else if (controls.current) {
      controls.current.update();
    }
  });
  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enabled={!tour}
      enableDamping
      dampingFactor={0.08}
      target={[0, 1.45, -2]}
      minDistance={1.8}
      maxDistance={5.6}
      maxPolarAngle={1.52}
      minPolarAngle={0.55}
      enablePan={false}
    />
  );
}

function Plant({ position, pot = "#b5774a" }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.36, 16]} />
        <meshStandardMaterial color={pot} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#5d7e54" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.62, 0.05]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#6f945f" roughness={0.9} />
      </mesh>
    </group>
  );
}

function WallArt({ position, color, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.7, 0.5, 0.03]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.6, 0.4, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function Scene({ sim, room }) {
  const sky = useMemo(() => makeSky(), []);

  // Ukuran & posisi jendela
  const winW = THREE.MathUtils.clamp(sim.lebar / 100, 0.8, 4.2);
  const winH = THREE.MathUtils.clamp(sim.tinggi / 100, 0.8, 2.6);
  const sill = THREE.MathUtils.clamp(1.55 - winH / 2, 0.5, ROOM.H - 0.2 - winH);
  const winCY = sill + winH / 2;
  const wallZ = -ROOM.D / 2;

  // Tekstur kain (warna + motif)
  const fabricTex = useMemo(
    () => makeFabricTexture(sim.color, sim.motif),
    [sim.color, sim.motif]
  );
  const sheerTex = useMemo(() => makeFabricTexture("#ffffff", "polos"), []);

  const isVitraseStyle = sim.style === "vitrase";
  const mainOpacity = isVitraseStyle ? 0.5 : sim.opacity;
  const showSheer = sim.vitrase && !isVitraseStyle;

  const frameMat = <meshStandardMaterial color="#ffffff" roughness={0.5} />;
  const frameT = 0.07;

  return (
    <>
      <color attach="background" args={["#d9d2c6"]} />
      <fog attach="fog" args={["#d9d2c6", 9, 16]} />

      {/* Pencahayaan */}
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#ffffff", room.floor, 0.5]} />
      <directionalLight position={[2.5, 3, 2]} intensity={0.45} />
      <directionalLight
        position={[0.6, winCY + 1.2, wallZ - 2]}
        intensity={1.5}
        color="#fff2cf"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-1}
      />

      {/* Lantai */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.W, ROOM.D]} />
        <meshStandardMaterial color={room.floor} roughness={0.95} />
      </mesh>
      {/* Karpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -0.6]} receiveShadow>
        <planeGeometry args={[ROOM.W * 0.55, ROOM.D * 0.4]} />
        <meshStandardMaterial color={lighten(room.accent, 0.45)} roughness={1} />
      </mesh>
      {/* Plafon */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.H, 0]}>
        <planeGeometry args={[ROOM.W, ROOM.D]} />
        <meshStandardMaterial color={lighten(room.wall, 0.25)} roughness={1} />
      </mesh>
      {/* Dinding belakang */}
      <mesh position={[0, ROOM.H / 2, wallZ]} receiveShadow>
        <planeGeometry args={[ROOM.W, ROOM.H]} />
        <meshStandardMaterial color={room.wall} roughness={1} />
      </mesh>
      {/* Dinding samping */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-ROOM.W / 2, ROOM.H / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.D, ROOM.H]} />
        <meshStandardMaterial color={lighten(room.wall, -0.06)} roughness={1} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[ROOM.W / 2, ROOM.H / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.D, ROOM.H]} />
        <meshStandardMaterial color={lighten(room.wall, -0.06)} roughness={1} />
      </mesh>

      {/* Pemandangan langit di jendela */}
      <mesh position={[0, winCY, wallZ + 0.02]}>
        <planeGeometry args={[winW, winH]} />
        <meshBasicMaterial map={sky} />
      </mesh>
      {/* Kusen jendela */}
      <group position={[0, winCY, wallZ + 0.05]}>
        <mesh position={[0, winH / 2 + frameT / 2, 0]}>
          <boxGeometry args={[winW + frameT * 2, frameT, 0.08]} />
          {frameMat}
        </mesh>
        <mesh position={[0, -winH / 2 - frameT / 2, 0]}>
          <boxGeometry args={[winW + frameT * 2, frameT, 0.08]} />
          {frameMat}
        </mesh>
        <mesh position={[-winW / 2 - frameT / 2, 0, 0]}>
          <boxGeometry args={[frameT, winH + frameT * 2, 0.08]} />
          {frameMat}
        </mesh>
        <mesh position={[winW / 2 + frameT / 2, 0, 0]}>
          <boxGeometry args={[frameT, winH + frameT * 2, 0.08]} />
          {frameMat}
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[winW, frameT * 0.5, 0.06]} />
          {frameMat}
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[frameT * 0.5, winH, 0.06]} />
          {frameMat}
        </mesh>
      </group>

      {/* Rel gorden */}
      <mesh position={[0, sill + winH + 0.14, wallZ + 0.32]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, winW + 0.6, 16]} />
        <meshStandardMaterial color="#8a6e4b" roughness={0.5} metalness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (winW / 2 + 0.3), sill + winH + 0.14, wallZ + 0.32]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#7a6043" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}

      {/* Vitrase (di belakang) */}
      {showSheer && (
        <>
          <Curtain side="left" winW={winW} winH={winH} sill={sill} openness={0.05} texture={sheerTex} opacity={0.4} z={wallZ + 0.18} />
          <Curtain side="right" winW={winW} winH={winH} sill={sill} openness={0.05} texture={sheerTex} opacity={0.4} z={wallZ + 0.18} />
        </>
      )}

      {/* Gorden utama */}
      <Curtain side="left" winW={winW} winH={winH} sill={sill} openness={sim.openness} texture={fabricTex} opacity={mainOpacity} z={wallZ + 0.32} />
      <Curtain side="right" winW={winW} winH={winH} sill={sill} openness={sim.openness} texture={fabricTex} opacity={mainOpacity} z={wallZ + 0.32} />

      {/* Dekorasi ruangan */}
      <Plant position={[-ROOM.W / 2 + 0.5, 0, -ROOM.D / 2 + 0.6]} pot={room.accent} />
      <WallArt position={[-ROOM.W / 2 + 0.04, 1.7, -1.2]} color={room.accent} rotation={[0, Math.PI / 2, 0]} />

      <CameraRig tour={sim.tour} />
    </>
  );
}
