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
      <article className="blog-post m-0 w-full mx-auto bg-muted shadow-md overflow-hidden text-center">
        {children}
        <div className="mx-auto mt-4 w-[90%] sm:w-[45%] md:w-[40%] lg:w-[33%]">
          <Button variant="default" asChild className="w-full h-[3rem] mt-4">
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
