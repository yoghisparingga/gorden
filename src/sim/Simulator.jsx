/* =========================================================================
 * Simulator.jsx — Bagian simulator: Canvas 3D (R3F) atau mode upload foto,
 * toolbar mode kamera, navigasi "Jelajah", dan panel Controls.
 * ========================================================================= */
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene.jsx";
import Controls from "./Controls.jsx";
import UploadMode from "./UploadMode.jsx";
import { useStore, activeProduct } from "../store.js";
import { ROOMS } from "../data.js";

const MODES = [
  { id: "orbit", label: "🔄 Putar" },
  { id: "tour", label: "🎥 Tour" },
  { id: "walk", label: "🚶 Jelajah" },
];

export default function Simulator() {
  const sim = useStore((s) => s.sim);
  const setSim = useStore((s) => s.setSim);
  const setNav = useStore((s) => s.setNav);
  const product = activeProduct();
  const room = ROOMS.find((r) => r.id === sim.room) || ROOMS[0];
  const isUpload = sim.room === "upload";
  const wrapRef = useRef();

  const download = () => {
    const cv = wrapRef.current?.querySelector("canvas");
    if (!cv) return;
    const a = document.createElement("a");
    a.href = cv.toDataURL("image/png");
    a.download = `simulasi-${product.id}.png`;
    a.click();
  };

  const hint = isUpload
    ? "📷 Unggah foto & atur posisi gorden"
    : sim.mode === "walk"
    ? "⌨️ WASD / tombol untuk jalan · 🖱️ seret untuk melihat"
    : sim.mode === "tour"
    ? "🎥 Kamera berkeliling otomatis"
    : "🖱️ Seret untuk memutar · scroll untuk zoom";

  const press = (dir, v) => () => setNav({ [dir]: v });

  return (
    <section id="simulator" className="section sim-section">
      <div className="container sim-container">
        <div className="section-head">
          <h2>🪟 Simulasi Gorden 3D</h2>
          <p>
            Putar, <b>tour</b>, atau <b>jelajahi</b> ruangan 3D — atau pilih
            <b> 📷 Foto Saya</b> untuk mencoba gorden di foto ruangan Anda sendiri.
          </p>
        </div>

        <div className="sim-layout">
          <div className="sim-stage" ref={wrapRef}>
            {isUpload ? (
              <UploadMode />
            ) : (
              <div className="sim-canvas-wrap">
                <Canvas
                  shadows
                  dpr={[1, 2]}
                  gl={{ preserveDrawingBuffer: true, antialias: true }}
                  camera={{ position: [0, 1.6, 3.7], fov: 50, near: 0.1, far: 100 }}
                >
                  <Scene sim={sim} room={room} />
                </Canvas>

                <div className="sim-overlay-tools">
                  <div className="mode-seg">
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        className={"mode-btn" + (sim.mode === m.id ? " on" : "")}
                        onClick={() => setSim({ mode: m.id })}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <button className="tool-btn" onClick={download} title="Unduh gambar">⬇️</button>
                </div>

                {/* D-pad navigasi mode Jelajah */}
                {sim.mode === "walk" && (
                  <div className="dpad">
                    <button className="dbtn up" onPointerDown={press("f", true)} onPointerUp={press("f", false)} onPointerLeave={press("f", false)}>▲</button>
                    <button className="dbtn left" onPointerDown={press("l", true)} onPointerUp={press("l", false)} onPointerLeave={press("l", false)}>◀</button>
                    <button className="dbtn down" onPointerDown={press("b", true)} onPointerUp={press("b", false)} onPointerLeave={press("b", false)}>▼</button>
                    <button className="dbtn right" onPointerDown={press("r", true)} onPointerUp={press("r", false)} onPointerLeave={press("r", false)}>▶</button>
                  </div>
                )}

                <div className="sim-hint">{hint}</div>
              </div>
            )}

            {isUpload && (
              <div className="sim-overlay-tools static">
                <button className="tool-btn" onClick={download} title="Unduh gambar">⬇️ Unduh</button>
              </div>
            )}

            <div className="sim-stage-bar">
              <div className="sim-prodtag">
                <strong>{product.nama}</strong>
                <small>{product.kategori} · {product.bahan}</small>
              </div>
              <span className="room-tag">{room.emoji} {room.nama}</span>
            </div>
          </div>

          <Controls />
        </div>
      </div>
    </section>
  );
}
