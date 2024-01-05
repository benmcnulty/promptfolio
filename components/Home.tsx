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
        gptName="Management"
        subheading="Your Gateway to Task Assignment and Project Planning"
        additionalContent="Management is your starting point for leveraging our expert, dedicated GPT consultants to turn complex ideas into professional outputs. Ask Management how Promptfolio GPTs can streamline your project planning and execution today."
        backgroundClass="bg-muted"
        greeting="Introducing"
      />
      <CustomListings
        gptNames={[
          "Web App Prototyper",
          "Interaction Designer",
          "Graphic Designer",
        ]}
        headline="Building a Web App?"
        backgroundClass="blue-gradient-bg"
      />
      <FocusListing
        gptName="Brainstormer"
        subheading="Unleash Creativity and Innovation"
        additionalContent="Discover the power of Brainstormer, a GPT designed to fuel your creative process. Whether you're tackling complex problems or seeking fresh perspectives, Brainstormer is your partner in brainstorming innovative solutions."
        backgroundClass="background"
        greeting="Meet"
      />
      <CustomListings
        gptNames={["Strategy", "Rubber Ducky", "Researcher"]}
        headline="Need more inspiration?"
        backgroundClass="green-gradient-bg"
      />
      <FocusListing
        gptName="Prompt Mentor"
        subheading="Start your professional prompt crafting journey!"
        additionalContent="Let Prompt Mentor guide you along your career path from software into prompt engineering. Whether you're a student, a recent graduate, or a seasoned professional, Prompt Mentor is here to help you find your way."
        backgroundClass="bg-muted"
        greeting="Consult"
      />
      <CustomListings
        gptNames={["Prompt QA", "Prompt Engineer", "Red Team"]}
        headline="Create your own GPTs!"
        backgroundClass="radial-gradient-bg"
      />
      <FeaturedListings />
    </section>
  );
}
