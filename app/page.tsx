// app/page.tsx
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home } from "@/components/Home";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <div id="main-content">
        <Home />
      </div>
      <Footer />
    </main>
  );
}
