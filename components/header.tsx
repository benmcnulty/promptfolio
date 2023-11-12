// components/header.tsx
import * as React from "react";
import strings from "@/lib/strings";

export function Header() {
  return (
    <header className="items-center justify-between p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        {strings.header.siteTitle}
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        {strings.header.siteSubtitle}
      </h2>
    </header>
  );
}
