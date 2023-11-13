// app/page.tsx
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Welcome } from "@/components/Welcome";
import { Listing } from "@/components/Listing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 md:px-12 lg:px-16 xl:px-24 py-24">
      <Header />
      <Welcome />
      <Listing />
      <Footer />
    </main>
  );
}
