import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Hands-on engineering internships across Web Development, AI/ML, Java Full Stack, Data Analytics, Cybersecurity, UI/UX, and Cloud.",
};

export default function InternshipsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
