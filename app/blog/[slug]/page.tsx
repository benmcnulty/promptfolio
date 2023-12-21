// app/blog/page.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SlugPage() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <Footer />
    </main>
  );
}
