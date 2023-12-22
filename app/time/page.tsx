// app/time/page.tsx
import React, { useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Time } from "@/components/Time";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time API",
  description: "Endpoint that returns the current time",
};

export default function TimePage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <Time />
      <Footer />
    </main>
  );
}
