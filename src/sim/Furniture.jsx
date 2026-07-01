/* =========================================================================
 * Furniture.jsx — Furnitur 3D sederhana untuk tiap ruangan
 * Dibangun dari primitif (box/cylinder) agar ringan & tanpa aset eksternal.
 * Ditempatkan agar tidak menutupi jendela/gorden di tengah dinding belakang.
 * ========================================================================= */

const WOOD = "#8a6a4a";
const WOOD_D = "#6f5238";
const FABRIC = "#8a93a0";
const WHITE = "#f1ece2";
const METAL = "#3c4148";

function Box({ args, position, color, rough = 0.8, rotation }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={rough} />
    </mesh>
  );
}

function Leg({ x, z, h, y0 = 0, color = WOOD_D, r = 0.04 }) {
  return (
    <mesh position={[x, y0 + h / 2, z]} castShadow>
      <cylinderGeometry args={[r, r, h, 10]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

function Lamp({ position, accent = "#f4e3b0" }) {
  return (
    <group position={position}>
      <Box args={[0.3, 0.04, 0.3]} position={[0, 0.02, 0]} color={METAL} />
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1.5, 8]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.18, 0.25, 16, 1, true]} />
        <meshStandardMaterial color={accent} roughness={0.5} emissive={accent} emissiveIntensity={0.25} side={2} />
      </mesh>
    </group>
  );
}

/* ---------- Sofa (ruang tamu) ---------- */
function Sofa({ position, color = FABRIC }) {
  return (
    <group position={position}>
      <Box args={[2.1, 0.25, 0.9]} position={[0, 0.32, 0]} color={color} rough={0.95} />
      <Box args={[2.1, 0.5, 0.22]} position={[0, 0.6, -0.34]} color={color} rough={0.95} />
      <Box args={[0.22, 0.45, 0.9]} position={[-1.05, 0.55, 0]} color={color} rough={0.95} />
      <Box args={[0.22, 0.45, 0.9]} position={[1.05, 0.55, 0]} color={color} rough={0.95} />
      {[-0.55, 0.55].map((x) => (
        <Box key={x} args={[0.85, 0.18, 0.8]} position={[x, 0.48, 0.02]} color={color} rough={1} />
      ))}
      {[[-0.95, 0.42], [0.95, 0.42], [-0.95, -0.42], [0.95, -0.42]].map(([x, z], i) => (
        <Leg key={i} x={x} z={z} h={0.18} r={0.05} />
      ))}
    </group>
  );
}

function CoffeeTable({ position }) {
  return (
    <group position={position}>
      <Box args={[1.1, 0.08, 0.6]} position={[0, 0.4, 0]} color={WOOD} rough={0.4} />
      {[[-0.48, 0.24], [0.48, 0.24], [-0.48, -0.24], [0.48, -0.24]].map(([x, z], i) => (
        <Leg key={i} x={x} z={z} h={0.4} />
      ))}
    </group>
  );
}

/* ---------- Bed (kamar) ---------- */
function Bed({ position, rotation, color = "#b9c2cc", small = false }) {
  const w = small ? 1.1 : 1.6;
  const l = small ? 2.0 : 2.3;
  return (
    <group position={position} rotation={rotation}>
      <Box args={[w, 0.3, l]} position={[0, 0.3, 0]} color={WOOD} rough={0.6} />
      <Box args={[w, 0.22, l - 0.1]} position={[0, 0.52, 0.05]} color={color} rough={1} />
      <Box args={[w, 0.5, 0.12]} position={[0, 0.6, -l / 2]} color={WOOD_D} rough={0.6} />
      {/* bantal */}
      <Box args={[w * 0.8, 0.14, 0.45]} position={[0, 0.66, -l / 2 + 0.4]} color={WHITE} rough={1} />
    </group>
  );
}

function Nightstand({ position, accent }) {
  return (
    <group position={position}>
      <Box args={[0.5, 0.5, 0.45]} position={[0, 0.25, 0]} color={WOOD} rough={0.6} />
      <Lamp position={[0, 0.5, 0]} accent={accent} />
    </group>
  );
}

/* ---------- Dining (ruang makan) ---------- */
function Chair({ position, rotation, color = WOOD }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[0.42, 0.06, 0.42]} position={[0, 0.46, 0]} color={color} rough={0.6} />
      <Box args={[0.42, 0.5, 0.06]} position={[0, 0.72, -0.18]} color={color} rough={0.6} />
      {[[-0.17, 0.17], [0.17, 0.17], [-0.17, -0.17], [0.17, -0.17]].map(([x, z], i) => (
        <Leg key={i} x={x} z={z} h={0.46} r={0.03} color={color} />
      ))}
    </group>
  );
}

