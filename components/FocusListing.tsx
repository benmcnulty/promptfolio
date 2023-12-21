// component/FocusListing.tsx
import React from "react";
import Link from "next/link";
import { Persona } from "./Persona";
import catalog from "@/lib/catalog";
import CatalogItem from "@/lib/types";

interface FocusListingProps {
  gptName: string;
  subheading: string;
  additionalContent: string;
  backgroundClass: string;
}

export function FocusListing({
  gptName,
  subheading,
  additionalContent,
  backgroundClass,
}: FocusListingProps) {
  const personaData: CatalogItem | undefined = catalog.find(
    (item) => item.name === gptName
  );

  if (!personaData) {
    return (
      <div className="text-center my-10">
        <h3 className="text-3xl font-semibold mb-4">Enjoy our Custom GPTs!</h3>
        <Link href="/listing">
          <a className="text-lg text-primary hover:underline">
            See full listing
          </a>
        </Link>
      </div>
    );
  }

  return (
    <section
      className={`flex flex-col justify-center lg:flex-row items-center p-4 my-2 sm:my-4 md:my-4 text-center w-full gap-4 md:gap-4 lg:gap-6 ${backgroundClass}`}
    >
      <div className="w-full max-w-md mx-0 my-0 flex-auto sm:w-[48%] lg:w-1/3 xl:w-1/4">
        <h3 className="text-3xl font-semibold tracking-tight mb-2">
          Introducing {personaData.name}
        </h3>
        <h4 className="text-2xl font-semibold mb-2">{subheading}</h4>
        <p className="text-base mb-4 lg:mb-0">{additionalContent}</p>
      </div>
      <Persona personaData={personaData} />
    </section>
  );
}
