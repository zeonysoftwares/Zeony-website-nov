import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital & Engineering Services",
  description:
    "Full-stack web development, mobile applications, UI/UX design, custom enterprise software, AI consulting, and corporate training.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
