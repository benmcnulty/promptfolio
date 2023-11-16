// components/GitHubButton.tsx
import Link from "next/link";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const GitHubButton = () => (
  <Button variant="ghost" size="icon" asChild>
    <Link
      href="https://github.com/benmcnulty"
      aria-label="GitHub"
      target="_blank"
    >
      <GitHubLogoIcon className="rotate-0 scale-100 transition-all" />
    </Link>
  </Button>
);
