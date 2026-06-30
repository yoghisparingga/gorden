import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Simulator from "./sim/Simulator.jsx";
import Catalog from "./components/Catalog.jsx";
import { Steps, CTA, Footer } from "./components/Sections.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <Simulator />
      <Catalog />
      <Steps />
      <CTA />
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
