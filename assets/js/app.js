/* =========================================================================
 * app.js — Logika aplikasi: katalog, navigasi, kontrol simulator, keranjang
 * ========================================================================= */

const App = (() => {
  let cart = [];
  let activeProduct = null; // produk yang sedang disimulasikan

  /* ----------------------- Inisialisasi ----------------------- */
  function init() {
    document.getElementById("brand-name").textContent = TOKO.nama;
    document.getElementById("hero-tagline").textContent = TOKO.tagline;
    document.getElementById("footer-toko").textContent = TOKO.nama;
    document.getElementById("footer-alamat").textContent = TOKO.alamat;
    document.getElementById("footer-email").textContent = TOKO.email;
    document.getElementById("tahun").textContent = new Date().getFullYear();

    loadCart();
    renderFilters();
    renderCatalog("Semua");
    buildSimulatorControls();
    Simulator.init(document.getElementById("sim-canvas"));

    // Mulai simulator dengan produk pertama
    selectForSimulation(PRODUCTS[0], false);

    bindNav();
    bindUpload();
    bindCheckout();
    updateCartUI();
  }

  /* ----------------------- Katalog ----------------------- */
  function renderFilters() {
    const cats = ["Semua", ...new Set(PRODUCTS.map((p) => p.kategori))];
    const wrap = document.getElementById("filters");
    wrap.innerHTML = "";
    cats.forEach((c, i) => {
      const b = document.createElement("button");
      b.className = "chip" + (i === 0 ? " active" : "");
      b.textContent = c;
      b.onclick = () => {
        document.querySelectorAll("#filters .chip").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        renderCatalog(c);
      };
      wrap.appendChild(b);
    });
  }

  function renderCatalog(cat) {
    const grid = document.getElementById("catalog");
    grid.innerHTML = "";
    const list = cat === "Semua" ? PRODUCTS : PRODUCTS.filter((p) => p.kategori === cat);
    list.forEach((p) => grid.appendChild(productCard(p)));
  }

  function productCard(p) {
    const card = document.createElement("article");
    card.className = "card";

    // Thumbnail gorden mini digambar via CSS gradient lipatan
    const thumb = document.createElement("div");
    thumb.className = "card-thumb";
    thumb.appendChild(makeFabricPreview(p.colors[0]));
    if (p.badge) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = p.badge;
      thumb.appendChild(badge);
    }

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `
      <div class="card-cat">${p.kategori}</div>
      <h3 class="card-title">${p.nama}</h3>
      <div class="card-meta">
        <span class="stars">★ ${p.rating}</span>
        <span class="sold">${p.terjual.toLocaleString("id-ID")} terjual</span>
      </div>
      <div class="card-price">${RUPIAH.format(p.pricePerMeter)} <span>/ m</span></div>
    `;

    // Swatch warna
    const swatches = document.createElement("div");
    swatches.className = "swatches";
    p.colors.slice(0, 6).forEach((c) => {
      const s = document.createElement("span");
      s.className = "sw";
      s.style.background = c;
      swatches.appendChild(s);
    });
    body.appendChild(swatches);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const simBtn = document.createElement("button");
    simBtn.className = "btn btn-primary";
    simBtn.textContent = "🪟 Simulasikan";
    simBtn.onclick = () => selectForSimulation(p, true);
    const cartBtn = document.createElement("button");
    cartBtn.className = "btn btn-ghost";
    cartBtn.textContent = "+ Keranjang";
    cartBtn.onclick = () => quickAdd(p);
    actions.appendChild(simBtn);
    actions.appendChild(cartBtn);
    body.appendChild(actions);

    card.appendChild(thumb);
    card.appendChild(body);
    return card;
  }

  function makeFabricPreview(color) {
    const d = document.createElement("div");
    d.className = "fabric-preview";
    d.style.background = `repeating-linear-gradient(90deg,
      ${shadeCss(color, -0.28)} 0px,
      ${shadeCss(color, 0.18)} 9px,
      ${shadeCss(color, -0.28)} 18px)`;
    return d;
  }

  function shadeCss(hex, amt) {
    const h = hex.replace("#", "");
    const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(v, 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = (c) => Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }

  /* ----------------------- Simulator ----------------------- */
  function selectForSimulation(p, scroll) {
    activeProduct = p;
    Simulator.set({
      color: p.colors[0],
      style: p.style,
      opacity: p.opacity,
      sheerProduct: p.sheer,
    });
    // Update panel info & kontrol
    document.getElementById("sim-product-name").textContent = p.nama;
    document.getElementById("sim-product-cat").textContent = p.kategori + " · " + p.bahan;

    // Warna
    const colorWrap = document.getElementById("sim-colors");
    colorWrap.innerHTML = "";
    p.colors.forEach((c, i) => {
      const s = document.createElement("button");
      s.className = "sw-btn" + (i === 0 ? " active" : "");
      s.style.background = c;
      s.title = c;
      s.onclick = () => {
        document.querySelectorAll("#sim-colors .sw-btn").forEach((x) => x.classList.remove("active"));
        s.classList.add("active");
        Simulator.set({ color: c });
        syncCustomColor(c);
        updatePriceEstimate();
      };
      colorWrap.appendChild(s);
    });

    // Set style aktif di tombol model
    document.querySelectorAll("#sim-styles .seg-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.style === p.style);
    });
    syncCustomColor(p.colors[0]);
    updatePriceEstimate();
    if (scroll) {
      document.getElementById("simulator").scrollIntoView({ behavior: "smooth" });
    }
  }

  function buildSimulatorControls() {
    // Ruangan
    const roomWrap = document.getElementById("sim-rooms");
    roomWrap.innerHTML = "";
    ROOMS.forEach((r, i) => {
      const b = document.createElement("button");
      b.className = "room-btn" + (i === 0 ? " active" : "");
      b.innerHTML = `<span>${r.emoji}</span>${r.nama}`;
      b.onclick = () => {
        document.querySelectorAll("#sim-rooms .room-btn").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        Simulator.set({ room: r.id });
        document.getElementById("upload-zone").style.display = r.id === "upload" ? "block" : "none";
      };
      roomWrap.appendChild(b);
    });

    // Model / style
    const styleWrap = document.getElementById("sim-styles");
    styleWrap.innerHTML = "";
    STYLES.forEach((s) => {
      const b = document.createElement("button");
      b.className = "seg-btn";
      b.dataset.style = s.id;
      b.innerHTML = `<strong>${s.nama.split(" ")[0]}</strong><small>${s.desc}</small>`;
      b.onclick = () => {
        document.querySelectorAll("#sim-styles .seg-btn").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        Simulator.set({ style: s.id });
      };
      styleWrap.appendChild(b);
    });

    // Buka/tutup slider
    const open = document.getElementById("sim-open");
    open.oninput = () => Simulator.set({ openness: parseFloat(open.value) / 100 });

    // Vitrase toggle
    const vit = document.getElementById("sim-vitrase");
    vit.onchange = () => Simulator.set({ vitrase: vit.checked });

    // Custom color
    const cc = document.getElementById("sim-custom-color");
    cc.oninput = () => {
      Simulator.set({ color: cc.value });
      document.querySelectorAll("#sim-colors .sw-btn").forEach((x) => x.classList.remove("active"));
      updatePriceEstimate();
    };

    // Ukuran
    const lebar = document.getElementById("sim-lebar");
    const tinggi = document.getElementById("sim-tinggi");
    [lebar, tinggi].forEach((el) =>
      el.addEventListener("input", () => {
        Simulator.set({ lebar: +lebar.value || 0, tinggi: +tinggi.value || 0 });
        updatePriceEstimate();
      })
    );

    // Tombol tambah ke keranjang dari simulator
    document.getElementById("sim-add").onclick = addConfiguredToCart;
    // Unduh hasil simulasi
    document.getElementById("sim-download").onclick = downloadSimulation;
  }

  function syncCustomColor(hex) {
    document.getElementById("sim-custom-color").value = toHex(hex);
  }
  function toHex(c) {
    if (c.startsWith("#")) return c;
    const m = c.match(/\d+/g);
    if (!m) return "#000000";
    return "#" + m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("");
  }

  function estimatePrice() {
    const st = Simulator.getState();
    const lebarM = (st.lebar || 0) / 100;
    const tinggiFactor = Math.max(1, (st.tinggi || 250) / 250); // tinggi >2.5m menambah kebutuhan kain
    const base = activeProduct ? activeProduct.pricePerMeter : 150000;
    const total = Math.round((base * lebarM * tinggiFactor) / 1000) * 1000;
    return Math.max(total, base); // minimal 1 meter
  }

  function updatePriceEstimate() {
    document.getElementById("sim-price").textContent = RUPIAH.format(estimatePrice());
  }

  function downloadSimulation() {
    const a = document.createElement("a");
    a.href = Simulator.toDataURL();
    a.download = `simulasi-${(activeProduct?.id || "gorden")}.png`;
    a.click();
  }

  /* ----------------------- Upload foto ----------------------- */
  function bindUpload() {
    const input = document.getElementById("file-input");
    const zone = document.getElementById("upload-zone");
    input.addEventListener("change", (e) => handleFiles(e.target.files));
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag");
      handleFiles(e.dataTransfer.files);
    });

    // Slider posisi jendela (mode upload)
    ["win-x", "win-y", "win-w", "win-h"].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener("input", () => {
        const st = Simulator.getState();
        const win = { ...st.win };
        win.x = +document.getElementById("win-x").value / 100;
        win.y = +document.getElementById("win-y").value / 100;
        win.w = +document.getElementById("win-w").value / 100;
        win.h = +document.getElementById("win-h").value / 100;
        Simulator.set({ win });
      });
    });
  }

  function handleFiles(files) {
    if (!files || !files[0]) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Mohon unggah file gambar (JPG/PNG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        Simulator.setBackgroundImage(img);
        // Aktifkan ruangan 'upload'
        document.querySelectorAll("#sim-rooms .room-btn").forEach((x) => x.classList.remove("active"));
        const uploadBtn = [...document.querySelectorAll("#sim-rooms .room-btn")].find((b) =>
          b.textContent.includes("Foto Saya")
        );
        if (uploadBtn) uploadBtn.classList.add("active");
        Simulator.set({ room: "upload" });
        document.getElementById("win-adjust").style.display = "block";
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* ----------------------- Keranjang ----------------------- */
  function quickAdd(p) {
    cart.push({
      id: p.id,
      nama: p.nama,
      warna: p.colors[0],
      style: p.style,
      lebar: 200,
      tinggi: 250,
      harga: p.pricePerMeter * 2, // estimasi 2 meter default
      qty: 1,
    });
    saveCart();
    updateCartUI();
    toast(`${p.nama} ditambahkan ke keranjang`);
  }

  function addConfiguredToCart() {
    if (!activeProduct) return;
    const st = Simulator.getState();
    cart.push({
      id: activeProduct.id,
      nama: activeProduct.nama,
      warna: st.color,
      style: st.style,
      lebar: st.lebar,
      tinggi: st.tinggi,
      harga: estimatePrice(),
      qty: 1,
    });
    saveCart();
    updateCartUI();
    toast(`${activeProduct.nama} (custom) ditambahkan ke keranjang`);
    openCart();
  }

  function updateCartUI() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    document.getElementById("cart-count").textContent = count;
    const list = document.getElementById("cart-items");
    list.innerHTML = "";
    if (cart.length === 0) {
      list.innerHTML = `<p class="empty">Keranjang masih kosong. Yuk pilih gorden favorit Anda! 🪟</p>`;
      document.getElementById("cart-total").textContent = RUPIAH.format(0);
      document.getElementById("checkout-btn").disabled = true;
      return;
    }
    document.getElementById("checkout-btn").disabled = false;
    cart.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <span class="cart-color" style="background:${item.warna}"></span>
        <div class="cart-info">
          <strong>${item.nama}</strong>
          <small>${styleName(item.style)} · ${item.lebar}×${item.tinggi} cm</small>
        </div>
        <div class="cart-qty">
          <button data-act="dec">−</button>
          <span>${item.qty}</span>
          <button data-act="inc">+</button>
        </div>
        <div class="cart-line">${RUPIAH.format(item.harga * item.qty)}</div>
        <button class="cart-del" data-act="del">×</button>
      `;
      row.querySelector('[data-act="inc"]').onclick = () => { item.qty++; saveCart(); updateCartUI(); };
      row.querySelector('[data-act="dec"]').onclick = () => { item.qty = Math.max(1, item.qty - 1); saveCart(); updateCartUI(); };
      row.querySelector('[data-act="del"]').onclick = () => { cart.splice(idx, 1); saveCart(); updateCartUI(); };
      list.appendChild(row);
    });
    const total = cart.reduce((s, i) => s + i.harga * i.qty, 0);
    document.getElementById("cart-total").textContent = RUPIAH.format(total);
  }

  function styleName(id) {
    const s = STYLES.find((x) => x.id === id);
    return s ? s.nama.split(" ")[0] : id;
  }

  function bindCheckout() {
    document.getElementById("checkout-btn").onclick = () => {
      if (cart.length === 0) return;
      let msg = `Halo ${TOKO.nama}, saya mau pesan gorden:%0A%0A`;
      cart.forEach((i, n) => {
        msg += `${n + 1}. ${i.nama} (${styleName(i.style)})%0A`;
        msg += `   Warna: ${i.warna} | Ukuran: ${i.lebar}x${i.tinggi} cm | Qty: ${i.qty}%0A`;
        msg += `   Subtotal: ${RUPIAH.format(i.harga * i.qty)}%0A`;
      });
      const total = cart.reduce((s, i) => s + i.harga * i.qty, 0);
      msg += `%0ATotal estimasi: ${RUPIAH.format(total)}%0A%0AMohon info ketersediaan & ongkir. Terima kasih!`;
      const url = `https://wa.me/${TOKO.whatsapp}?text=${msg}`;
      window.open(url, "_blank");
    };
  }

  /* ----------------------- Persistensi ----------------------- */
  function saveCart() {
    try { localStorage.setItem("gorden_cart", JSON.stringify(cart)); } catch (e) {}
  }
  function loadCart() {
    try {
      const raw = localStorage.getItem("gorden_cart");
      if (raw) cart = JSON.parse(raw);
    } catch (e) { cart = []; }
  }

  /* ----------------------- Navigasi & UI ----------------------- */
  function bindNav() {
    document.querySelectorAll("[data-nav]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(a.dataset.nav);
        if (target) target.scrollIntoView({ behavior: "smooth" });
        document.getElementById("nav-menu").classList.remove("open");
      });
    });
    document.getElementById("cart-toggle").onclick = openCart;
    document.getElementById("cart-close").onclick = () =>
      document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("overlay").onclick = () => {
      document.getElementById("cart-drawer").classList.remove("open");
      document.getElementById("overlay").classList.remove("show");
    };
    document.getElementById("menu-toggle").onclick = () =>
      document.getElementById("nav-menu").classList.toggle("open");
    document.getElementById("hero-cta").onclick = () =>
      document.getElementById("simulator").scrollIntoView({ behavior: "smooth" });
    document.getElementById("hero-cta2").onclick = () =>
      document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
  }

  function openCart() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("overlay").classList.add("show");
  }

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
