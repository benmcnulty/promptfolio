import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/sparkle";
import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between">
      <Header />
      <article className="blog-post mt-0 mb-6 sm:mt-6 w-full mx-auto p-6 bg-card shadow-md overflow-hidden text-center">
        {children}
        <div className="mx-auto mt-4 w-[90%] sm:w-[45%] md:w-[40%] lg:w-[33%]">
          <Button variant="default" asChild className="w-full h-[3rem]">
            <Link href="/blog">
              <Sparkle width="12%" className="flip sparkle shaded mx-4" />
              Back to Blog
              <Sparkle width="12%" className="sparkle shaded mx-4" />
            </Link>
          </Button>
        </div>
      </article>
      <Footer />
    </main>
  );
}
