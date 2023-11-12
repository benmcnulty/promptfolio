// component/Listing.tsx
import strings from "@/lib/strings";
import { Persona } from "@/components/Persona";
import gpts from "@/lib/gpts";

export function Listing() {
  return (
    <section>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {strings.listing.heading}
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {gpts.map((persona, index) => (
          <Persona key={index} personaData={persona} />
        ))}
      </div>
    </section>
  );
}
