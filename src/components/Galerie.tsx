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
          // on calcule le ratio hauteur / largeur en % pour le padding-bottom
          const ratio = (oeuvre.height / oeuvre.width) * 100 + "%";

          return (
            <div
              key={oeuvre.id}
              className="break-inside-avoid"
            >
              {/* wrapper `group` pour le hover */}
              <div
                className="group relative w-full rounded-xl overflow-hidden shadow-lg"
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

                {/* légende centrée en bas, sans bg */}
                <div
                  className="
                    absolute inset-x-0 bottom-0
                    text-center text-fuchsia-600 text-sm
                    pb-2
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  "
                >
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
