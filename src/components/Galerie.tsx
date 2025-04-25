"use client";
import Masonry from "react-masonry-css";
import { oeuvres } from "@/data/oeuvres";
import { motion } from "framer-motion";

export default function Galerie() {
  const breakpoints = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <div className="p-4">
<motion.h1
  initial={{ opacity: 1, scale: 1 }}
  animate={{
    scale: [1, 1.15, 1, 1.1, 1],
    opacity: [1, 0.95, 1, 0.97, 1],
  }}
  transition={{
    duration: 3.2,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.2, 0.4, 0.6, 1],
  }}
  className="text-5xl sm:text-6xl text-center mb-12 
             bg-gradient-to-r from-blue-400 via-indigo-600 to-[#ff00cc] 
             bg-clip-text text-transparent select-none 
             font-[var(--font-playfair)]"
  >
  Berecouf
</motion.h1>      
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
            <img
  src={oeuvre.image}
  alt={oeuvre.titre}
  className="w-full object-cover transition-all duration-500 ease-in-out group-hover:blur-sm select-none"
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
