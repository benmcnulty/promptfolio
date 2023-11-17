// app/page.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Listing } from "@/components/Listing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <Listing />
      <Footer />
    </main>
  );
}