function DiningTable({ position }) {
  return (
    <group position={position}>
      <Box args={[1.7, 0.09, 0.95]} position={[0, 0.76, 0]} color={WOOD} rough={0.4} />
      {[[-0.75, 0.38], [0.75, 0.38], [-0.75, -0.38], [0.75, -0.38]].map(([x, z], i) => (
        <Leg key={i} x={x} z={z} h={0.76} r={0.05} />
      ))}
    </group>
  );
}

function PendantLamp({ position, accent }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1, 6]} />
        <meshStandardMaterial color={METAL} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.22, 0.2, 20, 1, true]} />
        <meshStandardMaterial color={accent} side={2} emissive={accent} emissiveIntensity={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ---------- Kitchen (dapur) ---------- */
function Counter({ position, rotation, len = 2.4 }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[len, 0.9, 0.6]} position={[0, 0.45, 0]} color={WHITE} rough={0.5} />
      <Box args={[len + 0.04, 0.06, 0.64]} position={[0, 0.93, 0]} color="#5a5550" rough={0.3} />
      <Box args={[len, 0.55, 0.3]} position={[0, 2.0, -0.12]} color={WHITE} rough={0.5} />
    </group>
  );
}

/* ---------- Office (kantor) ---------- */
function Desk({ position }) {
  return (
    <group position={position}>
      <Box args={[1.5, 0.07, 0.7]} position={[0, 0.74, 0]} color={WOOD} rough={0.4} />
      <Box args={[0.06, 0.74, 0.6]} position={[-0.7, 0.37, 0]} color={WOOD_D} />
      <Box args={[0.06, 0.74, 0.6]} position={[0.7, 0.37, 0]} color={WOOD_D} />
      {/* monitor */}
      <Box args={[0.6, 0.36, 0.04]} position={[0, 1.05, -0.2]} color={METAL} rough={0.3} />
      <Box args={[0.1, 0.16, 0.1]} position={[0, 0.85, -0.2]} color={METAL} />
    </group>
  );
}

function OfficeChair({ position, accent }) {
  return (
    <group position={position}>
      <Box args={[0.45, 0.08, 0.45]} position={[0, 0.5, 0]} color={accent} rough={0.7} />
      <Box args={[0.45, 0.5, 0.08]} position={[0, 0.78, 0.2]} color={accent} rough={0.7} />
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.3} />
      </mesh>
      <Box args={[0.5, 0.05, 0.5]} position={[0, 0.04, 0]} color={METAL} />
    </group>
  );
}

function Shelf({ position, rotation, accent }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[1.0, 1.6, 0.32]} position={[0, 0.8, 0]} color={WOOD} rough={0.6} />
      {[0.45, 0.95, 1.45].map((y, i) => (
        <Box key={i} args={[0.9, 0.04, 0.28]} position={[0, y, 0.01]} color={WOOD_D} />
      ))}
      {[0.3, 0.95, 1.5].map((y, i) => (
        <Box key={i} args={[0.5, 0.3, 0.2]} position={[i % 2 ? 0.18 : -0.18, y + 0.2, 0.04]} color={accent} rough={0.8} />
      ))}
    </group>
  );
}

function ToyBox({ position, accent }) {
  return (
    <group position={position}>
      {[["#f4b6c2", -0.22, 0], ["#a8d8ea", 0.22, 0], ["#f7dba7", 0, 0.32]].map(([c, x, z], i) => (
        <Box key={i} args={[0.4, 0.4, 0.4]} position={[x, 0.2, z]} color={c} rough={0.7} />
      ))}
      <mesh position={[0.4, 0.55, -0.2]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
    </group>
  );
}

function TVConsole({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[1.6, 0.4, 0.4]} position={[0, 0.2, 0]} color={WOOD_D} rough={0.5} />
      <Box args={[1.5, 0.85, 0.05]} position={[0, 0.95, -0.05]} color="#1a1d22" rough={0.25} />
      <Box args={[1.35, 0.7, 0.02]} position={[0, 0.95, -0.02]} color="#2b3a4a" rough={0.2} />
    </group>
  );
}

function Wardrobe({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[1.4, 2.2, 0.6]} position={[0, 1.1, 0]} color={WOOD} rough={0.6} />
      <Box args={[0.02, 2.0, 0.62]} position={[0, 1.1, 0]} color={WOOD_D} />
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 1.1, 0.31]}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
          <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Bench({ position }) {
  return (
    <group position={position}>
      <Box args={[1.5, 0.16, 0.45]} position={[0, 0.42, 0]} color="#c9b8a3" rough={0.9} />
      {[[-0.65, 0.17], [0.65, 0.17], [-0.65, -0.17], [0.65, -0.17]].map(([x, z], i) => (
        <Leg key={i} x={x} z={z} h={0.42} />
      ))}
    </group>
  );
}

