// component/Listing.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Persona } from "@/components/Persona";
import filterCatalog from "@/utils/filterCatalog";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";
import { LabelToggle } from "./LabelToggle";

export function Listing() {
  const [filteredCatalog, setFilteredCatalog] =
    useState<CatalogItem[]>(catalog);
  const [heading, setHeading] = useState("All Custom GPTs");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialFilter = searchParams.get("filter");
      const filters = initialFilter ? initialFilter.split(",") : [];
      setFilteredCatalog(
        filters.length > 0 ? filterCatalog(catalog, filters) : catalog
      );

      // Dynamically set the heading based on filters
      if (filters.length > 0) {
        const formattedFilters = filters.map(
          (filter) => filter.charAt(0).toUpperCase() + filter.slice(1)
        );

        let headingText = "";

        if (formattedFilters.includes("Featured")) {
          headingText = "Featured GPTs";
          const nonFeaturedFilters = formattedFilters.filter(
            (filter) => filter !== "Featured"
          );

          if (nonFeaturedFilters.length > 0) {
            headingText += " and GPTs for ";
            headingText += nonFeaturedFilters.slice(0, -1).join(", ");
            if (nonFeaturedFilters.length > 1) {
              headingText += " & " + nonFeaturedFilters.slice(-1);
            } else {
              headingText += nonFeaturedFilters[0];
            }
          }
        } else {
          headingText = "GPTs for ";
          headingText += formattedFilters.slice(0, -1).join(", ");
          if (formattedFilters.length > 1) {
            headingText += " & " + formattedFilters.slice(-1);
          } else {
            headingText += formattedFilters[0];
          }
        }

        setHeading(headingText);
      } else {
        setHeading("Full List of GPTs");
      }
    }
  }, [searchParams]);

  return (
    <section className="flex flex-col items-center p-4 text-center max-w-7xl mx-auto">
      <h3 className="text-3xl font-semibold tracking-tight">{heading}</h3>
      <LabelToggle />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {filteredCatalog.map((persona, index) => (
          <Persona key={index} personaData={persona} />
        ))}
      </div>
    </section>
  );
}
