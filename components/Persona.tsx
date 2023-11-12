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
  };
}

export function Persona({ personaData }: PersonaProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-8 mx-auto my-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <Image
        alt="Profile image"
        height={128}
        width={128}
        src={personaData.image}
        className="object-cover w-32 h-32 mx-auto rounded-full"
      />
      <div className="mt-4 text-center">
        <h1 className="text-xl font-medium text-gray-700 dark:text-white">
          {personaData.name}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {personaData.description}
        </p>
      </div>
      <div className="flex justify-around w-full mt-4">
        <Button variant="default" asChild>
          <Link
            href={personaData.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            {strings.listing.tryIt + personaData.name + "! ✨"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
