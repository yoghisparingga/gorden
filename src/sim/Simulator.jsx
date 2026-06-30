/* =========================================================================
 * Simulator.jsx — Bagian simulator: Canvas 3D (R3F) + toolbar + Controls
 * ========================================================================= */
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene.jsx";
import Controls from "./Controls.jsx";
import { useStore, activeProduct } from "../store.js";
import { ROOMS } from "../data.js";

export default function Simulator() {
  const sim = useStore((s) => s.sim);
  const setSim = useStore((s) => s.setSim);
  const product = activeProduct();
  const room = ROOMS.find((r) => r.id === sim.room) || ROOMS[0];
  const wrapRef = useRef();

  const download = () => {
    const cv = wrapRef.current?.querySelector("canvas");
    if (!cv) return;
    const a = document.createElement("a");
    a.href = cv.toDataURL("image/png");
    a.download = `simulasi-3d-${product.id}.png`;
    a.click();
  };

  return (
    <section id="simulator" className="section sim-section">
      <div className="container">
        <div className="section-head">
          <h2>🪟 Simulasi Gorden 3D</h2>
          <p>
            Geser untuk memutar ruangan, atau klik <b>Tour</b> untuk keliling otomatis.
            Ganti model, motif, warna, dan ukuran — semua tampil realtime di ruangan 3D.
          </p>
        </div>

        <div className="sim-layout">
          <div className="sim-stage" ref={wrapRef}>
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
                <button
                  className={"tool-btn" + (sim.tour ? " on" : "")}
                  onClick={() => setSim({ tour: !sim.tour })}
                  title="Tour keliling ruangan"
                >
                  {sim.tour ? "⏸ Stop Tour" : "🎥 Tour Ruangan"}
                </button>
                <button className="tool-btn" onClick={download} title="Unduh gambar">
                  ⬇️ Unduh
                </button>
              </div>
              <div className="sim-hint">🖱️ Seret untuk memutar · scroll untuk zoom</div>
            </div>

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
