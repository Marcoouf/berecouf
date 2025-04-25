import ExplodingTitle from "@/components/ExplodingTitle";
import Galerie from "@/components/Galerie";

export default function Home() {
  return (
    <main className="min-h-screen text-white flex flex-col">
      <div className="h-screen">
        <ExplodingTitle />
      </div>
      <div className="px-4 py-12">
        <Galerie />
      </div>
    </main>
  );
}
