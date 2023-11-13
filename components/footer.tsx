// components/footer.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { ModeToggle } from "./ui/ModeToggle";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center p-6 text-center">
      <h4 className="text-xl font-semibold tracking-tight mb-4">
        {strings.footer.heading}
      </h4>
      <h5 className="text-xl font-semibold tracking-tight mb-4">
        {strings.footer.subheading}
      </h5>
      <p className="leading-7">{strings.footer.copyright}</p>

      <div className="fixed bottom-0 left-0 m-4">
        <ModeToggle />
      </div>
    </footer>
  );
}