function Armchair({ position, rotation, color = "#9a6b5a" }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[0.85, 0.22, 0.8]} position={[0, 0.34, 0]} color={color} rough={0.95} />
      <Box args={[0.85, 0.5, 0.2]} position={[0, 0.6, -0.3]} color={color} rough={0.95} />
      <Box args={[0.18, 0.4, 0.8]} position={[-0.42, 0.5, 0]} color={color} rough={0.95} />
      <Box args={[0.18, 0.4, 0.8]} position={[0.42, 0.5, 0]} color={color} rough={0.95} />
      <Box args={[0.6, 0.16, 0.7]} position={[0, 0.46, 0.02]} color={color} rough={1} />
      {[[-0.36, 0.34], [0.36, 0.34], [-0.36, -0.34], [0.36, -0.34]].map(([x, z], i) => (
        <Leg key={i} x={x} z={z} h={0.22} r={0.04} />
      ))}
    </group>
  );
}

function RoundTable({ position, r = 0.4, h = 0.74, color = WOOD }) {
  return (
    <group position={position}>
      <mesh position={[0, h, 0]} castShadow>
        <cylinderGeometry args={[r, r, 0.06, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, h, 12]} />
        <meshStandardMaterial color={WOOD_D} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 20]} />
        <meshStandardMaterial color={WOOD_D} roughness={0.5} />
      </mesh>
    </group>
  );
}

function BistroSet({ position, accent }) {
  return (
    <group position={position}>
      <RoundTable position={[0, 0, 0]} r={0.34} />
      <Chair position={[0, 0, 0.6]} rotation={[0, Math.PI, 0]} color={accent} />
      <Chair position={[0, 0, -0.6]} color={accent} />
    </group>
  );
}

export default function Furniture({ room, accent }) {
  switch (room) {
    case "ruang-tamu":
      return (
        <group>
          <Sofa position={[0, 0, 1.5]} color="#7f8a96" />
          <CoffeeTable position={[0, 0, 0.4]} />
          <Lamp position={[2, 0, 1.2]} accent="#ffe9b0" />
        </group>
      );
    case "kamar":
      return (
        <group>
          <Bed position={[-1.5, 0, -0.6]} rotation={[0, Math.PI / 2, 0]} color="#c2ccd6" />
          <Nightstand position={[-1.5, 0, -2.1]} accent="#ffe1ea" />
        </group>
      );
    case "kamar-anak":
      return (
        <group>
          <Bed position={[-1.6, 0, -0.8]} rotation={[0, Math.PI / 2, 0]} color="#bfe0ef" small />
          <ToyBox position={[1.6, 0, 1.4]} accent={accent} />
        </group>
      );
    case "ruang-makan":
      return (
        <group>
          <DiningTable position={[0, 0, 0.8]} />
          <Chair position={[-0.65, 0, 1.55]} rotation={[0, Math.PI, 0]} />
          <Chair position={[0.65, 0, 1.55]} rotation={[0, Math.PI, 0]} />
          <Chair position={[-0.65, 0, 0.05]} />
          <Chair position={[0.65, 0, 0.05]} />
          <PendantLamp position={[0, 2.35, 0.8]} accent="#ffe6b0" />
        </group>
      );
    case "dapur":
      return (
        <group>
          <Counter position={[-2.4, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} len={3} />
          <Counter position={[0, 0, 1.8]} len={2.2} />
        </group>
      );
    case "kantor":
      return (
        <group>
          <Desk position={[0, 0, 1.0]} />
          <OfficeChair position={[0, 0, 1.9]} accent={accent} />
          <Shelf position={[2.5, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]} accent={accent} />
        </group>
      );
    case "ruang-keluarga":
      return (
        <group>
          <Sofa position={[0, 0, 1.6]} color="#6f7c74" />
          <Armchair position={[-1.9, 0, 0.6]} rotation={[0, 0.5, 0]} color="#6f7c74" />
          <CoffeeTable position={[0, 0, 0.5]} />
          <TVConsole position={[2.7, 0, -0.3]} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      );
    case "kamar-utama":
      return (
        <group>
          <Bed position={[-1.2, 0, -0.4]} rotation={[0, Math.PI / 2, 0]} color="#d3c6d6" />
          <Bench position={[-1.2, 0, 1.0]} />
          <Wardrobe position={[2.6, 0, -0.6]} rotation={[0, -Math.PI / 2, 0]} />
          <Nightstand position={[-2.7, 0, -1.1]} accent={accent} />
        </group>
      );
    case "ruang-baca":
      return (
        <group>
          <Armchair position={[-1.1, 0, 1.1]} rotation={[0, 0.35, 0]} color="#a15b43" />
          <RoundTable position={[-0.1, 0, 1.2]} r={0.3} h={0.5} />
          <Lamp position={[-2, 0, 0.6]} accent="#ffe9b0" />
          <Shelf position={[2.5, 0, -0.3]} rotation={[0, -Math.PI / 2, 0]} accent={accent} />
        </group>
      );
    case "kafe":
      return (
        <group>
          <BistroSet position={[-1.2, 0, 0.9]} accent="#5a4636" />
          <BistroSet position={[1.4, 0, 1.4]} accent="#5a4636" />
        </group>
      );
    default:
      return null;
  }
}
