"use client";
import Masonry from "react-masonry-css";
import { oeuvres } from "@/data/oeuvres";
import { motion } from "framer-motion";
import Image from "next/image"; // n'oublie pas cet import en haut du fichier
export default function Galerie() {
  const breakpoints = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <div className="p-4">
  
<Masonry
        breakpointCols={breakpoints}
        className="flex gap-6"
        columnClassName="space-y-6"
      >
        {oeuvres.map((oeuvre, index) => (
          <motion.div
            key={oeuvre.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl shadow-lg group"
          >
            {/* Image */}
            <Image
  src={oeuvre.image}
  alt={oeuvre.titre}
  width={500} // tu peux ajuster selon ton layout
  height={700}
  className="w-full h-auto object-cover transition-all duration-500 ease-in-out group-hover:blur-sm select-none"
  draggable={false}
  onContextMenu={(e) => e.preventDefault()}
/>
            {/* Légende au hover */}
            <div className="absolute bottom-0 left-0 w-full p-4 text-white text-sm bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm">
              <strong>{oeuvre.titre}</strong> – {oeuvre.artiste}
            </div>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
}
