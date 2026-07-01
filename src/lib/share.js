/* =========================================================================
 * share.js — Encode/decode konfigurasi simulator ke URL (bisa dibagikan)
 * Contoh: https://situs/#p=blackout-luxe&r=kamar&c=2f3a4a&m=daun&...
 * ========================================================================= */
import { PRODUCTS } from "../data.js";

export function encodeConfig(sim) {
  const p = new URLSearchParams();
  p.set("p", sim.productId);
  p.set("r", sim.room);
  p.set("s", sim.style);
  p.set("c", (sim.color || "").replace("#", ""));
  p.set("m", sim.motif);
  p.set("o", String(Math.round((sim.openness || 0) * 100)));
  p.set("v", sim.vitrase ? "1" : "0");
  p.set("l", String(sim.lebar));
  p.set("t", String(sim.tinggi));
  p.set("w", sim.waktu);
  return p.toString();
}

export function decodeConfig(str) {
  if (!str) return null;
  const p = new URLSearchParams(str);
  if (!p.get("p") && !p.get("c")) return null;
  const out = {};
  if (p.get("p")) out.productId = p.get("p");
  if (p.get("r")) out.room = p.get("r");
  if (p.get("s")) out.style = p.get("s");
  if (p.get("c")) out.color = "#" + p.get("c");
  if (p.get("m")) out.motif = p.get("m");
  if (p.get("o") != null) out.openness = Math.min(1, Math.max(0, (+p.get("o") || 0) / 100));
  if (p.get("v") != null) out.vitrase = p.get("v") === "1";
  if (p.get("l")) out.lebar = +p.get("l");
  if (p.get("t")) out.tinggi = +p.get("t");
  if (p.get("w")) out.waktu = p.get("w");
  const prod = PRODUCTS.find((x) => x.id === out.productId);
  if (prod) {
    out.opacity = prod.opacity;
    out.sheer = prod.sheer;
  }
  return out;
}

export function shareUrl(sim) {
  const base =
    typeof location !== "undefined" ? location.origin + location.pathname : "";
  return base + "#" + encodeConfig(sim);
}
