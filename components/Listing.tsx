// component/Listing.tsx
import strings from "@/lib/strings";
import { Persona } from "@/components/Persona";
import gpts from "@/lib/gpts";

export function Listing() {
  return (
    <section className="flex flex-col items-center p-6 text-center max-w-7xl mx-auto">
      <h3 className="text-2xl font-semibold tracking-tight mb-6">
        {strings.listing.heading}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {gpts.map((persona, index) => (
          <Persona key={index} personaData={persona} />
        ))}
      </div>
    </section>
  );
}
