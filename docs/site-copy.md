# Copy do site — Caio Durazzo

Documento consolidado dos textos usados (ou disponíveis) no projeto.  
**Gerado a partir do código:** `src/data/siteCopy.ts`, `src/data/mock.ts`, `src/data/crazyLegsEditorial.ts`, `src/data/discographyData.ts`, `src/data/exampleShows.ts`, mais strings fixas em componentes.

---

## Fontes por seção

| Área | Arquivo principal |
|------|-------------------|
| Hero | `siteCopy.ts` → `heroCopy` |
| Bio | `siteCopy.ts` → `bioCopy` |
| Agenda (títulos / vazio) | `siteCopy.ts` → `agendaCopy` |
| Discografia (bloco editorial) | `siteCopy.ts` → `discographyCopy` |
| Release / Imprensa | `siteCopy.ts` → `releaseCopy` |
| Aulas + CTA final | `siteCopy.ts` → `lessonsCopy`, `ctaCopy` |
| Rodapé (linha tagline) | `siteCopy.ts` → `footerCopy` |
| Menu + redes + marca rodapé | `mock.ts` → `heroData.navItems`, `heroData.socials`; `App.tsx` → `brandTitle` do Footer |
| Crazy Legs | `crazyLegsEditorial.ts` |
| Lançamentos (lista) | `discographyData.ts` |
| Exemplos de shows (fallback) | `exampleShows.ts` |
| Contato (e-mail / telefone) | Hardcoded em `Footer.tsx` |

---

## Hero (`heroCopy`)

- **Kicker:** Desde os anos 90  
- **Título:** CAIO DURAZZO  
- **Deck (pôster):** ROCK N ROLL  
- **Subtitle (rodapé do hero):** One Man Band · Rock’n Roll  
- **Lead:** Músico atuante desde os anos 90, com trajetória construída no palco e atuação em diferentes projetos dentro do rock nacional e do rockabilly.  
- **Canto (micro):** São Paulo · estrada · palco  
- **CTA:** Ver agenda · Ouça agora  

---

## Bio (`bioCopy`)

- **Rótulo:** MANIFESTO (`kicker`)  
- **Nome acima do título:** duas linhas `CAIO` / `DURAZZO` (`nameAboveTitleLines`)  
- **Título:** Uma trajetória construída no palco  
- **Parágrafos** (`paragraphs`): texto corrido institucional em quatro blocos (música ao vivo, rock’n’roll / rockabilly desde os anos 1990; Trio, One Man Band, Crazy Legs, Europa/EUA, mais de 2.000 shows; repertório autoral e estrada; continuidade e presença na cena).  
- **Legenda:** Arquivo · trajetória e palco  

---

## Agenda (`agendaCopy`)

- **Título:** Agenda  
- **Subtítulo:** Próximos shows  
- **Nota:** Apresentações realizadas em formato ao vivo, sem uso de trilhas pré-gravadas.  
- **Vazio:** Nenhum show agendado no momento.  

---

## Discografia — texto editorial (`discographyCopy`)

- **Label:** Discografia  
- **Headline:** Acervo  
- **Texto:** A discografia acompanha as diferentes fases de atuação do artista, reunindo projetos autorais, participações e registros ao vivo.  

### Acervo (lista — `discographyData`)

**Crazy Legs** — Vocal/Guitarra  

| Ano | Título | Formato |
|-----|--------|---------|
| 2000 | Off Society Rules | Álbum |
| 2002 | Right on Time | Álbum |
| 2002 | Live to Win | Álbum |
| 2003 | Rockabilly Riot | Álbum |
| 2006 | Compacto duplo | Vinil |
| 2009 | Green Men From Mars | CD |
| 2009 | Cine-Lapa | DVD · Rio de Janeiro/RJ |
| 2005–2013 | Coletâneas distribuídas na Europa e EUA | Coletâneas |

**Caio Durazzo Rock N Roll Trio** — Vocal/Guitarra/Compositor  

| Ano | Título | Formato |
|-----|--------|---------|
| 2011 | Caio Durazzo Rock N Roll Trio | Álbum |
| 2013 | Rock Ducarazzo | Álbum |
| 2012 | Drinks And Parts | Coletânea |

**Caio Durazzo One Man Band** — Vocal/Guitarra/Bateria/Compositor  

