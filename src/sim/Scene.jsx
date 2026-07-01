/* =========================================================================
 * Scene.jsx — Ruangan 3D: dinding/lantai, jendela + langit, lampu,
 * gorden, vitrase, dekorasi, dan kamera (orbit manual + mode tour).
 * ========================================================================= */
import { useEffect, useMemo, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import Curtain from "./Curtain.jsx";
import Furniture from "./Furniture.jsx";
import { makeFabricTexture } from "../lib/fabric.js";
import { makeFloorTexture } from "../lib/textures.js";
import { useStore } from "../store.js";

extend({ OrbitControls });

/* Pencahayaan berbasis environment (soft reflections/IBL) */
function Env() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    invalidate();
    return () => {
      env.texture.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene, invalidate]);
  return null;
}

const ROOM = { W: 6, H: 3.2, D: 6 };

function makeSky(time = "siang") {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256;
  const c = cv.getContext("2d");
  const g = c.createLinearGradient(0, 0, 0, 256);

  if (time === "sore") {
    g.addColorStop(0, "#f7a65a");
    g.addColorStop(0.5, "#f9cf8f");
    g.addColorStop(1, "#f2d3a0");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
    // Matahari besar rendah
    c.fillStyle = "rgba(255,236,180,0.98)";
    c.beginPath();
    c.arc(128, 150, 40, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(150,110,90,0.55)";
    hills(c);
  } else if (time === "malam") {
    g.addColorStop(0, "#0e1220");
    g.addColorStop(0.6, "#1b2440");
    g.addColorStop(1, "#2a3556");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
    // Bulan
    c.fillStyle = "rgba(236,238,245,0.95)";
    c.beginPath();
    c.arc(190, 58, 22, 0, Math.PI * 2);
    c.fill();
    // Bintang
    c.fillStyle = "rgba(255,255,255,0.85)";
    for (let i = 0; i < 40; i++) {
      const x = (i * 61) % 256;
      const y = (i * 37) % 150;
      c.fillRect(x, y, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1);
    }
    c.fillStyle = "rgba(10,14,24,0.9)";
    hills(c);
    // Lampu kota
    c.fillStyle = "rgba(255,210,120,0.8)";
    for (let i = 0; i < 18; i++) c.fillRect((i * 29 + 8) % 256, 196 + (i % 3) * 4, 2, 2);
  } else {
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
    hills(c);
  }

  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function hills(c) {
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
}

/* Konfigurasi pencahayaan per waktu */
const LIGHTING = {
  siang: { sun: "#fff1c9", sunI: 2.4, amb: 0.18, hemi: 0.35, exposure: 1.15, interior: 0.0, bg: "#e7e0d5", pos: [0.6, 1.4, -2.2] },
  sore: { sun: "#ff9a4d", sunI: 2.3, amb: 0.14, hemi: 0.26, exposure: 1.12, interior: 0.25, bg: "#ecd4b8", pos: [2.6, 0.5, -2.0] },
  malam: { sun: "#5f7fb0", sunI: 0.45, amb: 0.05, hemi: 0.1, exposure: 1.3, interior: 1.0, bg: "#181a22", pos: [-1.6, 1.6, -2.2] },
};

function lighten(hex, amt) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((x) => x + x).join("") : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c) => Math.min(255, Math.round(c + (255 - c) * amt));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

function CameraRig({ mode }) {
  const { camera, gl, invalidate } = useThree();
  const controls = useRef();
  const tt = useRef(0);
  const target = useMemo(() => new THREE.Vector3(0, 1.45, -2), []);
  const yaw = useRef(0);
  const pitch = useRef(-0.05);
  const wpos = useRef(new THREE.Vector3(0, 1.6, 2.2));
  const drag = useRef(false);
  const lastP = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mode === "walk") {
      wpos.current.set(0, 1.6, 2.2);
      yaw.current = 0;
      pitch.current = -0.05;
      const dom = gl.domElement;
      const down = (e) => { drag.current = true; lastP.current = { x: e.clientX, y: e.clientY }; };
      const move = (e) => {
        if (!drag.current) return;
        yaw.current -= (e.clientX - lastP.current.x) * 0.005;
        pitch.current = THREE.MathUtils.clamp(pitch.current - (e.clientY - lastP.current.y) * 0.005, -1.0, 1.0);
        lastP.current = { x: e.clientX, y: e.clientY };
      };
      const up = () => { drag.current = false; };
      const key = (e, v) => {
        const k = e.key.toLowerCase();
        if (k.startsWith("arrow")) e.preventDefault();
        const n = useStore.getState().setNav;
        if (k === "w" || e.key === "ArrowUp") n({ f: v });
        else if (k === "s" || e.key === "ArrowDown") n({ b: v });
        else if (k === "a" || e.key === "ArrowLeft") n({ l: v });
        else if (k === "d" || e.key === "ArrowRight") n({ r: v });
      };
      const kd = (e) => key(e, true);
      const ku = (e) => key(e, false);
      dom.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("keydown", kd);
      window.addEventListener("keyup", ku);
      return () => {
        dom.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("keydown", kd);
        window.removeEventListener("keyup", ku);
        useStore.getState().setNav({ f: false, b: false, l: false, r: false });
      };
    } else if (mode === "orbit") {
      camera.position.set(0, 1.6, 3.7);
      if (controls.current) {
        controls.current.target.set(0, 1.45, -2);
        controls.current.update();
      }
    }
  }, [mode, camera, gl]);

  // Render on-demand: minta 1 frame tiap kali kamera diputar/zoom
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const onChange = () => invalidate();
    c.addEventListener("change", onChange);
    return () => c.removeEventListener("change", onChange);
  }, [invalidate]);

  useFrame((_, dt) => {
    if (mode === "tour") {
      tt.current += dt;
      const a = Math.sin(tt.current * 0.22) * 0.95;
      const radius = 4.4 + Math.sin(tt.current * 0.17) * 0.7;
      const h = 1.6 + Math.sin(tt.current * 0.28) * 0.3;
      camera.position.set(target.x + Math.sin(a) * radius, h, target.z + Math.cos(a) * radius);
      camera.lookAt(target);
    } else if (mode === "walk") {
      const nav = useStore.getState().nav;
      const speed = 2.2 * Math.min(dt, 0.05);
      const fx = Math.sin(yaw.current), fz = -Math.cos(yaw.current);
      const rx = Math.cos(yaw.current), rz = Math.sin(yaw.current);
      const p = wpos.current;
      if (nav.f) { p.x += fx * speed; p.z += fz * speed; }
      if (nav.b) { p.x -= fx * speed; p.z -= fz * speed; }
      if (nav.l) { p.x -= rx * speed; p.z -= rz * speed; }
      if (nav.r) { p.x += rx * speed; p.z += rz * speed; }
      p.x = THREE.MathUtils.clamp(p.x, -2.6, 2.6);
      p.z = THREE.MathUtils.clamp(p.z, -2.2, 2.7);
      p.y = 1.6;
      camera.position.copy(p);
      const cp = Math.cos(pitch.current);
      camera.lookAt(
        p.x + Math.sin(yaw.current) * cp,
        p.y + Math.sin(pitch.current),
        p.z - Math.cos(yaw.current) * cp
      );
    }
    // Mode orbit: OrbitControls menggerakkan kamera sendiri + invalidate (on-demand)
  });

  return (
    <orbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enabled={mode === "orbit"}
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

export default function Scene({ sim, room, quality = "tinggi" }) {
  const hi = quality === "tinggi";
  const sky = useMemo(() => makeSky(sim.waktu), [sim.waktu]);
  const L = LIGHTING[sim.waktu] || LIGHTING.siang;
  const { gl, invalidate } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = L.exposure;
    invalidate();
  }, [gl, L, invalidate]);

  // Bekukan shadow map: hanya render ulang saat konfigurasi berubah, bukan tiap frame
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    return () => { gl.shadowMap.autoUpdate = true; };
  }, [gl]);
  useEffect(() => {
    gl.shadowMap.needsUpdate = true;
    invalidate();
  }, [gl, invalidate, sim.room, sim.lebar, sim.tinggi, sim.openness, sim.style, sim.waktu, sim.vitrase, sim.color, sim.motif, quality]);

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
  const floorTex = useMemo(() => {
    const t = makeFloorTexture(room.floor);
    t.map.repeat.set(4, 4);
    t.bump.repeat.set(4, 4);
    return t;
  }, [room.floor]);

  const isVitraseStyle = sim.style === "vitrase";
  const mainOpacity = isVitraseStyle ? 0.5 : sim.opacity;
  const showSheer = sim.vitrase && !isVitraseStyle;

  const frameMat = <meshStandardMaterial color="#ffffff" roughness={0.5} />;
  const frameT = 0.07;

  return (
    <>
      <color attach="background" args={[L.bg]} />
      <fog attach="fog" args={[L.bg, 10, 18]} />
      <Env />

      {/* Pencahayaan (menyesuaikan waktu) */}
      <ambientLight intensity={L.amb} />
      <hemisphereLight args={["#ffffff", room.floor, L.hemi]} />
      <directionalLight position={[3, 3, 2.5]} intensity={0.3 * L.sunI / 2.4} />
      {/* Lampu interior (menyala saat sore/malam) */}
      <pointLight position={[0, ROOM.H - 0.35, 0.6]} intensity={0.25 + L.interior * 3.2} color="#ffd7a0" distance={12} decay={2} />
      <pointLight position={[0, 1.4, 1.8]} intensity={L.interior * 1.2} color="#ffdca8" distance={8} decay={2} />
      <directionalLight
        position={[L.pos[0], winCY + L.pos[1], wallZ + L.pos[2]]}
        intensity={L.sunI}
        color={L.sun}
        castShadow
        shadow-mapSize-width={hi ? 2048 : 1024}
        shadow-mapSize-height={hi ? 2048 : 1024}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-radius={hi ? 7 : 3}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4}
        shadow-camera-bottom={-1.5}
      />

      {/* Lantai */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.W, ROOM.D]} />
        <meshStandardMaterial map={floorTex.map} bumpMap={floorTex.bump} bumpScale={0.015} roughness={0.5} metalness={0.05} envMapIntensity={0.55} />
      </mesh>
      {/* Karpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -0.6]} receiveShadow>
        <planeGeometry args={[ROOM.W * 0.55, ROOM.D * 0.4]} />
        <meshStandardMaterial color={lighten(room.accent, 0.45)} roughness={0.95} envMapIntensity={0.3} />
      </mesh>
      {/* Plafon */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.H, 0]}>
        <planeGeometry args={[ROOM.W, ROOM.D]} />
        <meshStandardMaterial color={lighten(room.wall, 0.28)} roughness={1} envMapIntensity={0.2} />
      </mesh>
      {/* Dinding belakang */}
      <mesh position={[0, ROOM.H / 2, wallZ]} receiveShadow>
        <planeGeometry args={[ROOM.W, ROOM.H]} />
        <meshStandardMaterial color={room.wall} roughness={0.92} envMapIntensity={0.28} />
      </mesh>
      {/* Dinding samping */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-ROOM.W / 2, ROOM.H / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.D, ROOM.H]} />
        <meshStandardMaterial color={lighten(room.wall, -0.05)} roughness={0.92} envMapIntensity={0.25} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[ROOM.W / 2, ROOM.H / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM.D, ROOM.H]} />
        <meshStandardMaterial color={lighten(room.wall, -0.05)} roughness={0.92} envMapIntensity={0.25} />
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

      {/* Vitrase (di belakang) — selalu statis */}
      {showSheer && (
        <>
          <Curtain side="left" winW={winW} winH={winH} sill={sill} openness={0.05} texture={sheerTex} opacity={0.4} z={wallZ + 0.18} hi={hi} breeze={false} />
          <Curtain side="right" winW={winW} winH={winH} sill={sill} openness={0.05} texture={sheerTex} opacity={0.4} z={wallZ + 0.18} hi={hi} breeze={false} />
        </>
      )}

      {/* Gorden utama — beranimasi angin hanya di mode kualitas tinggi */}
      <Curtain side="left" winW={winW} winH={winH} sill={sill} openness={sim.openness} texture={fabricTex} opacity={mainOpacity} z={wallZ + 0.32} hi={hi} breeze={hi} />
      <Curtain side="right" winW={winW} winH={winH} sill={sill} openness={sim.openness} texture={fabricTex} opacity={mainOpacity} z={wallZ + 0.32} hi={hi} breeze={hi} />

      {/* Furnitur & dekorasi ruangan */}
      <Furniture room={sim.room} accent={room.accent} />
      <Plant position={[ROOM.W / 2 - 0.5, 0, -ROOM.D / 2 + 0.6]} pot={room.accent} />
      <WallArt position={[-ROOM.W / 2 + 0.04, 1.7, -1.2]} color={room.accent} rotation={[0, Math.PI / 2, 0]} />

      <CameraRig mode={sim.mode} />
    </>
  );
}
