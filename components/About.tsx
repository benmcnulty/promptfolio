// component/About.tsx
import React from "react";
import strings from "@/lib/strings";
import { FeaturedListings } from "./FeaturedListings";

export function About() {
  return (
    <section className="flex flex-col items-center text-center p-0 w-full bg-muted">
      <div className="w-full pt-6 radial-gradient-bg">
        <h2 className="text-4xl font-bold mb-4">{strings.about.heading}</h2>
        <p className="text-lg mb-6 px-8 w-full sm:w-[80%] md:w-[60%] xl:w-[40%] mx-auto text-shadow">
          {strings.about.content}
        </p>
        <div className="bg-background p-6 block mx-auto shadow-lg">
          <h3 className="text-3xl font-semibold mb-4">
            {strings.about.heading2}
          </h3>
          <p className="text-lg mb-6 px-8 w-full sm:w-[80%] md:w-[60%] xl:w-[40%] mx-auto">
            {strings.about.bio}
          </p>
          <p className="text-lg px-8 w-full sm:w-[80%] md:w-[60%] xl:w-[40%] mx-auto">
            {strings.about.bio2}
          </p>
        </div>
      </div>
      <div className="mt-0 w-full">
        <FeaturedListings />
      </div>
    </section>
  );
}
