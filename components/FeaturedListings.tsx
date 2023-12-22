// component/FeaturedListings.tsx
import React from "react";
import { Persona } from "./Persona";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";
import { StarIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import Link from "next/link";
import strings from "@/lib/strings";
import { Sparkle } from "./ui/sparkle";

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
      <div className="mt-4 w-[90%] sm:w-[45%] md:w-[40%] lg:w-[33%] xl:max-w-[25%]">
        <Button variant="default" asChild className="w-full h-[3rem] my-2">
          <Link href="/listing">
            <Sparkle width="12%" className="flip sparkle shaded mx-4" />
            {strings.welcomeSection.buttonText1}
            <Sparkle width="12%" className="sparkle shaded mx-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
