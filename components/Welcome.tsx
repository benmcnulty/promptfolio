import strings from "@/lib/strings";

export function Welcome() {
  return (
    <section>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {strings.welcomeSection.heading}
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {strings.welcomeSection.introduction}
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {strings.welcomeSection.content}
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {strings.welcomeSection.conclusion}
      </p>
    </section>
  );
}
