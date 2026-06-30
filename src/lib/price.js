/* Estimasi harga gorden = harga/meter × lebar(m) × faktor tinggi (min 1 meter) */
export function estimatePrice(product, sim) {
  const base = product ? product.pricePerMeter : 150000;
  const lebarM = (sim.lebar || 0) / 100;
  const tinggiFactor = Math.max(1, (sim.tinggi || 250) / 250);
  const total = Math.round((base * lebarM * tinggiFactor) / 1000) * 1000;
  return Math.max(total, base);
}