| Ano | Título | Formato |
|-----|--------|---------|
| 2014 | Rock N Roll É UTI | Álbum |
| 2016 | Stay Rock Brazil | Bootleg |
| 2016 | Weirdo Fervo #2 | Vinil 12″ |

**Made in Brazil** — Guitarrista  

| Ano | Título | Formato |
|-----|--------|---------|
| 2009 | Rock de Verdade | Álbum |
| 2015 | 48 anos | DVD · Centro Cultural São Paulo |

**Alex Valenzi & The Hideaway Cats** — Guitarrista  

| Ano | Título | Formato |
|-----|--------|---------|
| 2008 | Rockabilly Join | DVD |

**Participações** — Vocal/Guitarra  

| Ano | Título | Formato |
|-----|--------|---------|
| 2007 | Pepe Bueno – Nariz de Porco Não É Tomada | Faixa: Garota de Má Sorte |
| 2005 | XX Feira de Artes da Vila Pompéia | Faixa: Galaxie500 |

**Demos**  

| Ano | Título | Formato |
|-----|--------|---------|
| 1998 | Os Véio | Demo |
| 2005 | Galaxie 500 | Demo |

---

## Release / Imprensa (`releaseCopy`)

> **Nota:** No código ainda é placeholder (Lorem ipsum).

- **Label:** Imprensa  
- **Headline:** Release  
- **Dek:** Recorte editorial · release oficial  
- **Corpo:**
  1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
  2. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  
  3. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  
  4. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  

---

## Crazy Legs (`crazyLegsEditorial`)

### Introdução (`crazyLegsIntro`)

- **Título:** Crazy Legs  
- **Subtítulo:** Rockabilly brasileiro com circulação internacional  
- **Parágrafos:**
  1. A banda paulista de rockabilly Crazy Legs conta com uma trajetória de vinte e sete anos, com seis álbuns lançados no Brasil e no exterior, incluindo registros em vinil e ao vivo.  
  2. O grupo também se apresentou em festivais internacionais como o Rock'n'Roll Weekender, na Alemanha, e o Viva Las Vegas, nos Estados Unidos, além de manter atuação consistente no circuito europeu e nacional.  

### Vídeos (rótulos na UI)

| Label | Tag |
|-------|-----|
| Arquivo | CLIPE |
| Alemanha · Weekender | EUROPA |
| Viva Las Vegas | USA |

### Press release (`pressReleaseParagraphs`)

1. Tudo começou no início dos anos 90, quando conheci Sonny na Galeria do Rock. Fomos apresentados por um amigo em comum, pois ambos estávamos atrás de músicos para formar uma banda de rockabilly. A partir deste dia, estava começando uma grande amizade e também uma história.  
2. Logo depois, formamos juntamente com outros amigos, uma banda de rockabilly chamada “Outsiders”, que durou até 1995.  
3. Deste trabalho foi adquirido muita experiência musical, conhecimentos sobre o rockabilly e suas origens (instrumentos, timbres,etc..). No ano seguinte, mais precisamente em Agosto de 1996, foi formada a banda Crazy Legs, que ao longo dos anos se consolidou como a principal banda brasileira no estilo, tendo se apresentado nas mais diversas casas noturnas de São Paulo, interior e outros estados. A banda mudou de formação algumas vezes, mas sempre foi mantida aquela velha parceria de baixista e baterista.  
4. Em fevereiro de 2001, foi lançado o primeiro CD da banda intitulado “Off Society Rules” pelo selo independente “13 Records”. Foi justamente na divulgação deste CD, que a banda conseguiu se apresentar em vários programas de televisão como: Musikaos (TV Cultura), Calçadão (Rede 21), Rede Mulher, Rede Globo de Campinas. Também o CD foi divulgado em emissoras de rádio como 89 FM, Brasil 2000.  
5. Este Cd também foi um gancho para que o Crazy Legs ficasse conhecido no exterior, onde foram escritas reviews em sites especializados no gênero, bem como tendo músicas veiculadas em programas de rádio dos Estados Unidos e Europa, alcançando críticas positivas. Através de todo este processo a banda Crazy Legs é tida como referêncial no exterior, quando o assunto é rockabilly brasileiro.  

### Citação / meta

- **Documento (referência):** release CL 01.docx (`crazyLegsPressMeta.documentCitation`)

### Contato Crazy Legs (`crazyLegsContact`)

- **Instagram (rótulo):** @crazylegstrio  
- **E-mail:** crazylegsbr@gmail.com  

---

