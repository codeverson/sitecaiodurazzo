/** Quantas vezes o trecho base é repetido em cada metade do loop (evita faixa “vazia” em telas largas). */
const UNITS_PER_HALF = 12;

type MarqueeStripProps = {
  /** Um ciclo de texto (será repetido internamente). */
  unit: string;
  spanClassName: string;
  /** Classes do container flex animado (ex.: motion-reduce). */
  trackClassName?: string;
};

export default function MarqueeStrip({ unit, spanClassName, trackClassName }: MarqueeStripProps) {
  const normalized = unit.trim().length ? (unit.endsWith(" ") ? unit : `${unit} `) : "· ";
  const segment = normalized.repeat(UNITS_PER_HALF);

  return (
    <div className={trackClassName ?? "flex w-max animate-marquee"}>
      <span className={`shrink-0 whitespace-nowrap px-16 ${spanClassName}`}>{segment}</span>
      <span className={`shrink-0 whitespace-nowrap px-16 ${spanClassName}`}>{segment}</span>
    </div>
  );
}
