/**
 * Degradês verticais #1F080E para transições entre seções (DA).
 * Colocar dentro da <section> após camadas de fundo; conteúdo permanece em z-10+.
 */
export function SectionBridgeTop({ soft }: { soft?: boolean }) {
  return <div aria-hidden className={soft ? "cd-section-bridge-top-soft" : "cd-section-bridge-top"} />;
}

export function SectionBridgeBottom({ soft }: { soft?: boolean }) {
  return <div aria-hidden className={soft ? "cd-section-bridge-bottom-soft" : "cd-section-bridge-bottom"} />;
}
