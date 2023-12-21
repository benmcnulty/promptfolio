// component/FeaturedListings.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Persona } from "./Persona";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";
import { StarFilledIcon } from "@radix-ui/react-icons";

export function FeaturedListings() {
  const [featuredCatalog, setFeaturedCatalog] = useState<CatalogItem[]>([]);

  useEffect(() => {
    // Filter only featured catalog items
    const featuredItems = catalog.filter((item) =>
      item.labels.includes("featured")
    );
    setFeaturedCatalog(featuredItems);
  }, []);

  return (
    <section className="flex flex-col items-center p-4 text-center max-w-7xl mx-auto">
      <h3 className="text-3xl font-semibold tracking-tight transition-all mb-4">
        <StarFilledIcon
          className="inline-block align-middle"
          style={{ height: "1.75rem", width: "1.75rem" }}
        />{" "}
        Featured GPTs{" "}
        <StarFilledIcon
          className="inline-block align-middle"
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
