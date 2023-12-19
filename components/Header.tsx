// components/header.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { Navigation } from "./Navigation";
import { Sparkle } from "./ui/sparkle";

export function Header() {
  return (
    <header className="text-center relative block w-full my-0 hero-image animated-bg">
      <div className="relative z-10 p-4 text-container">
        <div className="mb-1 inline-block">
          <div className="flex justify-center items-center">
            <div className="flex-1 heading-sparkle">
              <Sparkle className="flip shadow" />
            </div>
            <div className="flex flex-col items-center px-1 md:px-4">
              <h1 className="text-5xl font-extrabold tracking-tight lg:text-5xl text-white header-shadow">
                {strings.header.siteTitle}
              </h1>
              <h2 className="text-2xl font-semibold tracking-tight pb-2 text-white header-shadow">
                {strings.header.siteAuthor}
              </h2>
            </div>
            <div className="flex-1 heading-sparkle second-sparkle">
              <Sparkle className="shadow" />
            </div>
          </div>
          <h2 className="text-1xl font-semibold tracking-tight text-white header-shadow inline-block border-b">
            {strings.header.siteSubtitle}
          </h2>
        </div>

        <Navigation />
      </div>
    </header>
  );
}
