// component/Welcome.tsx
import strings from "@/lib/strings";

export function Welcome() {
  return (
    <section className="flex flex-col items-center p-6 text-center max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold tracking-tight mb-4">
        {strings.welcomeSection.heading}
      </h3>
      <p className="leading-7 mb-6">{strings.welcomeSection.introduction}</p>
      <p className="leading-7 mb-6">{strings.welcomeSection.content}</p>
    </section>
  );
}
