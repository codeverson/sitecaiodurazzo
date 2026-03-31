/**
 * Crazy Legs — colagem editorial + press release (texto integral).
 * Substituir `pressReleaseParagraphs` pelo CL 01.docx quando necessário.
 */

export const crazyLegsVideos = [
  {
    id: "v1SzXXPfH1Y",
    label: "Clipe",
    tag: "CLIPE",
  },
  {
    id: "PIzR9eiTE8k",
    label: "Walldorf - Alemanha",
    tag: "WALLDORF - ALEMANHA",
  },
  {
    id: "COPijPb-YQk",
    label: "Las Vegas",
    tag: "LAS VEGAS",
  },
] as const;

export function youtubeThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbed(id: string, autoplay = false) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
}

export const crazyLegsYoutubeId = crazyLegsVideos[0].id;
export const crazyLegsYoutubeUrl = "https://www.youtube.com/@Sonnyrockerbass";
export const crazyLegsYoutubeThumb = youtubeThumb(crazyLegsVideos[0].id);

export const crazyLegsIntro = {
  title: "Crazy Legs",
  seoDescription:
    "Crazy Legs em página dedicada no site de Caio Durazzo: trajetória da banda, circulação internacional, vídeos, press release e contatos.",
  subtitle: "Rockabilly brasileiro com circulação internacional desde 1996",
  paragraphs: [
    "Formado em São Paulo em 1996, o Crazy Legs se consolidou como uma das referências do rockabilly brasileiro, com uma trajetória construída entre estrada, circuito independente e fidelidade ao som de raiz.",
    "Ao longo de mais de duas décadas, a banda reuniu lançamentos no Brasil e no exterior, incluindo discos de estúdio, registros ao vivo e edições em vinil, mantendo presença constante na cena nacional.",
    "A circulação internacional levou o grupo a festivais e encontros de referência do gênero, com apresentações na Europa e nos Estados Unidos, incluindo passagens por eventos como o Rock'n'Roll Weekender, na Alemanha, e o Viva Las Vegas.",
  ],
} as const;

export const crazyLegsInstitutional = {
  kicker: "ROCKABILLY BRASILEIRO",
  title: "Rockabilly brasileiro desde 1996",
  paragraphs: [
    "Fundado em São Paulo em 1996, o Crazy Legs é um trio brasileiro de rockabilly que construiu sua trajetória a partir do palco, da circulação constante e da permanência dentro de uma cena altamente especializada. Registros públicos situam a banda como um nome ativo dentro do gênero desde meados dos anos 1990.",
    "Ao longo da carreira, o grupo consolidou seu nome no circuito nacional e também levou seu trabalho ao exterior, com presença associada a apresentações e circulação em mercados ligados ao rockabilly na Europa e nos Estados Unidos.",
    "Com lançamentos registrados no início dos anos 2000 e uma história construída entre discos, festivais e repertório autoral, o Crazy Legs se firmou como uma referência dentro do rockabilly brasileiro, conectando a cena local a uma projeção mais ampla ao longo dos anos.",
  ],
} as const;

export const crazyLegsClosing = {
  kicker: "LEGADO",
  title: "Um nome importante do rockabilly brasileiro",
  paragraphs: [
    "Na trajetória musical de Caio Durazzo, o Crazy Legs ocupa um lugar central pela consistência de palco, pelo repertório construído ao longo dos anos e pela circulação que levou a banda do circuito brasileiro a festivais e públicos no exterior.",
    "Mais do que um capítulo de carreira, o Crazy Legs permanece como uma referência dentro dessa linguagem musical e como um dos nomes que ajudaram a consolidar o rockabilly brasileiro em sua cena.",
  ],
} as const;

export const pressReleaseParagraphs: string[] = [
  "Tudo começou na Galeria do Rock, quando conheci Sonny. Fomos apresentados por um amigo em comum, pois ambos estávamos atrás de músicos para formar uma banda de rockabilly. A partir deste dia, estava começando uma grande amizade e também uma história.",
  "Logo depois, formamos juntamente com outros amigos, uma banda de rockabilly chamada “Outsiders”, que durou até 1995.",
  "Deste trabalho foi adquirido muita experiência musical, conhecimentos sobre o rockabilly e suas origens (instrumentos, timbres,etc..). No ano seguinte, mais precisamente em Agosto de 1996, foi formada a banda Crazy Legs, que ao longo dos anos se consolidou como a principal banda brasileira no estilo, tendo se apresentado nas mais diversas casas noturnas de São Paulo, interior e outros estados. A banda mudou de formação algumas vezes, mas sempre foi mantida aquela velha parceria de baixista e baterista.",
  "Em fevereiro de 2001, foi lançado o primeiro CD da banda intitulado “Off Society Rules” pelo selo independente “13 Records”. Foi justamente na divulgação deste CD, que a banda conseguiu se apresentar em vários programas de televisão como: Musikaos (TV Cultura), Calçadão (Rede 21), Rede Mulher, Rede Globo de Campinas. Também o CD foi divulgado em emissoras de rádio como 89 FM, Brasil 2000.",
  "Este Cd também foi um gancho para que o Crazy Legs ficasse conhecido no exterior, onde foram escritas reviews em sites especializados no gênero, bem como tendo músicas veiculadas em programas de rádio dos Estados Unidos e Europa, alcançando críticas positivas. Através de todo este processo a banda Crazy Legs é tida como referêncial no exterior, quando o assunto é rockabilly brasileiro.",
];

export const crazyLegsPressMeta = {
  documentCitation: "release CL 01.docx",
} as const;

export const crazyLegsContact = {
  instagramLabel: "@crazylegstrio",
  instagramHref: "https://www.instagram.com/crazylegstrio/",
  spotifyLabel: "Crazy Legs no Spotify",
  spotifyHref: "https://open.spotify.com/intl-pt/artist/2c0rR1wjDa3BhdkRFWCop8",
  email: "crazylegsbr@gmail.com",
} as const;
