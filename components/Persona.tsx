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
    <div className="flex flex-col justify-between items-center w-full max-w-md p-8 mx-auto my-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div>
        <Image
          alt="Profile image"
          height={128}
          width={128}
          src={personaData.image}
          className="object-cover w-32 h-32 mx-auto rounded-full"
        />
        <div className="flex-1 w-full text-center">
          <h1 className="text-xl font-medium text-gray-700 dark:text-white">
            {personaData.name}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {personaData.description}
          </p>
        </div>
      </div>
      <div className="w-full self-center mt-4">
        <Button variant="default" asChild className="w-full h-12">
          <Link
            href={personaData.link}
            rel="noopener noreferrer"
            target="_blank"
            className="block text-center overflow-hidden whitespace-nowrap overflow-ellipsis"
          >
            {strings.listing.tryIt + personaData.name + " ✨"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
