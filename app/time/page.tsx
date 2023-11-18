// app/time/page.tsx
import React, { useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Time } from "@/components/Time";

export default function TimePage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <Time />
      <Footer />
    </main>
  );
}
