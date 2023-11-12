// components/footer.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { ModeToggle } from "./ui/ModeToggle";

export function Footer() {
  return (
    <footer className="relative w-full">
      {/* Footer content */}
      <h3 className="text-xl font-semibold tracking-tight p-4">
        {strings.footer.content}
      </h3>

      {/* Mode toggle container */}
      <div className="absolute bottom-0 right-0 m-4">
        <ModeToggle />
      </div>
    </footer>
  );
}
