import CrazyLegsClosingSection from "./CrazyLegsClosingSection";
import CrazyLegsDiscographySection from "./CrazyLegsDiscographySection";
import CrazyLegsIntroSection from "./CrazyLegsIntroSection";
import CrazyLegsSection from "./CrazyLegsSection";

export default function CrazyLegsPage() {
  return (
    <main className="bg-transparent text-cd-mist">
      <CrazyLegsSection />
      <CrazyLegsIntroSection />
      <CrazyLegsDiscographySection />
      <CrazyLegsClosingSection />
    </main>
  );
}
