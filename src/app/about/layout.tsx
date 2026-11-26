import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover Zeony Technologies—our mission, engineering values, milestones, and dedication to building resilient software and empowering tech talent.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
