import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Start a project, request a product demo, or inquire about institutional training with Zeony Technologies.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