## Aulas (`lessonsCopy`)

- **Título:** Aulas  
- **Lead:** As aulas abordam prática musical aplicada, execução de repertório e desenvolvimento de linguagem dentro do rock.  
- **Corpo:** A proposta prioriza a experiência direta com o instrumento e a dinâmica de palco.  
- **CTA:** Conhecer aulas  

---

## CTA final (`ctaCopy`)

- **Título:** Caio Durazzo  
- **Texto:** Informações sobre shows, agenda e projetos disponíveis nos canais oficiais.  
- **Botão:** Ver agenda  

---

## Rodapé

### `footerCopy`

- **Linha:** One Man Band · Rock’n Roll · São Paulo  

### `Footer.tsx` (fixo)

- **E-mail:** caiorocker@gmail.com  
- **Telefone:** (11) 97173-5293  
- **Heading REDES** (rótulo da coluna social)  

### Copyright

- © \[ano atual\] Caio Durazzo (`brandTitle` vindo de `App.tsx`)

---

## Navegação e redes (`heroData` em `mock.ts`)

Usado no **Header** e **Footer** (links de navegação + redes).

### Itens de menu

| Label | Âncora |
|-------|--------|
| Início | #top |
| Biografia | #bio |
| Agenda | #agenda |
| Discos | #discos |
| Aulas | #aulas |
| Contato | #contato |

### Redes (label · URL)

- Instagram · https://www.instagram.com/durazzocaio/  
- YouTube · https://www.youtube.com/@CAIODURAZZO  
- Spotify · https://open.spotify.com/intl-pt/artist/6jW2ucYZlCafpH8MOrD4Ty  

### Marca no header (hardcoded no componente)

- **Wordmark:** CAIO DURAZZO  

---

## Texto alternativo / legado em `mock.ts` (não é a bio do ar)

Estes campos existem em `heroData` mas a **Bio** renderizada na página usa `bioCopy` (`siteCopy.ts`).  
Útil como arquivo de copy extra / futura integração CMS.

- **title:** Caio Durazzo  
- **headline:** Rock and roll sem frescura. Sem filtro. Sem papas na língua.  
- **supportText:** Diretamente de São Paulo, Caio Durazzo está na estrada com sua One Man Band desde 2011, levando para o palco um show único, cru, dinâmico e cheio de personalidade. Um artista que transforma voz, guitarra, ritmo e presença em uma experiência que soa como uma banda inteira.  
- **bioTitle:** Uma vida dedicada ao rock and roll.  
- **bioParagraphs:** (4 parágrafos — ver ficheiro `mock.ts`)  
- **bioModules:** Trajetória, Estrada, Projetos, Identidade sonora — cada um com `label` e `body` (ver `mock.ts`)  
- **bioPhotoCaption:** Arquivo de estrada · apresentação ao vivo  
- **posterVariants:** variantes “ONDE O ROCK ACONTECE…” e “DESDE OS ANOS 90…” (ver `mock.ts`)  
- **ctaPrimary / ctaSecondary:** VER AGENDA · OUÇA AGORA  
- **release (bloco legado):** título “Caio Durazzo One Man Band”, texto longo, headline “Caio Durazzo não faz pose. Faz show.”, etc. (ver `mock.ts`)  

---

## Shows de exemplo (`EXAMPLE_SHOWS`)

Usados como dados iniciais quando não há agenda em `localStorage`.

1. **2026-04-18** 21:00 — Hangar 110, São Paulo/SP — R$ 40 — One Man Band.  
2. **2026-05-30** 20:30 — Bar Opinião, Porto Alegre/RS — R$ 35 · pré-venda — Show elétrico — 18+.  
3. **2026-07-12** 19:00 — Teatro Guaira, Curitiba/PR — R$ 55  
4. **2026-02-14** 22:00 — Inferno Club, São Paulo/SP — R$ 30 — Dia dos namorados — repertório especial.  
5. **2025-11-08** 21:30 — Sesc Bom Retiro, São Paulo/SP — Grátis · lotação esgotada — Sessão realizada — arquivo.  

(Endereços e links completos estão no código.)

---

## Painel admin (trechos visíveis ao utilizador)

Ficheiro `AdminAgenda.tsx` — exemplos: toasts “Show incluído na agenda.”, “Show removido.”; título do login; “Fechar”; labels de formulário. Para lista completa, ver componente.

---

*Última consolidação a partir do repositório local.*
