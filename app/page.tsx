import { Fruit } from "@/types/fruit";
import { FruitContainer } from "@/components/fruit-container";
import { JarContainer } from "@/components/jar-container";
import { Suspense } from "react";

async function getFruits(): Promise<Fruit[]> {
  const response = await fetch(
    "https://wcz3qr33kmjvzotdqt65efniv40kokon.lambda-url.us-east-2.on.aws/",
    { cache: 'force-cache' }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch fruits");
  }

  return response.json();
}

export default async function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          <Suspense fallback={<div>Loading...</div>}>
            <Fruits />
          </Suspense>
          <div className="lg:sticky lg:top-8 h-[calc(100vh-150px)]">
            <JarContainer />
          </div>
        </div>
      </div>
    </main>
  );
}

async function Fruits() {
  const fruits = await getFruits();
  return <FruitContainer initialFruits={fruits} />;
}
