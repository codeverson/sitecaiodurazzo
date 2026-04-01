import { useState } from "react";
import { useHeroSlides } from "../context/HeroSlidesContext";
import { uploadImageToHostinger } from "../lib/hostingerUploads";

const adminDivider = "border-white/[0.15]";

const field =
  "w-full border border-white/40 bg-black/80 px-4 py-3.5 font-serif text-sm text-white placeholder:text-white/55 transition-[border-color,box-shadow] focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/35 focus:shadow-[0_0_0_1px_rgba(198,161,91,0.25)]";

const label =
  "mb-2 block font-display text-[10px] tracking-[0.28em] text-white/85";

const sectionTitle = "font-heading text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl";

function parseObjectPosition(pos: string): { x: number; y: number } {
  const match = pos.match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
  if (match) {
    return { x: Number(match[1]), y: Number(match[2]) };
  }
  if (pos.startsWith("center")) {
    const y = Number(pos.match(/(\d+(?:\.\d+)?)%/)?.[1] ?? 50);
    return { x: 50, y };
  }
  return { x: 50, y: 50 };
}

export default function AdminHeroPanel({
  showToast,
}: {
  showToast: (msg: string) => void;
}) {
  const { slides, setSlide, moveSlide, addSlide, removeSlide, resetSlideImage, maxFileBytes } =
    useHeroSlides();

  return (
    <div className="mx-auto max-w-[100rem] px-5 py-12 sm:px-9 lg:px-12 lg:py-16">
      <div className={`mb-10 border-b ${adminDivider} pb-8`}>
        <h3 className={sectionTitle}>Fotos do hero</h3>
        <p className="mt-4 max-w-2xl font-serif text-sm italic leading-relaxed text-white/78">
          Troque imagens, reordene os slides e ajuste o enquadramento para centralizar melhor cada
          foto. As alterações são publicadas no Firestore e o upload vai direto para a hospedagem.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              addSlide();
              showToast("Novo slide adicionado.");
            }}
            className="border border-[#c6a15b] bg-[#c6a15b] px-6 py-3.5 font-display text-[9px] tracking-[0.22em] text-black transition-colors hover:bg-[#d4b56e]"
          >
            ADICIONAR FOTO
          </button>
        </div>
      </div>

      <ul className="divide-y divide-white/[0.12]">
        {slides.map((slide, index) => {
          const { x, y } = parseObjectPosition(slide.objectPosition);

          return (
            <li key={slide.id} className="py-8 sm:py-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
                <div className="shrink-0 space-y-4">
                  <div className="relative h-40 w-40 overflow-hidden border border-white/25 bg-black/60 sm:h-44 sm:w-44">
                    <img
                      src={slide.src}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{ objectPosition: slide.objectPosition }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveSlide(slide.id, -1)}
                      disabled={index === 0}
                      className="border border-white/30 px-3 py-2 font-display text-[8px] tracking-[0.22em] text-white/75 transition-colors hover:border-[#c6a15b] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                    >
                      SUBIR
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSlide(slide.id, 1)}
                      disabled={index === slides.length - 1}
                      className="border border-white/30 px-3 py-2 font-display text-[8px] tracking-[0.22em] text-white/75 transition-colors hover:border-[#c6a15b] hover:text-white disabled:pointer-events-none disabled:opacity-25"
                    >
                      DESCER
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeSlide(slide.id);
                        showToast(slides.length <= 1 ? "O hero precisa ter ao menos um slide." : "Slide removido.");
                      }}
                      className="border border-white/30 px-3 py-2 font-display text-[8px] tracking-[0.22em] text-white/75 transition-colors hover:border-red-300/70 hover:text-red-200"
                    >
                      REMOVER
                    </button>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-5">
                  <div>
                    <p className="font-display text-[8px] tracking-[0.32em] text-[#c6a15b]/90">
                      SLIDE {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 font-heading text-lg font-bold uppercase tracking-[0.06em] text-white">
                      {slide.label}
                    </p>
                  </div>

                  <div>
                    <label className={label} htmlFor={`hero-label-${slide.id}`}>
                      Rótulo interno
                    </label>
                    <input
                      id={`hero-label-${slide.id}`}
                      type="text"
                      value={slide.label}
                      onChange={(e) => setSlide(slide.id, { label: e.target.value })}
                      className={field}
                    />
                  </div>

                  <div>
                    <label className={label} htmlFor={`hero-file-${slide.id}`}>
                      Enviar arquivo
                    </label>
                    <input
                      id={`hero-file-${slide.id}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="block w-full max-w-md font-serif text-xs text-white/80 file:mr-4 file:border file:border-white/35 file:bg-black/80 file:px-4 file:py-2 file:font-display file:text-[9px] file:tracking-[0.2em] file:text-white hover:file:border-[#c6a15b]/55"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith("image/")) {
                          showToast("Escolha um arquivo de imagem.");
                          return;
                        }
                        if (file.size > maxFileBytes) {
                          showToast("Arquivo grande demais para o hero.");
                          return;
                        }
                        void uploadImageToHostinger("hero", file)
                          .then((fileUrl) => {
                            setSlide(slide.id, { src: fileUrl });
                            showToast("Imagem enviada para a hospedagem.");
                          })
                          .catch((error: unknown) => {
                            const message = error instanceof Error ? error.message : "Nao foi possivel enviar a imagem.";
                            showToast(message);
                          });
                        e.target.value = "";
                      }}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={label}>Enquadramento horizontal</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={x}
                        onChange={(e) => setSlide(slide.id, { objectPosition: `${e.target.value}% ${y}%` })}
                        className="w-full accent-[#c6a15b]"
                      />
                    </div>
                    <div>
                      <label className={label}>Enquadramento vertical</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={y}
                        onChange={(e) => setSlide(slide.id, { objectPosition: `${x}% ${e.target.value}%` })}
                        className="w-full accent-[#c6a15b]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setSlide(slide.id, { objectPosition: "50% 50%" })}
                      className="border border-white/30 px-4 py-3 font-display text-[9px] tracking-[0.22em] text-white/75 transition-colors hover:border-[#c6a15b] hover:text-white"
                    >
                      CENTRALIZAR
                    </button>
                    <button
                      type="button"
                      onClick={() => resetSlideImage(slide.id)}
                      className="border border-white/30 px-4 py-3 font-display text-[9px] tracking-[0.22em] text-white/75 transition-colors hover:border-[#c6a15b] hover:text-white"
                    >
                      RESTAURAR FOTO
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
