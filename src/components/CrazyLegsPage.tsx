import { useEffect } from "react";
import CrazyLegsClosingSection from "./CrazyLegsClosingSection";
import { crazyLegsIntro } from "../data/crazyLegsEditorial";
import CrazyLegsDiscographySection from "./CrazyLegsDiscographySection";
import CrazyLegsIntroSection from "./CrazyLegsIntroSection";
import CrazyLegsSection from "./CrazyLegsSection";

export default function CrazyLegsPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${crazyLegsIntro.title} | Caio Durazzo`;

    let meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", crazyLegsIntro.seoDescription);

    return () => {
      document.title = prevTitle;
      if (prevDescription != null) {
        meta?.setAttribute("content", prevDescription);
      }
    };
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
