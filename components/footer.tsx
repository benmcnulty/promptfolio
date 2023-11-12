// components/footer.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { ModeToggle } from "./ui/ModeToggle";

export function Footer() {
  return (
    <footer className="relative w-full">
      {/* Footer content */}
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {strings.footer.heading}
      </h4>
      <h5 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {strings.footer.subheading}
      </h5>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {strings.footer.copyright}
      </p>

      {/* Mode toggle container */}
      <div className="absolute bottom-0 right-0 m-4">
        <ModeToggle />
      </div>
    </footer>
  );
}
