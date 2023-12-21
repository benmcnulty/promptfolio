// component/CustomListings.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Persona } from "./Persona";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";

interface CustomListingsProps {
  gptNames: string[];
  headline: string;
  backgroundClass: string;
}

export function CustomListings({
  gptNames,
  headline,
  backgroundClass,
}: CustomListingsProps) {
  const [customCatalog, setCustomCatalog] = useState<CatalogItem[]>([]);

  useEffect(() => {
    const selectedItems = catalog.filter((item) =>
      gptNames.includes(item.name)
    );
    setCustomCatalog(selectedItems);
  }, [gptNames]);

  return (
    <section
      className={`flex flex-col items-center p-4 text-center w-full mx-0 ${backgroundClass}`}
    >
      <h3 className="text-3xl font-semibold tracking-tight transition-all mb-4">
        {headline}
      </h3>
      <div className="flex flex-wrap justify-center gap-4 md:gap-4 lg:gap-6 w-full transition-all">
        {customCatalog.map((persona, index) => (
          <Persona key={index} personaData={persona} />
        ))}
      </div>
    </section>
  );
}
