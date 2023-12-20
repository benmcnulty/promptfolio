// component/Listing.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import strings from "@/lib/strings";
import { Persona } from "@/components/Persona";
import filterCatalog from "@/utils/filterCatalog";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";

export function Listing() {
  const [filteredCatalog, setFilteredCatalog] =
    useState<CatalogItem[]>(catalog);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Client-side URL processing
    if (typeof window !== "undefined") {
      const initialFilter = searchParams.get("filter");
      setFilteredCatalog(
        initialFilter ? filterCatalog(catalog, [initialFilter]) : catalog
      );
    }
  }, [searchParams]);

  // Add label toggle UI component here

  return (
    <section className="flex flex-col items-center p-6 text-center max-w-7xl mx-auto">
      <h3 className="text-3xl font-semibold tracking-tight mb-6">
        {strings.listing.heading}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {filteredCatalog.map((persona, index) => (
          <Persona key={index} personaData={persona} />
        ))}
      </div>
    </section>
  );
}
