export type SocialPlatform = "instagram" | "youtube" | "spotify";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

export type BioModule = {
  id: string;
  label: string;
  body: string;
};

export type HeroModel = {
  navItems: Array<{ label: string; href: string }>;
  title: string; // nome do artista
  headline: string;
  supportText: string;
  bioTitle: string;
  bioParagraphs: string[];
  /** Módulos editoriais (bio em capítulos curtos). */
  bioModules: BioModule[];
  bioPhotoCaption?: string;
  socials: SocialLink[];
  // Cinematic hero (A/B)
  posterVariants: Array<{
    kicker: string;
    title: string;
    sub: string;
    finalLine: string;
  }>;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };

  // Legacy fields (kept for future CMS integration)
  ctaLabel: string;
  releaseLinkLabel: string;
  release: {
    title: string;
    text: string;
    finalHeadline: string;
    finalText: string;
    finalButtonLabel: string;
    finalButtonHref: string;
  };
};

export const heroData: HeroModel = {
  navItems: [
    { label: "Sobre", href: "#bio" },
    { label: "Canal", href: "#youtube" },
    { label: "Agenda", href: "#agenda" },
    { label: "Discografia", href: "#discos" },
    { label: "Crazy Legs", href: "/crazy-legs" },
    { label: "Aulas", href: "/aulas" },
    { label: "Contratar", href: "#booking" },
  ],
  title: "Caio Durazzo",
  headline: "Rock and roll sem frescura. Sem filtro. Sem papas na língua.",
  supportText:
    "Diretamente de São Paulo, Caio Durazzo está na estrada com sua One Man Band desde 2011, levando para o palco um show único, cru, dinâmico e cheio de personalidade. Um artista que transforma voz, guitarra, ritmo e presença em uma experiência que soa como uma banda inteira.",
  bioTitle: "Uma vida dedicada ao rock and roll.",
  bioParagraphs: [
    "Cantor, compositor e guitarrista, Caio Durazzo carrega uma trajetória que atravessa décadas, bandas, palcos e estrada. Da cena underground ao palco com nomes importantes do rock nacional, construiu um trabalho autoral com raízes nos anos 50, atitude punk e letras que falam da vida real: cerveja gelada, mulher quente e rock and roll.",
    "Caio Durazzo atua no mercado musical há décadas. Ao longo da trajetória, passou por diferentes projetos e bandas, consolidando sua identidade como cantor, compositor e guitarrista.",
    "Com a One Man Band, já soma mais de 700 apresentações, passando por quase todos os estados do Brasil e também por Portugal. No palco, entrega um show de impacto, com repertório autoral e releituras que passeiam pelo rock dos anos 50, punk rock, rockabilly e outros estilos que moldam sua sonoridade.",
    "Mais do que revisitar referências, Caio construiu um som próprio: direto, vivo, sem nostalgia fabricada. É rock de verdade, com sotaque de rua, pegada vintage e letras em português que falam do presente.",
  ],
  bioModules: [
    {
      id: "trajetoria",
      label: "Trajetória",
      body: "Cantor, compositor e guitarrista, Caio Durazzo atravessa décadas, bandas, palcos e estrada. Da cena underground ao palco com nomes importantes do rock nacional, construiu um trabalho autoral com raízes nos anos 50, atitude punk e letras que falam da vida real: cerveja gelada, mulher quente e rock and roll.",
    },
    {
      id: "estrada",
      label: "Estrada",
      body: "Ao longo de muitos anos de estrada, consolidou identidade como intérprete e autor em projetos e formações diferentes — sempre com a mesma pegada: presença, verdade e intensidade.",
    },
    {
      id: "projetos",
      label: "Projetos",
      body: "Com a One Man Band, são mais de 700 apresentações entre Brasil e Portugal. No palco, entrega impacto com repertório autoral e releituras que passeiam pelo rock dos anos 50, punk rock, rockabilly e tudo o que molda sua linguagem.",
    },
    {
      id: "identidade",
      label: "Identidade sonora",
      body: "Mais do que revisitar referências, construiu um som próprio: direto, vivo, sem nostalgia fabricada. Rock de verdade, com sotaque de rua, pegada vintage e letras em português que falam do presente.",
    },
  ],
  bioPhotoCaption: "Arquivo de estrada · apresentação ao vivo",
  socials: [
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/durazzocaio/",
    },
    {
      platform: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/@CAIODURAZZO",
    },
    {
      platform: "spotify",
      label: "Spotify",
      href: "https://open.spotify.com/intl-pt/artist/6jW2ucYZlCafpH8MOrD4Ty",
    },
  ],
  posterVariants: [
    {
      kicker: "ONDE O ROCK ACONTECE",
      title: "CAIO DURAZZO",
      sub: "ROCK AND ROLL SEM FRESCURA",
      finalLine: "SEM FILTRO. SEM PAPAS NA LÍNGUA.",
    },
    {
      kicker: "NA ESTRADA",
      title: "CAIO DURAZZO",
      sub: "ROCK DE VERDADE",
      finalLine: "SEM NOSTALGIA. SEM RÓTULO. SEM DESCULPA.",
    },
  ],
  ctaPrimary: { label: "VER AGENDA", href: "#agenda" },
  ctaSecondary: { label: "OUÇA AGORA", href: "#discos" },

  ctaLabel: "VER AGENDA",
  releaseLinkLabel: "OUÇA AGORA",
  release: {
    title: "Caio Durazzo One Man Band",
    text:
      "Diretamente de São Paulo, Caio Durazzo está na estrada com sua One Man Band desde 2011. Em um formato onde uma única pessoa executa múltiplos instrumentos simultaneamente, o artista entrega um show dinâmico, autoral e carregado de personalidade. Com mais de 700 apresentações no currículo, Caio mistura composições próprias com releituras de rock dos anos 50, punk rock e rockabilly, sempre com uma linguagem direta, sem frescura e sem papas na língua.",
    finalHeadline: "Caio Durazzo não faz pose. Faz show.",
    finalText:
      "Entre, conheça a trajetória, ouça os discos e acompanhe a próxima data.",
    finalButtonLabel: "Ver agenda",
    finalButtonHref: "#agenda",
  },
};
