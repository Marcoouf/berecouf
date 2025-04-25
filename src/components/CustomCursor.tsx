"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const colorIndex = useRef(0);
  const direction = useRef(1); // pour aller-retour bleu ↔︎ fuchsia

  const gradientColors = [
    "#3b82f6", // bleu

    "#ff00cc", // fuchsia
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x - 8}px, ${y - 8}px)`;
      }

      const dot = document.createElement("div");
      const color = gradientColors[colorIndex.current];

      dot.className =
        "absolute w-4 h-4 rounded-full blur-md opacity-80 pointer-events-none";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.backgroundColor = color;
      dot.style.transition = "all 0.8s ease-out";
      dot.style.transform = "scale(1)";
      dot.style.position = "absolute";

      if (trailRef.current) {
        trailRef.current.appendChild(dot);

        requestAnimationFrame(() => {
          dot.style.transform = "scale(2)";
          dot.style.opacity = "0";
        });

        setTimeout(() => {
          dot.remove();
        }, 800);

        // Changement de couleur en aller-retour
        colorIndex.current += direction.current;
        if (
          colorIndex.current === gradientColors.length - 1 ||
          colorIndex.current === 0
        ) {
          direction.current *= -1; // inverser sens
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Traînée */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-full h-full z-40 pointer-events-none"
      ></div>

      {/* Curseur central */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-50 w-4 h-4 rounded-full bg-blue-500 pointer-events-none"
      ></div>
    </>
  );
}
