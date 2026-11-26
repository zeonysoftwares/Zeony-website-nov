import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership Team",
  description:
    "Meet the executive leadership guiding product strategy, UI/UX design, and software architecture at Zeony Technologies.",
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
