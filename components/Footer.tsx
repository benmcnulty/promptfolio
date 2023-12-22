// components/footer.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { ModeToggle } from "./ui/mode-toggle";
import { ThreadsButton } from "./ThreadsButton";
import { GitHubButton } from "./GitHubButton";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 py-4 px-6 w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start md:items-center text-center md:text-left mb-4">
        <div className="md:text-left">
          <h4 className="text-lg md:text-xl font-semibold mt-2 mb-0">
            {strings.footer.heading}
          </h4>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0">
          <div className="mb-4 md:mb-0 md:mr-8">
            <ModeToggle />
          </div>
          <div className="flex justify-center items-center space-x-4 md:space-x-6 md:ml-8">
            <ThreadsButton />
            <GitHubButton />
          </div>
        </div>

        <div className="md:text-right">
          <h5 className="text-lg md:text-xl font-semibold mt-2">
            {strings.footer.subheading}
          </h5>
        </div>
      </div>
      <p className="leading-7 text-center mt-1">{strings.footer.conclusion}</p>
      <p className="leading-7 text-center mt-0">{strings.footer.conclusion2}</p>
      <p className="leading-7 text-center mt-2">{strings.footer.extra}</p>
      <p className="leading-7 text-center mt-0">{strings.footer.copyright}</p>
    </footer>
  );
}
//
