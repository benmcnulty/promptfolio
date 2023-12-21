// component/Persona.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import strings from "@/lib/strings";
import { Sparkle } from "./ui/sparkle";
import CatalogItem from "@/lib/types";
import {
  StarIcon,
  BackpackIcon,
  ChatBubbleIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";

interface PersonaProps {
  personaData: CatalogItem;
}

const labelIcons: { [key: string]: React.ElementType } = {
  featured: StarIcon,
  work: BackpackIcon,
  chat: ChatBubbleIcon,
  art: Pencil2Icon,
};

export function Persona({ personaData }: PersonaProps) {
  const icons = personaData.labels.map((label) => {
    const Icon = labelIcons[label];
    return Icon ? (
      <Icon key={label} className={`my-1 w-[2rem] h-[2rem] lift`} />
    ) : null;
  });

  return (
    <div className="flex flex-col justify-between w-full max-w-md mx-0 my-0 bg-white rounded-lg shadow-md overflow-hidden flex-auto sm:w-[48%] lg:w-1/3 xl:w-1/4">
      <div className="relative w-full">
        <Image
          alt={personaData.alt}
          src={personaData.image}
          className="object-cover w-full"
          width={1024}
          height={1024}
        />
        <div className="absolute top-0 right-0 m-2 flex-1 p-1">{icons}</div>
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-center">
          <h2 className="text-xl font-bold">{personaData.name}</h2>
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <p className="text-sm text-gray-500">{personaData.description}</p>
        <div className="w-full mt-4">
          <Button variant="default" asChild className="w-full h-[3rem]">
            <Link
              href={personaData.link}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Sparkle width="12%" className="flip sparkle shaded mx-4" />
              {strings.listing.button + " " + personaData.name}
              <Sparkle width="12%" className="sparkle shaded mx-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
