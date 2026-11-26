import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training & Certifications",
  description:
    "Industry-oriented technical bootcamps, certifications, career mentoring, and placement support by Zeony Academy.",
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
