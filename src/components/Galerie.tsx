// src/components/Galerie.tsx
"use client";

import Image from "next/image";
import { oeuvres } from "@/data/oeuvres";

export default function Galerie() {
  return (
    <div className="p-6">
      <div
        className="
          columns-1
          sm:columns-2
          lg:columns-3
          gap-6
          space-y-6
        "
      >
        {oeuvres.map((oeuvre) => {
          // On calcule le ratio hauteur / largeur en % pour le padding-bottom
          const ratio = (oeuvre.height / oeuvre.width) * 100 + "%";

          return (
            <div
              key={oeuvre.id}
              className="break-inside-avoid"
            >
              {/* Conteneur à ratio conservé */}
              <div
                className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black"
                style={{ paddingBottom: ratio }}
              >
                <Image
                  src={oeuvre.image}
                  alt={oeuvre.titre}
                  fill
                  className="object-cover transition-all duration-500 ease-in-out group-hover:blur-sm"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                {/* légende masquée par défaut */}
                <div className="
                  absolute bottom-0 left-0 w-full
                  bg-black/60 text-white text-sm
                  p-3 opacity-0
                  hover:opacity-100
                  transition-opacity duration-300
                ">
                  <strong>{oeuvre.titre}</strong> — {oeuvre.artiste}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
