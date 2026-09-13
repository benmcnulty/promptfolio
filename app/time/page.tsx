// app/time/page.tsx
import { Time } from "@/components/Time";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time API",
  description: "Endpoint that returns the current time",
  alternates: { canonical: '/time' },
};

export default function TimePage() {
  return <Time />;
}
