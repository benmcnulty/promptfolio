// component/Welcome.tsx
import strings from "@/lib/strings";

export function Welcome() {
  return (
    <section className="flex flex-col items-center p-6 text-center radial-gradient-bg w-full">
      <div className="bg-background p-4 rounded block max-w-2xl mx-auto welcome-shadow">
        <h3 className="text-3xl font-semibold tracking-tight text-foreground">
          {strings.welcomeSection.heading}
        </h3>
        <p className="leading-7 text-foreground">
          {strings.welcomeSection.content}
        </p>
      </div>
    </section>
  );
}
