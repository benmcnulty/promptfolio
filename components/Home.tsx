// component/Home.tsx
import { Welcome } from "./Welcome";
import { FeaturedListings } from "./FeaturedListings";
import { CustomListings } from "./CustomListings";

export function Home() {
  return (
    <section className="flex flex-col items-center text-center w-full">
      <Welcome />
      <FeaturedListings />
      <CustomListings
        gptNames={["Brainstormer", "Strategy"]}
        headline="Get Creative!"
        backgroundClass="bg-muted"
      />
      <CustomListings
        gptNames={["GPT QA", "Red Team"]}
        headline="Get Inspired!"
        backgroundClass="radial-gradient-bg"
      />
    </section>
  );
}
