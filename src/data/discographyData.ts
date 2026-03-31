/**
 * Discografia — fonte única para o carrossel.
 * spotifyFound: true apenas com URL verificada.
 */

export type DiscographyRelease = {
  year: string;
  title: string;
  format: string;
  spotifyUrl: string | null;
  spotifyFound: boolean;
  localCoverPath?: string;
  coverUrlOverride?: string;
};

export type DiscographyProject = {
  project: string;
  role: string;
  releases: DiscographyRelease[];
};

export type DiscographyFlatItem = DiscographyRelease & {
  project: string;
  role: string;
  flatId: string;
};

export const discographyData: DiscographyProject[] = [
  {
    project: "Crazy Legs",
    role: "Vocal/Guitarra",
    releases: [
      {
        year: "2000",
        title: "Off Society Rules",
        format: "Álbum",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2002",
        title: "Right on Time",
        format: "Álbum",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2002",
        title: "Live to Win",
        format: "Álbum",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2003",
        title: "Rockabilly Riot",
        format: "Álbum",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2006",
        title: "Compacto duplo",
        format: "Vinil",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2009",
        title: "Green Men From Mars",
        format: "CD",
        spotifyUrl: "https://open.spotify.com/album/1nIbcAePCImnwo2c6WzLFM",
        spotifyFound: true,
      },
      {
        year: "2009",
        title: "Cine-Lapa",
        format: "DVD · Rio de Janeiro/RJ",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2005–2013",
        title: "Coletâneas distribuídas na Europa e EUA",
        format: "Coletâneas",
        spotifyUrl: null,
        spotifyFound: false,
      },
    ],
  },
  {
    project: "Caio Durazzo Rock N Roll Trio",
    role: "Vocal/Guitarra/Compositor",
    releases: [
      {
        year: "2011",
        title: "Caio Durazzo Rock N Roll Trio",
        format: "Álbum",
        spotifyUrl: "https://open.spotify.com/album/1j6GJw4SBQh0O7TD3F8FNC",
        spotifyFound: true,
      },
      {
        year: "2013",
        title: "Rock Ducarazzo",
        format: "Álbum",
        spotifyUrl: "https://open.spotify.com/album/62VQ9MmnNpPydpESfoVKQj",
        spotifyFound: true,
      },
      {
        year: "2012",
        title: "Drinks And Parts",
        format: "Coletânea",
        spotifyUrl: null,
        spotifyFound: false,
      },
    ],
  },
  {
    project: "Caio Durazzo One Man Band",
    role: "Vocal/Guitarra/Bateria/Compositor",
    releases: [
      {
        year: "2014",
        title: "Rock N Roll É UTI",
        format: "Álbum",
        spotifyUrl: "https://open.spotify.com/album/4VvA9KF4qgcWur92boERrH",
        spotifyFound: true,
      },
      {
        year: "2016",
        title: "Stay Rock Brazil",
        format: "Bootleg",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2016",
        title: "Weirdo Fervo #2",
        format: "Vinil 12″",
        spotifyUrl: "https://open.spotify.com/album/7lzDyqKMOIe3pNhwtyC8HP",
        spotifyFound: true,
      },
    ],
  },
  {
    project: "Made in Brazil",
    role: "Guitarrista",
    releases: [
      {
        year: "2009",
        title: "Rock de Verdade",
        format: "Álbum",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2015",
        title: "48 anos",
        format: "DVD · Centro Cultural São Paulo",
        spotifyUrl: null,
        spotifyFound: false,
      },
    ],
  },
  {
    project: "Alex Valenzi & The Hideaway Cats",
    role: "Guitarrista",
    releases: [
      {
        year: "2008",
        title: "Rockabilly Join",
        format: "DVD",
        spotifyUrl: null,
        spotifyFound: false,
      },
    ],
  },
  {
    project: "Participações",
    role: "Vocal/Guitarra",
    releases: [
      {
        year: "2007",
        title: "Pepe Bueno – Nariz de Porco Não É Tomada",
        format: "Faixa: Garota de Má Sorte",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2005",
        title: "XX Feira de Artes da Vila Pompéia",
        format: "Faixa: Galaxie500",
        spotifyUrl: null,
        spotifyFound: false,
      },
    ],
  },
  {
    project: "Demos",
    role: "",
    releases: [
      {
        year: "1998",
        title: "Os Véio",
        format: "Demo",
        spotifyUrl: null,
        spotifyFound: false,
      },
      {
        year: "2005",
        title: "Galaxie 500",
        format: "Demo",
        spotifyUrl: null,
        spotifyFound: false,
      },
    ],
  },
];

export function flattenDiscography(projects: DiscographyProject[]): DiscographyFlatItem[] {
  return projects.flatMap((p, pi) =>
    p.releases.map((r, ri) => ({
      ...r,
      project: p.project,
      role: p.role,
      flatId: `d-${pi}-${ri}`,
    })),
  );
}
