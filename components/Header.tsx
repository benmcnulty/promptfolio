// components/header.tsx
import * as React from "react";
import strings from "@/lib/strings";
import { Navigation } from "./Navigation";
import { Sparkle } from "./ui/sparkle";

export function Header() {
  return (
    <header className="text-center relative block w-full mt-0 hero-image">
      <div className="relative z-10 p-4 text-container">
        <div className="mb-1 inline-block">
          <div className="flex justify-center items-center">
            <div className="flex-1 heading-sparkle">
              <Sparkle className="shadow" />
            </div>
            <div className="flex flex-col items-center px-4">
              <h1 className="text-5xl font-extrabold tracking-tight lg:text-5xl text-white text-shadow">
                {strings.header.siteTitle}
              </h1>
              <h2 className="text-2xl font-semibold tracking-tight pb-2 text-white text-shadow">
                {strings.header.siteAuthor}
              </h2>
            </div>
            <div className="flex-1 heading-sparkle second-sparkle">
              <Sparkle className="flip shadow" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white text-shadow inline-block border-b">
            {strings.header.siteSubtitle}
          </h2>
        </div>

        <Navigation />

        <div className="bg-black bg-opacity-70 p-4 rounded block max-w-2xl mx-auto shadow-lg">
          <h3 className="text-3xl font-semibold tracking-tight text-white">
            {strings.welcomeSection.heading}
          </h3>
          <div className="sparkle-divider">
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
          </div>

          <p className="leading-7 text-white">
            {strings.welcomeSection.content}
          </p>
        </div>
      </div>
    </header>
  );
}
