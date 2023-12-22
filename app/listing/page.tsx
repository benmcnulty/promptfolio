// app/listing/page.tsx
import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Listing } from "@/components/Listing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom GPTs",
  description: "GPTs Engineered for Work, Chat, & Art",
};

export default function ListingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <Listing />
      <Footer />
    </main>
  );
}
