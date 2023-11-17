// app/time/page.tsx
import React, { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Time } from "@/components/Time";

export const TimePage = () => {
  return (
    <>
      <main className="flex flex-col min-h-screen items-center justify-between">
        <Header />
        <Time />
        <Footer />
      </main>
    </>
  );
};

export default TimePage;
