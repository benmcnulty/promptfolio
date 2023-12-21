// component/Home.tsx
import { Welcome } from "./Welcome";
import { FeaturedListings } from "./FeaturedListings";
import { CustomListings } from "./CustomListings";

export function Home() {
  return (
    <section className="flex flex-col items-center text-center w-full">
      <Welcome />
      <CustomListings
        gptNames={["Prompt Mentor", "Prompt Engineer"]}
        headline="Start Prompting!"
        backgroundClass="bg-muted"
      />
      <CustomListings
        gptNames={["Brainstormer", "Strategy"]}
        headline="Get Creative!"
        backgroundClass="radial-gradient-bg"
      />
      <CustomListings
        gptNames={[
          "Web App Prototyper",
          "Interaction Designer",
          "Graphic Designer",
        ]}
        headline="Build a Web App!"
        backgroundClass="bg-muted"
      />
      <FeaturedListings />
    </section>
  );
}
