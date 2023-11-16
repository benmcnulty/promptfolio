// components/footer.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { ModeToggle } from "./ui/ModeToggle";
import { ThreadsButton } from "./ThreadsButton";
import { GitHubButton } from "./GitHubButton";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 items-center text-center">
        <div className="md:text-left">
          <h4 className="text-xl font-semibold tracking-tight mb-2">
            {strings.footer.heading}
          </h4>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div>
            <ModeToggle />
          </div>
          <div className="flex justify-center items-center space-x-4">
            <ThreadsButton />
            <GitHubButton />
          </div>
        </div>

        <div className="md:text-right">
          <h5 className="text-xl font-semibold tracking-tight mb-2">
            {strings.footer.subheading}
          </h5>
        </div>
      </div>
      <p className="leading-7 text-center mt-6">{strings.footer.conclusion}</p>
      <p className="leading-7 text-center mt-2">{strings.footer.extra}</p>
      <p className="leading-7 text-center">{strings.footer.copyright}</p>
    </footer>
  );
}
