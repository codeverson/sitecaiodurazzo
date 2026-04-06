import { useEffect } from "react";
import CrazyLegsClosingSection from "./CrazyLegsClosingSection";
import CrazyLegsDiscographySection from "./CrazyLegsDiscographySection";
import CrazyLegsIntroSection from "./CrazyLegsIntroSection";
import CrazyLegsSection from "./CrazyLegsSection";

export default function CrazyLegsPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1366px)").matches) return;
    if (window.location.hash === "#palco") return;

    const el = document.getElementById("crazy-legs-intro");
    if (!el) return;

    const id = window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <main className="bg-transparent text-cd-mist">
      <CrazyLegsSection />
      <CrazyLegsIntroSection />
      <CrazyLegsDiscographySection />
      <CrazyLegsClosingSection />
    </main>
  );
}
