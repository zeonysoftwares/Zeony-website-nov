import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Members",
  description:
    "Meet the engineering, UI/UX design, cloud architecture, and technical mentorship specialists at Zeony Technologies.",
};

export default function TeamMembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
