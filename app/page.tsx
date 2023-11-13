// app/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Listing } from "@/components/Listing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 md:px-12 lg:px-16">
      <Header />
      <Listing />
      <Footer />
    </main>
  );
}
