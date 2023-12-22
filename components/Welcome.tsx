// component/Welcome.tsx
import strings from "@/lib/strings";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkle } from "./ui/sparkle";

export function Welcome() {
  return (
    <section className="flex flex-col items-center p-6 text-center radial-gradient-bg w-full">
      <div className="bg-background bg-opacity-50 py-4 px-8 rounded block max-w-2xl mx-auto welcome-shadow">
        <h3 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
          {strings.welcomeSection.heading}
        </h3>
        <p className="leading-7 text-foreground mb-4">
          {strings.welcomeSection.content}
        </p>
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
