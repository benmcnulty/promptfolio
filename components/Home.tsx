// component/Home.tsx
import { Welcome } from "./Welcome";
import { FeaturedListings } from "./FeaturedListings";
import { CustomListings } from "./CustomListings";
import { FocusListing } from "./FocusListing";

export function Home() {
  return (
    <section className="flex flex-col items-center text-center w-full">
      <Welcome />
      <FocusListing
        gptName="Prompt Mentor"
        subheading="Start your professional prompt crafting journey!"
        additionalContent="Let Prompt Mentor guide you along your career path from software into prompt engineering. Whether you're a student, a recent graduate, or a seasoned professional, Prompt Mentor is here to help you find your way."
        backgroundClass="background"
      />
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
