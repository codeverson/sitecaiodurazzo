/**
 * Ambientação global do site.
 * Fundo contínuo com progressão vertical sutil.
 * Base em #220C10, profundidade por luminância e ruído leve para evitar banding.
 */
export default function SiteAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#220C10_0%,#1E0A0E_18%,#18080B_38%,#120609_58%,#090406_80%,#000000_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_42%_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_34%_22%_at_18%_24%,rgba(255,255,255,0.018)_0%,transparent_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_38%_24%_at_82%_46%,rgba(255,255,255,0.014)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_52%,rgba(0,0,0,0.12)_74%,rgba(0,0,0,0.26)_88%,rgba(0,0,0,0.4)_100%)]" />
      <div className="absolute inset-0 bg-film-grain-section opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}
