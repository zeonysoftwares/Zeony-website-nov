import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate & Technical Workshops",
  description:
    "Intensive practitioner-led workshops across AI Engineering, Data Science, Full Stack, DevOps, Cybersecurity, and Cloud.",
};

export default function WorkshopsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
