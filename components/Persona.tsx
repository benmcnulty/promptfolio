// component/Persona.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import strings from "@/lib/strings";

interface PersonaProps {
  personaData: {
    name: string;
    description: string;
    link: string;
    image: string;
    alt: string;
  };
}

export function Persona({ personaData }: PersonaProps) {
  return (
    <div className="flex flex-col justify-between w-full max-w-md mx-auto my-4 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full">
        <Image
          alt={personaData.alt}
          src={personaData.image}
          className="object-cover w-full"
          width={100}
          height={100}
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-center">
          <h2 className="text-xl font-bold">{personaData.name}</h2>
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <p className="text-sm text-gray-500">{personaData.description}</p>
        <div className="w-full mt-4">
          <Button variant="default" asChild className="w-full">
            <Link
              href={personaData.link}
              rel="noopener noreferrer"
              target="_blank"
            >
              {strings.listing.button +
                personaData.name +
                strings.listing.buttonCap}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
