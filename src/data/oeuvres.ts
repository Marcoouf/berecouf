// src/data/oeuvres.ts
export interface Oeuvre {
  id: string;
  titre: string;
  artiste: string;
  image: string;
  width: number;
  height: number;
}

export const oeuvres = [
    {
      id: "1",
      titre: "Lueur abstraite",
      image: "/images/oeuvre1.webp",
      artiste: "Artiste A",
      width: 1024,
      height: 1536,
    },
    {
      id: "2",
      titre: "Défragmentation",
      image: "/images/oeuvre2.webp",
      artiste: "Artiste B",
      width: 1024,
      height: 1024,

    },
    {
      id: "3",
      titre: "Nuances éthérées",
      image: "/images/oeuvre3.webp",
      artiste: "Artiste C",
      width: 1024,
      height: 1536,
    },
    {
        id: "4",
        titre: "Plage Quinéville",
        image: "/images/oeuvre4.webp",
        artiste: "Artiste D",
        width: 1024,
        height: 1536,
      },
      {
        id: "5",
        titre: "Promenade à Quinéville",
        image: "/images/oeuvre5.webp",
        artiste: "Bérénice Duchemin",
        width: 2480,
        height: 1770,
      },
      {
        id: "6",
        titre: "Coup de soleil",
        image: "/images/oeuvre6.webp",
        artiste: "Bérénice Duchemin",
        width: 640,
        height: 640,
      },
      {
        id: "7",
        titre: "Soirée folle",
        image: "/images/oeuvre7.webp",
        artiste: "Marcouf Lebar",
        width: 1565,
        height: 1037,
      },
  ];
  