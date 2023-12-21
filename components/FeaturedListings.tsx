// component/FeaturedListings.tsx
import React from "react";
import { Persona } from "./Persona";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";
import { StarIcon } from "@radix-ui/react-icons";

export function FeaturedListings() {
  // Directly filter featured catalog items
  const featuredCatalog: CatalogItem[] = catalog.filter((item) =>
    item.labels.includes("featured")
  );

  return (
    <section className="flex flex-col items-center p-4 text-center mx-auto w-full">
      <h3 className="text-3xl font-semibold tracking-tight transition-all mb-4">
        <StarIcon
          className="mx-2 inline-block align-middle"
          style={{ height: "1.75rem", width: "1.75rem" }}
        />
        Featured GPTs
        <StarIcon
          className="mx-2 inline-block align-middle"
          style={{ height: "1.75rem", width: "1.75rem" }}
        />
      </h3>
      <div className="flex flex-wrap justify-center gap-4 md:gap-4 lg:gap-6 w-full transition-all">
        {featuredCatalog.map((persona, index) => (
          <Persona key={index} personaData={persona} />
        ))}
      </div>
    </section>
  );
}
