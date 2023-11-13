// components/footer.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { ModeToggle } from "./ui/ModeToggle";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
        <div className="md:text-left">
          <h4 className="text-xl font-semibold tracking-tight mb-2">
            {strings.footer.heading}
          </h4>
          <p className="leading-7">{strings.footer.conclusion}</p>
        </div>

        <div className="md:col-start-2">
          <ModeToggle />
        </div>

        <div className="md:text-right">
          <h5 className="text-xl font-semibold tracking-tight mb-2">
            {strings.footer.subheading}
          </h5>
          <p className="leading-7">{strings.footer.copyright}</p>
          <p className="leading-7">{strings.footer.extra}</p>
        </div>
      </div>
    </footer>
  );
}
