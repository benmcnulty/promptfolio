// components/header.tsx
import * as React from "react";
import strings from "@/lib/strings";
import Image from "next/image";

export function Header() {
  return (
    <header className="text-center relative mx-[-24px] md:mx-[-48px] lg:mx-[-64px] xl:mx-[-96px] mt-0">
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="relative z-10 p-4">
        <div className="bg-black bg-opacity-50 p-4 rounded mb-4 inline-block">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
            {strings.header.siteTitle}
          </h1>
          <h2 className="text-3xl font-semibold tracking-tight border-b pb-2 text-white">
            {strings.header.siteSubtitle}
          </h2>
        </div>
        <div className="bg-black bg-opacity-50 p-4 rounded inline-block max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold tracking-tight mb-4 text-white">
            {strings.welcomeSection.heading}
          </h3>
          <p className="leading-7 mb-6 text-white">
            {strings.welcomeSection.introduction}
          </p>
          <p className="leading-7 text-white">
            {strings.welcomeSection.content}
          </p>
        </div>
      </div>
    </header>
  );
}
