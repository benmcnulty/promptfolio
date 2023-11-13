// components/header.tsx
import * as React from "react";
import strings from "@/lib/strings";

export function Header() {
  return (
    <header className="flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        {strings.header.siteTitle}
      </h1>
      <h2 className="text-3xl font-semibold tracking-tight border-b pb-2">
        {strings.header.siteSubtitle}
      </h2>
    </header>
  );
}
