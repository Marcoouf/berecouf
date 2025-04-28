// src/app/page.tsx
"use client";

import ExplodingTitle from "@/components/ExplodingTitle";
import Galerie from "@/components/Galerie";

export default function Home() {
  return (
    <main className="flex flex-col overflow-x-hidden bg-gradient-to-b from-black to-fuchsia-600 text-white">
      {/* Titre plein écran */}
      <div className="h-screen">
        <ExplodingTitle />
      </div>

      {/* Galerie */}
      <div className="px-4 py-12">
        <Galerie />
      </div>
    </main>
  );
}
